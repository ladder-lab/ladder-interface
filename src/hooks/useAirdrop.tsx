import { axiosAirdropInstance } from 'utils/axios'
import useInterval from './useInterval'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import useModal from './useModal'

export function useLuckTasks(refreshCb: () => void) {
  const { account, chainId } = useActiveWeb3React()
  const [taskState, setTaskState] = useState<any>(null)
  const { hideModal } = useModal()

  const cb = useCallback(() => {
    if (!account || !chainId) return
    axiosAirdropInstance
      .get('/drop/getCompleteLuckTaskStatus', {
        params: { account, chainId }
      })
      .then(r => {
        if (r.data.code === 200) {
          setTaskState(r.data.data)
        }
      })
      .catch(e => {
        console.error(e)
      })
  }, [account, chainId])

  const getLuck = useCallback(
    ({ luckType, luck }: { luckType: number; luck: number }) =>
      () => {
        if (!account || !chainId) return
        axiosAirdropInstance
          .get('/drop/saveCompleteLuck', { params: { account, luckType, luck, chainId } })
          .then(r => {
            if (r.data.code === 200) {
              refreshCb()
              cb()
              hideModal()
            }
          })
          .catch(e => {
            console.error(e)
          })
      },
    [account, cb, chainId, hideModal, refreshCb]
  )

  useEffect(() => {
    cb()
  }, [cb])

  useInterval(cb, account ? 60000 : null)

  return { taskState, getLuck }
}

export function useBoxTasks(refreshCb: () => void) {
  const { account, chainId } = useActiveWeb3React()
  const [taskState, setTaskState] = useState<any>(null)
  const { hideModal } = useModal()

  const cb = useCallback(() => {
    if (!account || !chainId) return
    axiosAirdropInstance
      .get('/drop/getCompleteTaskStatus', {
        params: { account, chainId }
      })
      .then(r => {
        if (r.data.code === 200) {
          setTaskState(r.data.data)
        }
      })
      .catch(e => {
        console.error(e)
      })
  }, [account, chainId])

  const getBox = useCallback(
    ({ boxType, boxs }: { boxType: number; boxs: number }) =>
      () => {
        if (!account || !chainId) return
        axiosAirdropInstance
          .get('/drop/saveCompleteBox', { params: { account, boxType, boxs, chainId } })
          .then(r => {
            if (r.data.code === 200) {
              refreshCb()
              cb()
              hideModal()
            }
          })
          .catch(e => {
            console.error(e)
          })
      },
    [account, cb, chainId, hideModal, refreshCb]
  )

  useEffect(() => {
    cb()
  }, [cb])

  useInterval(cb, account ? 60000 : null)

  return { taskState, getBox }
}

export function useAirdropData() {
  const [refresh, setRefresh] = useState(false)
  const { account, chainId } = useActiveWeb3React()
  const [airdropData, setAirdropData] = useState<any>(undefined)

  const refreshCb = useCallback(() => {
    setRefresh(prev => !prev)
  }, [])

  const cb = useCallback(() => {
    if (!account || !chainId) return
    axiosAirdropInstance
      .get('/drop/getdropInfo', {
        params: { account, chainId }
      })
      .then(r => {
        if (r.data.code === 200) {
          setAirdropData(r.data.data)
        }
      })
      .catch(e => {
        console.error(e)
      })
  }, [account, chainId])

  useEffect(() => {
    cb()
  }, [cb, refresh])

  useInterval(cb, account ? 60000 : null)

  return { airdropData, refreshCb }
}
