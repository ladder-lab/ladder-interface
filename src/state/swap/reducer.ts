import { createReducer } from '@reduxjs/toolkit'
import { Field, selectCurrency, setRecipient, switchCurrencies, typeInput } from './actions'

export interface SwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
    readonly tokenId?: string | undefined | number
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
    readonly tokenId?: string | undefined | number
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
    tokenId: undefined
  },
  [Field.OUTPUT]: {
    currencyId: '',
    tokenId: undefined
  },
  recipient: null
}

export default createReducer<SwapState>(initialState, builder =>
  builder
    // .addCase(
    //   replaceSwapState,
    //   (state, { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId } }) => {
    //     return {
    //       [Field.INPUT]: {
    //         currencyId: inputCurrencyId
    //       },
    //       [Field.OUTPUT]: {
    //         currencyId: outputCurrencyId
    //       },
    //       independentField: field,
    //       typedValue: typedValue,
    //       recipient
    //     }
    //   }
    // )
    .addCase(selectCurrency, (state, { payload: { currencyId, field, tokenId } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[otherField].currencyId && tokenId === state[otherField].tokenId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { currencyId: currencyId, tokenId },
          [otherField]: { currencyId: state[field].currencyId, tokenId: state[field].tokenId }
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId: currencyId, tokenId }
        }
      }
    })
    .addCase(switchCurrencies, state => {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId, tokenId: state[Field.OUTPUT].tokenId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId, tokenId: state[Field.INPUT].tokenId }
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue
      }
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
)
