import { Currency, CurrencyAmount, ETHER, JSBI, Pair, Percent, Price, Token, TokenAmount } from '@uniswap/sdk'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkIs1155 } from 'utils/checkIs1155'
import { generateErc20 } from 'utils/getHashAddress'
import { PairState, usePair } from '../../data/Reserves'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { wrappedCurrency, wrappedCurrencyAmount } from '../../utils/wrappedCurrency'
import { AppDispatch, AppState } from '../index'
import { tryParseAmount } from '../swap/hooks'
import { useCurrencyBalance, useTokenBalance } from '../wallet/hooks'
import { Field, typeInput } from './actions'

const ZERO = JSBI.BigInt(0)

export function useMintState(): AppState['mint'] {
  return useSelector<AppState, AppState['mint']>(state => state.mint)
}

export function useMintActionHandlers(noLiquidity: boolean | undefined): {
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_A, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity]
  )
  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(typeInput({ field: Field.CURRENCY_B, typedValue, noLiquidity: noLiquidity === true }))
    },
    [dispatch, noLiquidity]
  )

  return {
    onFieldAInput,
    onFieldBInput
  }
}

export function useDerivedMintInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined
): {
  dependentField: Field
  currencies: { [field in Field]?: Currency }
  pair?: Pair | null
  pairState: PairState
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  price?: Price
  noLiquidity?: boolean
  liquidityMinted?: TokenAmount
  poolTokenPercentage?: Percent
  error?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const { independentField, typedValue, otherTypedValue } = useMintState()

  const dependentField = independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A

  // tokens
  const currencies: { [field in Field]?: Token } = useMemo(
    () => ({
      [Field.CURRENCY_A]: generateErc20(wrappedCurrency(currencyA, chainId)),
      [Field.CURRENCY_B]: generateErc20(wrappedCurrency(currencyB, chainId))
    }),
    [currencyA, currencyB, chainId]
  )

  // pair
  const [pairState, pair] = usePair(currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B])
  const totalSupply = useTotalSupply(pair?.liquidityToken)
  const lpBalance = useTokenBalance(account ?? undefined, pair?.liquidityToken)

  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS || Boolean(totalSupply && JSBI.equal(totalSupply.raw, ZERO))

  // balances

  const balanceA = useCurrencyBalance(account ?? undefined, currencyA ?? undefined)
  const balanceB = useCurrencyBalance(account ?? undefined, currencyB ?? undefined)

  const currencyBalances: { [field in Field]?: CurrencyAmount } = useMemo(
    () => ({
      [Field.CURRENCY_A]: balanceA,
      [Field.CURRENCY_B]: balanceB
    }),
    [balanceA, balanceB]
  )

  // amounts
  const independentAmount: CurrencyAmount | undefined = tryParseAmount(
    typedValue,
    currencies[independentField as Field]
  )
  const dependentAmount: CurrencyAmount | undefined = useMemo(() => {
    if (noLiquidity) {
      if (otherTypedValue && currencies[dependentField]) {
        return tryParseAmount(otherTypedValue, currencies[dependentField])
      }
      return undefined
    } else if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = wrappedCurrencyAmount(independentAmount, chainId)
      const [tokenA, tokenB] = [currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B]]
      if (tokenA && tokenB && wrappedIndependentAmount && pair) {
        const dependentCurrency =
          dependentField === Field.CURRENCY_B ? currencies[Field.CURRENCY_B] : currencies[Field.CURRENCY_A]
        const dependentTokenAmount =
          dependentField === Field.CURRENCY_B
            ? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
            : pair.priceOf(tokenB).quote(wrappedIndependentAmount)
        return dependentCurrency === ETHER ? CurrencyAmount.ether(dependentTokenAmount.raw) : dependentTokenAmount
      }
      return undefined
    } else {
      return undefined
    }
  }, [noLiquidity, otherTypedValue, currencies, dependentField, independentAmount, chainId, pair])

  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } = useMemo(
    () => ({
      [Field.CURRENCY_A]: independentField === Field.CURRENCY_A ? independentAmount : dependentAmount,
      [Field.CURRENCY_B]: independentField === Field.CURRENCY_A ? dependentAmount : independentAmount
    }),
    [dependentAmount, independentAmount, independentField]
  )

  const price = useMemo(() => {
    if (noLiquidity) {
      const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts
      if (currencyAAmount && currencyBAmount) {
        return new Price(currencyAAmount.currency, currencyBAmount.currency, currencyAAmount.raw, currencyBAmount.raw)
      }
      return undefined
    } else {
      const wrappedCurrencyA = wrappedCurrency(currencies[Field.CURRENCY_A], chainId)
      return pair && wrappedCurrencyA ? pair.priceOf(wrappedCurrencyA) : undefined
    }
  }, [chainId, currencies, noLiquidity, pair, parsedAmounts])

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    try {
      const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts

      const [tokenAmountA, tokenAmountB] = [
        wrappedCurrencyAmount(currencyAAmount, chainId),
        wrappedCurrencyAmount(currencyBAmount, chainId)
      ]

      if (pair && totalSupply && tokenAmountA && tokenAmountB) {
        if (+tokenAmountA?.toExact() === 0 || +tokenAmountB?.toExact() === 0) {
          return undefined
        }
        return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
      } else {
        return undefined
      }
    } catch (e) {
      console.error(e)
      return undefined
    }
  }, [parsedAmounts, chainId, pair, totalSupply])

  const poolTokenPercentage = useMemo(() => {
    if (totalSupply && pair?.liquidityToken) {
      const balance = lpBalance ?? new TokenAmount(pair?.liquidityToken, JSBI.BigInt(0))
      const amount = liquidityMinted ? balance?.add(liquidityMinted) : balance
      const totalSupplyAmount = liquidityMinted ? totalSupply?.add(liquidityMinted) : totalSupply
      return new Percent(amount.raw, totalSupplyAmount.raw)
    } else {
      return undefined
    }
  }, [liquidityMinted, lpBalance, pair?.liquidityToken, totalSupply])

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  if (pairState === PairState.INVALID) {
    error = error ?? 'Invalid pair'
  }

  if (!parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    error = error ?? 'Enter an amount'
  }

  const { [Field.CURRENCY_A]: currencyAAmount, [Field.CURRENCY_B]: currencyBAmount } = parsedAmounts

  if (currencyAAmount && currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)) {
    error = 'Insufficient ' + currencies[Field.CURRENCY_A]?.symbol + ' balance'
  }

  if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
    error = 'Insufficient ' + currencies[Field.CURRENCY_B]?.symbol + ' balance'
  }

  if (currencyBAmount?.equalTo('0')) {
    error = 'Insufficient ' + currencies[Field.CURRENCY_B]?.symbol + ' amount'
  }

  if (currencyAAmount?.equalTo('0')) {
    error = 'Insufficient ' + currencies[Field.CURRENCY_A]?.symbol + ' amount'
  }

  // if (!liquidityMinted) {
  //   error = error ?? 'Insufficient Amount'
  // }

  const isA1155 = checkIs1155(currencyA)
  const isB1155 = checkIs1155(currencyB)
  if (isA1155 && isB1155) {
    error = error ?? 'Invalid pair'
  }

  return {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  }
}
