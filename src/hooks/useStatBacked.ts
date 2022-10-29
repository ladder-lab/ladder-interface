import { ChainId } from '@ladder/sdk'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { PoolPairType } from 'pages/Statistics'
import { Order } from 'pages/Statistics/StatTable'
import { useEffect, useState } from 'react'
import { Axios, StatBaseURL } from 'utils/axios'

export interface StatTopTokensProp {
  Volume: string
  price: string
  token: string
  tvl: string
  type: Mode
}
const pageSize = 5

export function useTopTokensList(chainId: ChainId) {
  const [currentPage, setCurrentPage] = useState(1)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<string | number>('')
  const [type, setType] = useState(Mode.ERC20)

  const [firstLoadData, setFirstLoadData] = useState(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [result, setResult] = useState<StatTopTokensProp[]>([])

  const [timeRefresh, setTimeRefresh] = useState(-1)
  const toTimeRefresh = () => setTimeout(() => setTimeRefresh(Math.random()), 60000)

  useEffect(() => {
    if (firstLoadData) {
      setFirstLoadData(false)
      return
    }
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, type])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(StatBaseURL + 'getTokenList', {
          chainId,
          type: type === Mode.ERC20 ? 1 : type === Mode.ERC721 ? 2 : 3,
          pageSize,
          pageNum: currentPage,
          order,
          orderBy
        })
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setCount(0)
          return
        }
        setCount(Number(data.total))
        setResult(data.list.map((item: any) => ({ ...item, type })))
      } catch (error) {
        setResult([])
        setCount(0)
        setLoading(false)
        console.error('useTopTokensList', error)
      }
    })()
  }, [chainId, currentPage, order, orderBy, type])

  useEffect(() => {
    ;(async () => {
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const res = await Axios.get(StatBaseURL + 'getTokenList', {
          chainId,
          type: type === Mode.ERC20 ? 1 : type === Mode.ERC721 ? 2 : 3,
          pageSize,
          pageNum: currentPage,
          order,
          orderBy
        })
        const data = res.data.data as any
        if (!data) {
          return
        }
        setCount(Number(data.total))
        setResult(data.list.map((item: any) => ({ ...item, type })))
        toTimeRefresh()
      } catch (error) {
        toTimeRefresh()
        console.error('useTopTokensList', error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRefresh])

  return {
    loading: loading,
    page: {
      setCurrentPage: (page: number) => setCurrentPage(page),
      currentPage,
      count,
      totalPage: Math.ceil(count / pageSize),
      pageSize
    },
    search: {
      type,
      setType: (type: Mode) => setType(type)
    },
    order: {
      order,
      orderBy,
      setOrder: (order: Order) => setOrder(order),
      setOrderBy: (orderBy: number | string) => setOrderBy(orderBy)
    },
    result
  }
}

export interface StatTopPoolsProp {
  token1Type: Mode
  tokenId: number
  Volume: string
  token0: string
  Volume7: string
  token1: string
  token0Type: Mode
  tvl: string
  pair: string
}

const topPoolsListDataHandler = (list: any) => {
  return list.map((item: any) =>
    Object.assign(item, {
      token0Type: item.token0Type === 1 ? Mode.ERC20 : item.token0Type === 2 ? Mode.ERC721 : Mode.ERC1155,
      token1Type: item.token1Type === 1 ? Mode.ERC20 : item.token1Type === 2 ? Mode.ERC721 : Mode.ERC1155
    })
  )
}
export function useTopPoolsList(chainId: ChainId) {
  const [currentPage, setCurrentPage] = useState(1)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<string | number>('')
  const [type, setType] = useState(PoolPairType.ERC20_ERC20)

  const [firstLoadData, setFirstLoadData] = useState(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [result, setResult] = useState<StatTopPoolsProp[]>([])

  const [timeRefresh, setTimeRefresh] = useState(-1)
  const toTimeRefresh = () => setTimeout(() => setTimeRefresh(Math.random()), 60000)

  useEffect(() => {
    if (firstLoadData) {
      setFirstLoadData(false)
      return
    }
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, type])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(StatBaseURL + 'getPoolList', {
          chainId,
          type: type === PoolPairType.ERC20_ERC20 ? 1 : type === PoolPairType.ERC20_ERC721 ? 2 : 3,
          pageSize,
          pageNum: currentPage,
          order,
          orderBy
        })
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setCount(0)
          return
        }
        setCount(Number(data.total))
        setResult(topPoolsListDataHandler(data.list))
      } catch (error) {
        setResult([])
        setCount(0)
        setLoading(false)
        console.error('useTopPoolsList', error)
      }
    })()
  }, [chainId, currentPage, order, orderBy, type])

  useEffect(() => {
    ;(async () => {
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const res = await Axios.get(StatBaseURL + 'getPoolList', {
          chainId,
          type: type === PoolPairType.ERC20_ERC20 ? 1 : type === PoolPairType.ERC20_ERC721 ? 2 : 3,
          pageSize,
          pageNum: currentPage,
          order,
          orderBy
        })
        const data = res.data.data as any
        if (!data) {
          return
        }
        setCount(Number(data.total))
        setResult(topPoolsListDataHandler(data.list))
        toTimeRefresh()
      } catch (error) {
        toTimeRefresh()
        console.error('useTopPoolsList', error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRefresh])

  return {
    loading: loading,
    page: {
      setCurrentPage: (page: number) => setCurrentPage(page),
      currentPage,
      count,
      totalPage: Math.ceil(count / pageSize),
      pageSize
    },
    search: {
      type,
      setType: (type: PoolPairType) => setType(type)
    },
    order: {
      order,
      orderBy,
      setOrder: (order: Order) => setOrder(order),
      setOrderBy: (orderBy: number | string) => setOrderBy(orderBy)
    },
    result
  }
}

export enum StatTransactionsType {
  ALL = 'All',
  SWAPS = 'Swaps',
  ADDS = 'Adds',
  REMOVES = 'Removes'
}

export interface StatTransactionsProp {
  totalValue: string
  tokenId: number
  buyToken: string
  sellTokenType: Mode
  pair: string
  sellToken: string
  buyAmount: string
  buyTokenType: Mode
  chainId: ChainId
  sellAmount: string
  account: string
  hash: string
  timestamp: string
  type: StatTransactionsType
}

const transactionsListDataHandler = (list: any) => {
  return list.map((item: any) =>
    Object.assign(item, {
      buyTokenType:
        item.sellTokenType === 'ERC20' ? Mode.ERC20 : item.sellTokenType === 'ERC721' ? Mode.ERC721 : Mode.ERC1155,
      sellTokenType:
        item.sellTokenType === 'ERC20' ? Mode.ERC20 : item.sellTokenType === 'ERC721' ? Mode.ERC721 : Mode.ERC1155,
      type: StatTransactionsType.SWAPS
    })
  )
}
export function useTransactionsList(chainId: ChainId) {
  const [currentPage, setCurrentPage] = useState(1)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<string | number>('')
  const [type, setType] = useState(StatTransactionsType.ALL)

  const [firstLoadData, setFirstLoadData] = useState(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)
  const [result, setResult] = useState<StatTransactionsProp[]>([])

  const [timeRefresh, setTimeRefresh] = useState(-1)
  const toTimeRefresh = () => setTimeout(() => setTimeRefresh(Math.random()), 60000)

  useEffect(() => {
    if (firstLoadData) {
      setFirstLoadData(false)
      return
    }
    setCurrentPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, type])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(StatBaseURL + 'getSwapRecords', {
          chainId,
          type:
            type === StatTransactionsType.ADDS
              ? 1
              : type === StatTransactionsType.REMOVES
              ? 2
              : type === StatTransactionsType.SWAPS
              ? 3
              : '',
          pageSize,
          pageNum: currentPage,
          order,
          orderBy
        })
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setCount(0)
          return
        }
        setCount(Number(data.total))
        setResult(transactionsListDataHandler(data.list))
      } catch (error) {
        setResult([])
        setCount(0)
        setLoading(false)
        console.error('useTransactionsList', error)
      }
    })()
  }, [chainId, currentPage, order, orderBy, type])

  useEffect(() => {
    ;(async () => {
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const res = await Axios.get(StatBaseURL + 'getSwapRecords', {
          chainId,
          type:
            type === StatTransactionsType.ADDS
              ? 1
              : type === StatTransactionsType.REMOVES
              ? 2
              : type === StatTransactionsType.SWAPS
              ? 3
              : '',
          pageSize,
          pageNum: currentPage,
          order,
          orderBy
        })
        const data = res.data.data as any
        if (!data) {
          return
        }
        setCount(Number(data.total))
        setResult(transactionsListDataHandler(data.list))
        toTimeRefresh()
      } catch (error) {
        toTimeRefresh()
        console.error('useTransactionsList', error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRefresh])

  return {
    loading: loading,
    page: {
      setCurrentPage: (page: number) => setCurrentPage(page),
      currentPage,
      count,
      totalPage: Math.ceil(count / pageSize),
      pageSize
    },
    search: {
      type,
      setType: (type: StatTransactionsType) => setType(type)
    },
    order: {
      order,
      orderBy,
      setOrder: (order: Order) => setOrder(order),
      setOrderBy: (orderBy: number | string) => setOrderBy(orderBy)
    },
    result
  }
}
