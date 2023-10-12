import { INITIAL_ALLOWED_SLIPPAGE, DEFAULT_DEADLINE_FROM_NOW, INITIAL_USER_TRANSACTION_SPEED } from '../../constants'
import { createReducer } from '@reduxjs/toolkit'
import { updateVersion } from '../global/actions'
import {
  addSerializedPair,
  addSerializedToken,
  removeSerializedPair,
  removeSerializedToken,
  SerializedPair,
  SerializedToken,
  updateUserExpertMode,
  updateUserSlippageTolerance,
  updateUserDeadline,
  updateUserSingleHopOnly,
  updateUserDarkMode,
  addSerializedToken1155,
  removeSerializedToken1155,
  addSerializedToken721,
  removeSerializedToken721,
  updateUserERC20ApproveMode,
  updateUserTransactionSpeed
} from './actions'
import { Token1155 } from 'constants/token/token1155'
import { filter1155, filter721 } from 'utils/checkIs1155'
import { Token } from '@ladder/sdk'
import { Token721 } from 'constants/token/token721'

const currentTimestamp = () => new Date().getTime()

export interface UserState {
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number

  userExpertMode: boolean
  userDarkMode: boolean
  userERC20ApproveAllMode: boolean

  userSingleHopOnly: boolean // only allow swaps on direct pairs

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: number
  userTransactionSpeed: number

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }
  token1155s: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }
  token721s: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }
  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }

  timestamp: number
  URLWarningVisible: boolean
}

export function token1155key(tokenAddress: string, tokenId: string | number) {
  return `${tokenAddress}#${tokenId}`
}

export function pairKey(
  token0Address: string,
  token1Address: string,
  token0TokenId?: string | number,
  token1TokenId?: string | number
) {
  return `${token0Address};${token1Address}/${token0TokenId}$${token1TokenId}`
}
export function pairKeyToken(token0: Token | Token1155 | Token721, token1: Token | Token1155 | Token721) {
  return `${token0.address};${token1.address}/${filter1155(token0)?.tokenId ?? filter721(token0) ?? 'erc721' ?? ''}$${
    filter1155(token1)?.tokenId ?? filter721(token1) ?? 'erc721' ?? ''
  }`
}

export const initialState: UserState = {
  userDarkMode: false,
  userExpertMode: false,
  userERC20ApproveAllMode: false,
  userSingleHopOnly: false,
  userSlippageTolerance: INITIAL_ALLOWED_SLIPPAGE,
  userTransactionSpeed: INITIAL_USER_TRANSACTION_SPEED,
  userDeadline: DEFAULT_DEADLINE_FROM_NOW,
  tokens: {},
  token1155s: {},
  token721s: {},
  pairs: {},
  timestamp: currentTimestamp(),
  URLWarningVisible: true
}

export default createReducer(initialState, builder =>
  builder
    .addCase(updateVersion, state => {
      // slippage isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userSlippageTolerance !== 'number') {
        state.userSlippageTolerance = INITIAL_ALLOWED_SLIPPAGE
      }

      // deadline isnt being tracked in local storage, reset to default
      // noinspection SuspiciousTypeOfGuard
      if (typeof state.userDeadline !== 'number') {
        state.userDeadline = DEFAULT_DEADLINE_FROM_NOW
      }

      state.lastUpdateVersionTimestamp = currentTimestamp()
    })
    .addCase(updateUserExpertMode, (state, action) => {
      state.userExpertMode = action.payload.userExpertMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserERC20ApproveMode, (state, action) => {
      state.userERC20ApproveAllMode = action.payload.userERC20ApproveAllMode
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserTransactionSpeed, (state, action) => {
      state.userTransactionSpeed = action.payload.userTransactionSpeed
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserSlippageTolerance, (state, action) => {
      state.userSlippageTolerance = action.payload.userSlippageTolerance
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserDeadline, (state, action) => {
      state.userDeadline = action.payload.userDeadline
      state.timestamp = currentTimestamp()
    })
    .addCase(updateUserSingleHopOnly, (state, action) => {
      state.userSingleHopOnly = action.payload.userSingleHopOnly
    })
    .addCase(addSerializedToken, (state, { payload: { serializedToken } }) => {
      if (!state.tokens) {
        state.tokens = {}
      }
      state.tokens[serializedToken.chainId] = state.tokens[serializedToken.chainId] || {}
      state.tokens[serializedToken.chainId][serializedToken.address] = serializedToken
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedToken, (state, { payload: { address, chainId } }) => {
      if (!state.tokens) {
        state.tokens = {}
      }
      state.tokens[chainId] = state.tokens[chainId] || {}
      delete state.tokens[chainId][address]
      state.timestamp = currentTimestamp()
    })
    .addCase(addSerializedToken1155, (state, { payload: { serializedToken } }) => {
      if (!state.token1155s) {
        state.token1155s = {}
      }
      state.token1155s[serializedToken.chainId] = state.token1155s[serializedToken.chainId] || {}
      state.token1155s[serializedToken.chainId][token1155key(serializedToken.address, serializedToken.tokenId ?? '')] =
        serializedToken
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedToken1155, (state, { payload: { address, tokenId, chainId } }) => {
      if (!state.token1155s) {
        state.token1155s = {}
      }
      state.token1155s[chainId] = state.token1155s[chainId] || {}
      delete state.token1155s[chainId][token1155key(address, tokenId)]
      state.timestamp = currentTimestamp()
    })
    .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const chainId = serializedPair.token0.chainId
        state.pairs[chainId] = state.pairs[chainId] || {}
        state.pairs[chainId][
          pairKey(
            serializedPair.token0.address,
            serializedPair.token1.address,
            serializedPair.token0.tokenId,
            serializedPair.token1.tokenId
          )
        ] = serializedPair
      }
      state.timestamp = currentTimestamp()
    })
    .addCase(addSerializedToken721, (state, { payload: { serializedToken } }) => {
      if (!state.token721s) {
        state.token721s = {}
      }
      state.token721s[serializedToken.chainId] = state.token721s[serializedToken.chainId] || {}
      state.token721s[serializedToken.chainId][serializedToken.address] = serializedToken
      state.timestamp = currentTimestamp()
    })
    .addCase(removeSerializedToken721, (state, { payload: { address, chainId } }) => {
      if (!state.token721s) {
        state.tokens = {}
      }
      state.token721s[chainId] = state.tokens[chainId] || {}
      delete state.token721s[chainId][address]
      state.timestamp = currentTimestamp()
    })
    .addCase(
      removeSerializedPair,
      (state, { payload: { chainId, tokenAAddress, tokenBAddress, tokenIdA, tokenIdB } }) => {
        if (state.pairs[chainId]) {
          // just delete both keys if either exists
          delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress, tokenIdA, tokenIdB)]
          delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress, tokenIdB, tokenIdA)]
        }
        state.timestamp = currentTimestamp()
      }
    )
    .addCase(updateUserDarkMode, state => {
      const prev = state.userDarkMode
      state.userDarkMode = !prev
      state.timestamp = currentTimestamp()
    })
)
