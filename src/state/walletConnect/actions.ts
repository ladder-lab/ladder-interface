import { createAction } from '@reduxjs/toolkit'

export const updateWalletConnectState = createAction<{ walletIsConnected: boolean; connectedWalletName: string }>(
  'updateWalletConnectState'
)
