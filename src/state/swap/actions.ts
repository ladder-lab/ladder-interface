import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}

export const selectCurrency = createAction<{
  field: Field
  currencyId: string
  tokenId?: string | number
  standard: 'erc20' | 'erc1155' | 'erc721'
}>('swap/selectCurrency')
export const selectSubToken = createAction<{
  field: Field
  currencyId: string
  tokenIds?: Array<string | number>
}>('swap/selectSubToken')
export const resetSubToken = createAction<{
  field: Field
}>('swap/resetSubToken')
export const switchCurrencies = createAction<void>('swap/switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('swap/typeInput')
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
}>('swap/replaceSwapState')
export const setRecipient = createAction<{ recipient: string | null }>('swap/setRecipient')
export const resetSwap = createAction<{ recipient: string | null }>('swap/reset')
