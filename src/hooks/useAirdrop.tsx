import { axiosAirdropInstance, axiosAirdropInstanceLockLP, axiosAirdropMuaInstance } from 'utils/axios'
import useInterval from './useInterval'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect, useState } from 'react'
import useModal from './useModal'
import { useSignLogin } from './useSignIn'
import { useIsWindowFocus } from './useIsWindowVisible'

interface AirdropProps {
  boxType: number
  boxs: number
  claimed: boolean
  finished: boolean
}

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
  const [lockLPState, setLockLPState] = useState<AirdropProps>()
  const [swapCount1, setSwapCount1] = useState<AirdropProps>()
  const [swapCount2, setSwapCount2] = useState<AirdropProps>()
  const { hideModal } = useModal()

  const cb = useCallback(async () => {
    try {
      if (!account || !chainId) return

      const [res1, res2, res3] = await Promise.all([
        axiosAirdropInstance.get('/drop/getCompleteTaskStatus', { params: { account, chainId } }),
        axiosAirdropInstanceLockLP.get('lock/check', { params: { address: account } }),
        axiosAirdropInstanceLockLP.get('swap/count', { params: { sender: account } })
      ])

      if (res1.data.code === 200) {
        setTaskState(res1.data.data)
      }

      if (res2.data.data.is_ok) {
        setLockLPState({ boxType: 10, boxs: 1, claimed: false, finished: true })
      } else {
        setLockLPState({ boxType: 10, boxs: 1, claimed: false, finished: false })
      }

      if (res3.data.code === 200) {
        const swapRes = res3.data.data
        setSwapCount1({
          boxType: 11,
          boxs: 1,
          claimed: false,
          finished: swapRes.swapCount && swapRes.swapCount >= 2
        })

        setSwapCount2({
          boxType: 12,
          boxs: 1,
          claimed: false,
          finished: swapRes.transferToCount && swapRes.transferToCount >= 2
        })
      }
    } catch (error) {
      console.error(error)
    }
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

  return { taskState: { ...taskState, lockLP: lockLPState, 'swap-two': swapCount1, 'hold-two': swapCount2 }, getBox }
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

export function useActivityList(refreshCb: () => void) {
  const { account, chainId } = useActiveWeb3React()
  const [taskState, setTaskState] = useState<any>(null)
  const { hideModal } = useModal()
  const [activity, setActivityState] = useState<AirdropProps>()

  const cb = useCallback(() => {
    if (!account) return
    axiosAirdropInstanceLockLP
      .get('mint/nft/complete', {
        params: { account }
      })
      .then(r => {
        console.log('🚀 ~ file: useAirdrop.tsx:198 ~ cb ~ r:', r)
        setTaskState(null)
        setActivityState({ boxType: 1, boxs: 1, claimed: false, finished: r?.data?.data?.is_ok || false })
      })
      .catch(e => {
        console.error(e)
      })
  }, [account])

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

  return { taskState: { ...taskState, mint: activity }, getBox }
}
export function useVerifyEmail() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { account } = useActiveWeb3React()
  const isWindowVisible = useIsWindowFocus()
  useEffect(() => {
    if (isWindowVisible) {
      setTimeout(() => {
        setIsLoading(false)
      })
    }
  }, [isWindowVisible])
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
      setIsLoading(true)
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
      setIsLoading(false)
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
    openVerify,
    isLoading
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
      // axiosAirdropInstance.get('/mua/nftSellCount', {
      axiosAirdropInstance.get('/mua/nftSwapCount', {
        params: { address: account, chainId: 137 }
      }),
      axiosAirdropInstance.get('/mua/sftBuyCount', {
        params: { address: account, chainId: 56 }
      }),
      // axiosAirdropInstance.get('/mua/sftSellCount', {
      axiosAirdropInstance.get('/mua/sftSwapCount', {
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
                break
              case 1:
                // res.nftSwapCount += r.data.data.count
                res.nftSwapCount = r.data.data
                break
              case 2:
                break
              case 3:
                // res.sftSwapCount += r.data.data.count
                res.sftSwapCount = r.data.data
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

export function useMuaSeasonTwoTasks() {
  const { account, chainId } = useActiveWeb3React()
  const [taskState, setTaskState] = useState<any>(null)
  const { hideModal } = useModal()

  const cb = useCallback(() => {
    if (!account || !chainId) return
    axiosAirdropMuaInstance
      .get('getCompleteTaskStatus', {
        params: { account: account, chainId: chainId }
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
              cb()
              hideModal()
            }
          })
          .catch(e => {
            console.error(e)
          })
      },
    [account, cb, chainId, hideModal]
  )

  useEffect(() => {
    cb()
  }, [cb])

  useInterval(cb, account ? 60000 : null)

  return { taskState, getBox }
}
