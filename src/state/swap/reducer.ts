import { createReducer } from '@reduxjs/toolkit'
import { Field, resetSwap, selectCurrency, selectSubToken, setRecipient, switchCurrencies, typeInput } from './actions'

export interface SwapState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
    readonly tokenId?: string | undefined | number
    readonly standard?: undefined | string
    readonly tokenIds?: Array<string | number> | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
    readonly tokenId?: string | undefined | number
    readonly standard?: undefined | string
    readonly tokenIds?: Array<string | number> | undefined
  }
  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: '',
    tokenId: undefined,
    standard: undefined,
    tokenIds: undefined
  },
  [Field.OUTPUT]: {
    currencyId: '',
    tokenId: undefined,
    standard: undefined,
    tokenIds: undefined
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
    .addCase(selectCurrency, (state, { payload: { currencyId, field, tokenId, standard } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[otherField].currencyId && tokenId === state[otherField].tokenId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { ...state[field], currencyId: currencyId, tokenId, standard },
          [otherField]: {
            ...state[otherField],
            currencyId: state[field].currencyId,
            tokenId: state[field].tokenId,
            standard: state[field].standard
          }
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { ...state[field], currencyId: currencyId, tokenId, standard }
        }
      }
    })
    .addCase(switchCurrencies, state => {
      return {
        ...state,
        independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
        [Field.INPUT]: {
          currencyId: state[Field.OUTPUT].currencyId,
          tokenId: state[Field.OUTPUT].tokenId,
          standard: state[Field.OUTPUT].standard,
          tokenIds: state[Field.OUTPUT].tokenIds
        },
        [Field.OUTPUT]: {
          currencyId: state[Field.INPUT].currencyId,
          tokenId: state[Field.INPUT].tokenId,
          standard: state[Field.INPUT].standard,
          tokenIds: state[Field.INPUT].tokenIds
        }
      }
    })
    .addCase(selectSubToken, (state, { payload: { currencyId, field, tokenIds } }) => {
      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT,
          [field]: { ...state[field], tokenIds },
          [otherField]: {
            ...state[otherField],
            tokenIds: state[field].tokenIds
          }
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { ...state[field], tokenIds }
        }
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
    .addCase(resetSwap, () => {
      return initialState
    })
)
