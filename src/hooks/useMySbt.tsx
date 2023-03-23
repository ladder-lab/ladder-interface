import { useEffect, useState } from 'react'
import { Axios, testURL } from '../utils/axios'
import { useActiveWeb3React } from './index'

interface MySBT {
  account: string
  chainId: string
  contract: string
  id: string
  logo: string
  name: string
  symbol: string
  timestamp: string
}

export function useMySbt(pageSize = 10) {
  const { account, chainId } = useActiveWeb3React()
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<MySBT[]>([])
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(testURL + 'getOnwedSbt', {
          chainId,
          address: account
        })
        setLoading(false)
        const data = res.data.data.list as MySBT[]
        if (!data) {
          setResult([])
          setCount(0)
          return
        }
        setCount(Number(res.data.data.total))
        setResult(data)
      } catch (error) {
        setResult([])
        setCount(0)
        setLoading(false)
        console.error('useMySbt', error)
      }
    })()
  }, [chainId, currentPage, account])

  return {
    loading: loading,
    page: {
      setCurrentPage: (page: number) => setCurrentPage(page),
      currentPage,
      count,
      totalPage: Math.ceil(count / pageSize),
      pageSize: pageSize
    },
    result
  }
}

interface InviteReward {
  account: string
  chainId: string
  id: string
  timestamp: string
  volume: string
}

export function useInviteReward(pageSize = 10) {
  const { account, chainId } = useActiveWeb3React()
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<InviteReward[]>([])
  const [totalReward, setTotalReward] = useState('')
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(testURL + 'getRewardRecord', {
          chainId,
          address: account,
          pageNum: currentPage,
          pageSize
        })
        setLoading(false)
        const data = res.data.data.list.list as InviteReward[]
        if (!data) {
          setResult([])
          setCount(0)
          return
        }
        setCount(Number(res.data.data.list.total))
        setTotalReward(res.data.data.totalReward)
        setResult(data)
      } catch (error) {
        setResult([])
        setCount(0)
        setLoading(false)
        console.error('useTopTokensList', error)
      }
    })()
  }, [chainId, currentPage, account, pageSize])

  return {
    loading: loading,
    page: {
      setCurrentPage: (page: number) => setCurrentPage(page),
      currentPage,
      count,
      totalPage: Math.ceil(count / pageSize),
      pageSize: pageSize
    },
    result,
    totalReward
  }
}

interface Invite {
  address: string
  chainId: string
  id: string
  sbt: string
  secondLevelAddress: string
  threeLevelAddress: string
  timestamp: string
}

interface InviteResult {
  list: Invite[]
  invited: string
  totalInvited: string
}

export function useGetInvite(pageSize = 10) {
  const { account, chainId } = useActiveWeb3React()
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<InviteResult>()
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(testURL + 'getInvitedRecord', {
          chainId,
          address: account,
          pageNum: currentPage,
          pageSize
        })
        setLoading(false)
        const list = res.data.data.list.list as Invite[]
        if (!list) {
          setResult(undefined)
          setCount(0)
          return
        }
        setCount(Number(res.data.data.list.total))
        setResult({
          list: list,
          invited: res.data.data.invited,
          totalInvited: res.data.data.totalInvited
        })
      } catch (error) {
        setResult(undefined)
        setCount(0)
        setLoading(false)
        console.error('useTopTokensList', error)
      }
    })()
  }, [chainId, currentPage, account, pageSize])

  return {
    loading: loading,
    page: {
      setCurrentPage: (page: number) => setCurrentPage(page),
      currentPage,
      count,
      totalPage: Math.ceil(count / pageSize),
      pageSize: pageSize
    },
    result
  }
}
