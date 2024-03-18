import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updateWalletConnectState } from './actions'

export function useWalletIsConnected(): boolean {
  return useSelector((state: AppState) => state.walletConnect.walletIsConnected)
}

export function useConnectedWalletName(): string {
  return useSelector((state: AppState) => state.walletConnect.connectedWalletName)
}

export function useWalletConnectStateManager(): (walletIsConnected: boolean, connectedWalletName: string) => void {
  const dispatch = useDispatch<AppDispatch>()

  const setWalletConnectState = useCallback(
    (walletIsConnected: boolean, connectedWalletName: string) => {
      dispatch(updateWalletConnectState({ walletIsConnected, connectedWalletName }))
    },
    [dispatch]
  )

  return setWalletConnectState
}
