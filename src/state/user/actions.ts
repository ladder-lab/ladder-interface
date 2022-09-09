import { createAction } from '@reduxjs/toolkit'

export interface SerializedToken {
  chainId: number
  address: string
  decimals?: number
  symbol?: string
  name?: string
  tokenId?: string | number
  standard?: 'erc721' | 'erc1155' | 'erc20'
}

export interface SerializedPair {
  token0: SerializedToken
  token1: SerializedToken
}
export const updateUserDarkMode = createAction('user/updateUserDarkMode')
export const updateUserExpertMode = createAction<{ userExpertMode: boolean }>('user/updateUserExpertMode')
export const updateUserSingleHopOnly = createAction<{ userSingleHopOnly: boolean }>('user/updateUserSingleHopOnly')
export const updateUserSlippageTolerance = createAction<{ userSlippageTolerance: number }>(
  'user/updateUserSlippageTolerance'
)
export const updateUserDeadline = createAction<{ userDeadline: number }>('user/updateUserDeadline')
export const addSerializedToken = createAction<{ serializedToken: SerializedToken }>('user/addSerializedToken')
export const removeSerializedToken = createAction<{ chainId: number; address: string }>('user/removeSerializedToken')
export const addSerializedToken1155 = createAction<{ serializedToken: SerializedToken }>('user/addSerializedToken1155')
export const removeSerializedToken1155 = createAction<{ chainId: number; address: string; tokenId: string | number }>(
  'user/removeSerializedToken1155'
)
export const addSerializedToken721 = createAction<{ serializedToken: SerializedToken }>('user/addSerializedToken721')
export const removeSerializedToken721 = createAction<{ chainId: number; address: string; tokenId: string | number }>(
  'user/removeSerializedToken721'
)
export const addSerializedPair = createAction<{ serializedPair: SerializedPair }>('user/addSerializedPair')
export const removeSerializedPair = createAction<{
  chainId: number
  tokenAAddress: string
  tokenBAddress: string
  tokenIdA: string | number
  tokenIdB: string | number
}>('user/removeSerializedPair')
