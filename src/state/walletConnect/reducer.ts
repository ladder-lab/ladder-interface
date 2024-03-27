import { createReducer } from '@reduxjs/toolkit'
import { updateWalletConnectState } from './actions'

export interface WalletConnectState {
  walletIsConnected: boolean
  connectedWalletName: string
}

export const initialState: WalletConnectState = {
  walletIsConnected: false,
  connectedWalletName: ''
}

export default createReducer(initialState, builder =>
  builder.addCase(updateWalletConnectState, (state, action) => {
    state.walletIsConnected = action.payload.walletIsConnected
    state.connectedWalletName = action.payload.connectedWalletName
  })
)
