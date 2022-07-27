import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { parseUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount, Trade } from '@uniswap/sdk'
import useENS from '../../hooks/useENS'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useTradeExactIn, useTradeExactOut } from 'hooks/Trades'
import { isAddress } from '../../utils'
import { AppDispatch, AppState } from '../index'
import { useCurrencyBalance } from '../wallet/hooks'
import { Field, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'
import { useUserSlippageTolerance } from '../user/hooks'
import { computeSlippageAdjustedAmounts } from 'utils/swap/prices'
import { AllTokens } from 'models/allTokens'
import { getHashAddress } from 'utils/getHashAddress'
import { NETWORK_CHAIN_ID } from 'constants/chain'

export function useSwapState(): AppState['swap'] {
  return useSelector<AppState, AppState['swap']>(state => state.swap)
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: AllTokens) => void
  onSwitchTokens: () => void
  onUserInput: (field: Field, typedValue: string) => void
  onChangeRecipient: (recipient: string | null) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const onCurrencySelection = useCallback(
    (field: Field, currency: AllTokens) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: 'address' in currency ? currency.address : currency === ETHER ? 'ETH' : '',
          tokenId: 'tokenId' in currency ? currency.tokenId : undefined
        })
      )
    },
    [dispatch]
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )

  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient
  }
}

// try to parse a user entered amount for a given token
export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return undefined
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return undefined
}

const BAD_RECIPIENT_ADDRESSES: string[] = [
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // v2 factory
  '0xf164fC0Ec4E93095b804a4795bBe1e041497b92a', // v2 router 01
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' // v2 router 02
]

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade, checksummedAddress: string): boolean {
  return (
    trade.route.path.some(token => token.address === checksummedAddress) ||
    trade.route.pairs.some(pair => pair.liquidityToken.address === checksummedAddress)
  )
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmount: CurrencyAmount | undefined
  v2Trade: Trade | undefined
  inputError?: string
} {
  const { account, chainId } = useActiveWeb3React()

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId, tokenId: inputTokenId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId, tokenId: outputTokenId },
    recipient
  } = useSwapState()

  const inputCurrencyRaw = useCurrency(inputCurrencyId, inputTokenId)
  const outputCurrencyRaw = useCurrency(outputCurrencyId, outputTokenId)

  const inputCurrency =
    inputTokenId && inputCurrencyId
      ? new Token(
          chainId ?? NETWORK_CHAIN_ID,
          getHashAddress(inputCurrencyId, +inputTokenId),
          0,
          inputCurrencyRaw?.symbol,
          inputCurrencyRaw?.name
        )
      : inputCurrencyRaw

  const outputCurrency =
    outputTokenId && outputCurrencyId
      ? new Token(
          chainId ?? NETWORK_CHAIN_ID,
          getHashAddress(outputCurrencyId, +outputTokenId),
          0,
          outputCurrencyRaw?.symbol,
          outputCurrencyRaw?.name
        )
      : outputCurrencyRaw

  const recipientLookup = useENS(recipient ?? undefined)
  const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null

  const inputBalance = useCurrencyBalance(account ?? undefined, inputCurrencyRaw ?? undefined)
  const outputBalance = useCurrencyBalance(account ?? undefined, outputCurrencyRaw ?? undefined)

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined)
  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined)

  const v2Trade = isExactIn ? bestTradeExactIn : bestTradeExactOut

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrencyRaw ?? undefined,
    [Field.OUTPUT]: outputCurrencyRaw ?? undefined
  }

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!parsedAmount) {
    inputError = inputError ?? 'Enter an amount'
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError = 'Select a token'
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? 'Enter a recipient'
  } else {
    if (
      BAD_RECIPIENT_ADDRESSES.indexOf(formattedTo) !== -1 ||
      (bestTradeExactIn && involvesAddress(bestTradeExactIn, formattedTo)) ||
      (bestTradeExactOut && involvesAddress(bestTradeExactOut, formattedTo))
    ) {
      inputError = inputError ?? 'Invalid recipient'
    }
  }

  const [allowedSlippage] = useUserSlippageTolerance()

  const slippageAdjustedAmounts = v2Trade && allowedSlippage && computeSlippageAdjustedAmounts(v2Trade, allowedSlippage)

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [inputBalance, slippageAdjustedAmounts ? slippageAdjustedAmounts[Field.INPUT] : null]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = 'Insufficient ' + amountIn.currency.symbol + ' balance'
  }

  return {
    currencies,
    currencyBalances: {
      [Field.INPUT]: inputBalance,
      [Field.OUTPUT]: outputBalance
    },
    parsedAmount,
    v2Trade: v2Trade ?? undefined,
    inputError
  }
}
