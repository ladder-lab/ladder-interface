import { useCallback, useMemo } from 'react'
import { Currency, CurrencyAmount, Fraction, JSBI, Pair, Percent, Token, TokenAmount } from '@ladder/sdk'
import { useDispatch, useSelector } from 'react-redux'
import { generateErc20 } from 'utils/getHashAddress'
import { usePair } from '../../data/Reserves'
import { useTotalSupply } from '../../data/TotalSupply'

import { useActiveWeb3React } from '../../hooks'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { AppDispatch, AppState } from '../index'
import { tryParseAmount } from '../swap/hooks'
import { useTokenBalances } from '../wallet/hooks'
import { Field, typeInput } from './actions'
import { checkIs1155, checkIs721 } from 'utils/checkIs1155'

export function useBurnState(): AppState['burn'] {
  return useSelector<AppState, AppState['burn']>(state => state.burn)
}

export function useDerivedBurnInfo(
  currencyA: Currency | undefined,
  currencyB: Currency | undefined
): {
  pair?: Pair | null
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: CurrencyAmount
    [Field.CURRENCY_B]?: CurrencyAmount
  }
  error?: string
  lpBalance: undefined | TokenAmount
  poolShare: string
  warning: undefined | [string, (() => void) | undefined]
} {
  const { account, chainId } = useActiveWeb3React()
  const { onUserInput: onUserInput } = useBurnActionHandlers()

  const [tokenA, tokenB] = useMemo(
    () => [generateErc20(wrappedCurrency(currencyA, chainId)), generateErc20(wrappedCurrency(currencyB, chainId))],
    [chainId, currencyA, currencyB]
  )

  const { independentField, typedValue } = useBurnState()
  // pair + totalsupply
  const [, pair] = usePair(tokenA, tokenB)

  // balances
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [pair?.liquidityToken])
  const userLiquidity: undefined | TokenAmount = relevantTokenBalances?.[pair?.liquidityToken?.address ?? '']

  const tokens: { [key in Field]?: Token | undefined } = {
    [Field.CURRENCY_A]: tokenA,
    [Field.CURRENCY_B]: tokenB,
    [Field.LIQUIDITY]: pair?.liquidityToken
  }

  // liquidity values
  const totalSupply = useTotalSupply(pair?.liquidityToken)
  const liquidityValueA = useMemo(() => {
    return pair &&
      totalSupply &&
      userLiquidity &&
      tokenA &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
      ? new TokenAmount(tokenA, pair.getLiquidityValue(tokenA, totalSupply, userLiquidity, false).raw)
      : undefined
  }, [pair, tokenA, totalSupply, userLiquidity])
  const liquidityValueB = useMemo(() => {
    return pair &&
      totalSupply &&
      userLiquidity &&
      tokenB &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
      ? new TokenAmount(tokenB, pair.getLiquidityValue(tokenB, totalSupply, userLiquidity, false).raw)
      : undefined
  }, [pair, tokenB, totalSupply, userLiquidity])

  const liquidityValues: { [Field.CURRENCY_A]?: TokenAmount; [Field.CURRENCY_B]?: TokenAmount } = useMemo(() => {
    return {
      [Field.CURRENCY_A]: liquidityValueA,
      [Field.CURRENCY_B]: liquidityValueB
    }
  }, [liquidityValueA, liquidityValueB])

  let percentToRemove: Percent = new Percent('0', '100')
  // user specified a %
  if ((independentField as Field) === Field.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(typedValue, '100')
  }
  // user specified a specific amount of liquidity tokens
  else if ((independentField as Field) === Field.LIQUIDITY) {
    if (pair?.liquidityToken) {
      const independentAmount = tryParseAmount(typedValue, pair.liquidityToken)
      if (independentAmount && userLiquidity && !independentAmount.greaterThan(userLiquidity)) {
        percentToRemove = new Percent(independentAmount.raw, userLiquidity.raw)
      }
    }
  }
  // user specified a specific amount of token a or b
  else {
    if (tokens[independentField as Field]) {
      const independentAmount = tryParseAmount(typedValue, tokens[independentField as Field])
      const liquidityValue = liquidityValues[independentField as keyof typeof liquidityValues]
      if (independentAmount && liquidityValue && !independentAmount.greaterThan(liquidityValue)) {
        percentToRemove = new Percent(independentAmount.raw, liquidityValue.raw)
      }
    }
  }
  const poolShare = totalSupply && userLiquidity ? new Percent(userLiquidity.raw, totalSupply.raw).toFixed(2) : '0'

  const removeAll = typedValue === '100' && poolShare === '100.00'

  const parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: TokenAmount
    [Field.CURRENCY_B]?: TokenAmount
  } = {
    [Field.LIQUIDITY_PERCENT]: percentToRemove,
    [Field.LIQUIDITY]:
      userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
        ? new TokenAmount(userLiquidity.token, percentToRemove.multiply(userLiquidity.raw).quotient)
        : undefined,
    [Field.CURRENCY_A]:
      tokenA && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueA
        ? removeAll
          ? pair?.token0.equals(tokenA)
            ? pair?.reserve0
            : pair?.reserve1
          : new TokenAmount(tokenA, percentToRemove.multiply(liquidityValueA.raw).quotient)
        : undefined,
    [Field.CURRENCY_B]:
      tokenB && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueB
        ? removeAll
          ? pair?.token0.equals(tokenB)
            ? pair?.reserve0
            : pair?.reserve1
          : new TokenAmount(tokenB, percentToRemove.multiply(liquidityValueB.raw).quotient)
        : undefined
  }

  const removeAmountRaw = {
    [Field.CURRENCY_A]:
      tokenA && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueA
        ? removeAll
          ? pair?.token0.equals(tokenA)
            ? pair?.reserve0
            : pair?.reserve1
          : percentToRemove.multiply(liquidityValueA.raw)
        : undefined,
    [Field.CURRENCY_B]:
      tokenB && percentToRemove && percentToRemove.greaterThan('0') && liquidityValueB
        ? removeAll
          ? pair?.token0.equals(tokenB)
            ? pair?.reserve0
            : pair?.reserve1
          : percentToRemove.multiply(liquidityValueB.raw)
        : undefined
  }

  let error: string | undefined
  if (!account) {
    error = 'Connect Wallet'
  }

  if (!parsedAmounts[Field.LIQUIDITY] || !parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    error = error ?? 'Enter an amount'
  }

  const isANft = checkIs1155(currencyA) || checkIs721(currencyA)
  const isBNft = checkIs1155(currencyB) || checkIs721(currencyB)
  const nftField = isANft ? Field.CURRENCY_A : isBNft ? Field.CURRENCY_B : undefined
  const nftAmount = nftField ? removeAmountRaw[nftField] : undefined

  const warning = useMemo(() => {
    if (!nftAmount || removeAll || !nftField) return undefined
    if (typedValue === '100' && nftAmount.remainder.greaterThan('0')) {
      return ['NFT value less than 1 will be traded for equal amount of ERC20', undefined] as [string, undefined]
    }
    if (+typedValue < 100 && (nftAmount.remainder.greaterThan(new Fraction('5', '10')) || nftAmount.lessThan('1'))) {
      const roundedUp = nftAmount.toFixed(0, undefined, 2)
      const liquidityRaw = liquidityValues[nftField]
      if (!liquidityRaw?.greaterThan('0')) {
        return undefined
      }
      const percent = liquidityRaw ? new Fraction(roundedUp).divide(liquidityRaw).toFixed(3) : undefined
      if (percent) {
        const percentString = Math.ceil(+percent * 100) + ''

        return [
          'Increase percentage to remove interger amount of NFT',
          () => {
            onUserInput(Field.LIQUIDITY_PERCENT, percentString)
          }
        ] as [string, () => void]
      }

      return undefined
    }
    return undefined
  }, [liquidityValues, nftAmount, nftField, onUserInput, removeAll, typedValue])

  return { pair, parsedAmounts, error, lpBalance: userLiquidity, poolShare, warning }
}

export function useBurnActionHandlers(): {
  onUserInput: (field: Field, typedValue: string) => void
} {
  const dispatch = useDispatch<AppDispatch>()

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onUserInput
  }
}
