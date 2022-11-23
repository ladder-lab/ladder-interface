import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Axios, baseURL, StatBaseURL } from 'utils/axios'
import { useWeb3Instance } from 'hooks/useWeb3Instance'
import { ChainId } from 'constants/chain'

export interface FeedbackInfoProp {
  feedback: {
    id: string
    email: string
    address: string
    summary: string
    description: string
    type: string
  } | null
  links: [
    {
      id: string
      address: string
      links: string
    }
  ]
}

export function useFeedbackInfo(account: string | undefined) {
  const [data, setData] = useState<FeedbackInfoProp>()
  const web3 = useWeb3Instance()

  useEffect(() => {
    setData(undefined)
    if (!account) {
      return
    }
    Axios.get('/getFeedback', { address: account })
      .then(res => {
        if (res.data?.data) {
          setData(res.data.data)
        } else {
          setData(undefined)
        }
      })
      .catch(() => setData(undefined))
  }, [account])

  const commit = useCallback(
    async (formData: FormData) => {
      if (!web3 || !account) return
      const message = 'Submit feedback'
      const signature = await web3.eth.personal.sign(message, account, '')
      formData.append('message', message)
      formData.append('address', account)
      formData.append('signature', signature)
      return axios.post(baseURL + 'saveFeedback', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    [account, web3]
  )

  return { data, commit }
}

export function useAccountTestInfo(chainId: ChainId, account: string | undefined) {
  const [result, setResult] = useState<{
    transfers: number
    tvl: number
    assets: number
  }>()

  useEffect(() => {
    ;(async () => {
      if (!chainId || !account) {
        setResult(undefined)
        return
      }
      try {
        const res = await Axios.get(StatBaseURL + 'getAccountTestInfo', {
          chainId,
          account
        })
        const data = res.data.data as any
        if (!data) {
          setResult(undefined)
          return
        }
        setResult({
          transfers: data.transfers,
          tvl: Number(data.tvl),
          assets: Number(data.asset)
        })
      } catch (error) {
        setResult(undefined)
        console.error('useAccountTestInfo', error)
      }
    })()
  }, [account, chainId])

  return result
}

export function useAccountTvlRank(chainId: ChainId, account: string | undefined) {
  const [result, setResult] = useState<{
    transfers: number
    tvl: number
    assets: number
  }>()

  useEffect(() => {
    ;(async () => {
      if (!chainId || !account) {
        setResult(undefined)
        return
      }
      try {
        const res = await Axios.get(StatBaseURL + 'getAccountTestInfo', {
          chainId,
          account
        })
        const data = res.data.data as any
        if (!data) {
          setResult(undefined)
          return
        }
        setResult({
          transfers: data.transfers,
          tvl: Number(data.tvl),
          assets: Number(data.asset)
        })
      } catch (error) {
        setResult(undefined)
        console.error('useAccountTestInfo', error)
      }
    })()
  }, [account, chainId])

  return result
}

const pageSize = 10

interface RankingTVLProp {
  account: string
  chainId: ChainId
  rank: number
  tvl: string
}

interface RankingAssetsProp {
  account: string
  chainId: ChainId
  rank: number
  asset: string
}

interface RankingTransferProp {
  account: string
  rank: number
  transfers: string
}

export function useRankingTVLList(chainId: ChainId, account: string | undefined) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [list, setList] = useState<RankingTVLProp[]>([])
  const [ranking, setRanking] = useState<number>()
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(StatBaseURL + 'getAccountTvlRank', {
          chainId,
          address: account || '',
          pageSize,
          pageNum: currentPage
        })
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setList([])
          setCount(0)
          return
        }
        setCount(Number(data.ranks.total))
        setList(data.ranks.list)
        setRanking(data.accountRank > 0 ? data.accountRank : undefined)
      } catch (error) {
        setList([])
        setCount(0)
        setRanking(undefined)
        setLoading(false)
        console.error('useTransactionsList', error)
      }
    })()
  }, [account, chainId, currentPage])

  return {
    loading: loading,
    page: {
      setCurrentPage: (page: number) => setCurrentPage(page),
      currentPage,
      count,
      totalPage: Math.ceil(count / pageSize),
      pageSize
    },
    result: {
      list,
      ranking,
      isTop: ranking && count && count / ranking >= 5 ? true : false
    },
    modal: {
      openModal,
      toggleOpenModal: () => setOpenModal(!openModal)
    }
  }
}

export function useRankingAssetsList(chainId: ChainId, account: string | undefined) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [list, setList] = useState<RankingAssetsProp[]>([])
  const [ranking, setRanking] = useState<number>()
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(StatBaseURL + 'getAccountAssetRank', {
          chainId,
          address: account || '',
          pageSize,
          pageNum: currentPage
        })
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setList([])
          setCount(0)
          return
        }
        setCount(Number(data.ranks.total))
        setList(data.ranks.list)
        setRanking(data.accountRank > 0 ? data.accountRank : undefined)
      } catch (error) {
        setList([])
        setCount(0)
        setRanking(undefined)
        setLoading(false)
        console.error('useRankingAssetsList', error)
      }
    })()
  }, [account, chainId, currentPage])

  return {
    loading: loading,
    page: {
      setCurrentPage: (page: number) => setCurrentPage(page),
      currentPage,
      count,
      totalPage: Math.ceil(count / pageSize),
      pageSize
    },
    result: {
      list,
      ranking,
      isTop: ranking && count && count / ranking >= 5 ? true : false
    },
    modal: {
      openModal,
      toggleOpenModal: () => setOpenModal(!openModal)
    }
  }
}

export function useRankingTransferList(chainId: ChainId, account: string | undefined) {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [list, setList] = useState<RankingTransferProp[]>([])
  const [ranking, setRanking] = useState<number>()
  const [openModal, setOpenModal] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(StatBaseURL + 'getAccountTransferRank', {
          chainId,
          address: account || '',
          pageSize,
          pageNum: currentPage
        })
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setList([])
          setCount(0)
          return
        }
        setCount(Number(data.ranks.total))
        setList(data.ranks.list)
        setRanking(data.accountRank > 0 ? data.accountRank : undefined)
      } catch (error) {
        setList([])
        setCount(0)
        setRanking(undefined)
        setLoading(false)
        console.error('useRankingTransferList', error)
      }
    })()
  }, [account, chainId, currentPage])

  return {
    loading: loading,
    page: {
      setCurrentPage: (page: number) => setCurrentPage(page),
      currentPage,
      count,
      totalPage: Math.ceil(count / pageSize),
      pageSize
    },
    result: {
      list,
      ranking,
      isTop: ranking && count && count / ranking >= 5 ? true : false
    },
    modal: {
      openModal,
      toggleOpenModal: () => setOpenModal(!openModal)
    }
  }
}
