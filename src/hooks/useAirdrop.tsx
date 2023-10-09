import { axiosAirdropInstance } from 'utils/axios'
import useInterval from './useInterval'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import useModal from './useModal'
import { useSignLogin } from './useSignIn'

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

export function useVerifyEmail() {
  const { account } = useActiveWeb3React()
  const jump = useCallback(async () => {
    try {
      if (!account) return
      const res = await axiosAirdropInstance.get('/drop/googleOauth', {
        params: {
          address: account
        }
      })
      const data = res.data.msg as string
      if (!data) {
        return
      }
      const google = window.open(
        data,
        'intent',
        'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=500,height=500,left=0,top=0'
      )
      google?.addEventListener('beforeunload', () => {
        // not working
        console.log('close email oauth')
      })
      return
    } catch (error) {
      console.error('useGoogleOauth', error)
    }
  }, [account])

  const { token, sign } = useSignLogin(jump)
  const openVerify = useCallback(() => {
    if (!token) {
      sign()
    } else {
      jump()
    }
  }, [jump, sign, token])
  return {
    openVerify
  }
}

interface MuaTastState {
  nftSwapCount: number
  sftSwapCount: number
  task3: boolean
}
export function useMuaTasks() {
  const { account, chainId } = useActiveWeb3React()
  const [taskState, setTaskState] = useState<MuaTastState>({ nftSwapCount: 0, sftSwapCount: 0, task3: false })

  const cb = useCallback(() => {
    if (!account || !chainId) return
    Promise.all([
      axiosAirdropInstance.get('/mua/nftBuyCount', {
        params: { address: account, chainId: 137 }
      }),
      axiosAirdropInstance.get('/mua/nftSellCount', {
        params: { address: account, chainId: 137 }
      }),
      axiosAirdropInstance.get('/mua/sftBuyCount', {
        params: { address: account, chainId: 56 }
      }),
      axiosAirdropInstance.get('/mua/sftSellCount', {
        params: { address: account, chainId: 56 }
      }),
      axiosAirdropInstance.get('/mua/test3Task', {
        params: { address: account, chainId }
      })
    ])
      .then(r => {
        const res = { nftSwapCount: 0, sftSwapCount: 0, task3: false }
        r.map((r, idx) => {
          if (r.data.code === 200) {
            switch (idx) {
              case 0:
              case 1:
                res.nftSwapCount += r.data.data.count
                break
              case 2:
              case 3:
                res.sftSwapCount += r.data.data.count
                break
              case 4:
                res.task3 = r.data.data
            }
          }
        })
        setTaskState(res)
      })
      .catch(e => {
        console.error(e)
      })
  }, [account, chainId])

  useEffect(() => {
    cb()
  }, [cb])

  useInterval(cb, account ? 60000 : null)

  return { taskState }
}
