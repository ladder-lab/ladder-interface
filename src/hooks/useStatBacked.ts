import { ChainId } from '@ladder/sdk'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { PoolPairType } from 'pages/Statistics'
import { Order } from 'pages/Statistics/StatTable'
import { useEffect, useMemo, useState } from 'react'
import { Axios, StatBaseURL } from 'utils/axios'

export interface StatTopTokensProp {
  Volume: string
  price: string
  token: string
  tokenId?: number
  tvl: string
  type: Mode
}
const pageSize = 5

export function useTopTokensList(chainId: ChainId) {
  const [currentPage, setCurrentPage] = useState(1)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<string | number>('')
  const [type, setType] = useState(Mode.ERC721)

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
export function useTopPoolsList(chainId: ChainId, token?: string, defaultPoolPairType?: PoolPairType) {
  const [currentPage, setCurrentPage] = useState(1)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<string | number>('')
  const [type, setType] = useState(defaultPoolPairType || PoolPairType.ERC20_ERC20)

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
  }, [chainId, type, token])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const filter = token ? { token } : {}
        const res = await Axios.get(StatBaseURL + 'getPoolList', {
          chainId,
          type: type === PoolPairType.ERC20_ERC20 ? 1 : type === PoolPairType.ERC20_ERC721 ? 2 : 3,
          pageSize,
          ...filter,
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
  }, [chainId, currentPage, order, orderBy, token, type])

  useEffect(() => {
    ;(async () => {
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const filter = token ? { token } : {}
        const res = await Axios.get(StatBaseURL + 'getPoolList', {
          chainId,
          type: type === PoolPairType.ERC20_ERC20 ? 1 : type === PoolPairType.ERC20_ERC721 ? 2 : 3,
          pageSize,
          pageNum: currentPage,
          ...filter,
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
        item.buyTokenType === 'ERC20' ? Mode.ERC20 : item.buyTokenType === 'ERC721' ? Mode.ERC721 : Mode.ERC1155,
      sellTokenType:
        item.sellTokenType === 'ERC20' ? Mode.ERC20 : item.sellTokenType === 'ERC721' ? Mode.ERC721 : Mode.ERC1155,
      type: StatTransactionsType.SWAPS
    })
  )
}
export function useTransactionsList(chainId: ChainId, token?: string) {
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
  }, [chainId, type, token])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const filter = token ? { token } : {}
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
          ...filter,
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
  }, [chainId, currentPage, order, orderBy, token, type])

  useEffect(() => {
    ;(async () => {
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const filter = token ? { token } : {}
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
          ...filter,
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

export interface StatisticsTVLProp {
  id: number
  tvl: string
  volume: string
  chainId: ChainId
  timestamp: number
}

export function useStatisticsOverviewData(chainId: ChainId) {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<StatisticsTVLProp[]>([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(StatBaseURL + 'getLadderStatistics', {
          chainId
        })
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          return
        }
        setResult(
          data.map((item: any) =>
            Object.assign(item, {
              id: Number(item.id),
              chainId: Number(item.chainId),
              timestamp: Number(item.timestamp)
            })
          )
        )
      } catch (error) {
        setResult([])
        setLoading(false)
        console.error('useStatisticsTVL', error)
      }
    })()
  }, [chainId])

  const total = useMemo(() => {
    return {
      TVLTotal: result.length ? result.map(item => Number(item.tvl) || 0).reduce((a, b) => Number(a) + Number(b)) : 0,
      volumeTotal: result.length
        ? result.map(item => Number(item.volume) || 0).reduce((a, b) => Number(a) + Number(b))
        : 0
    }
  }, [result])

  return {
    loading: loading,
    result,
    ...total
  }
}

export interface StatPoolDetailProp {
  Volume: string
  tvl: string
  pair: {
    id: number
    token0Address: string
    token1Address: string
    pair: string
    token0Type: Mode
    token1Type: Mode
    tokenId: number
    chainId: ChainId
  }
}

export function usePoolDetailData(chainId: ChainId, pair: string) {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<StatPoolDetailProp>()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(StatBaseURL + 'getPoolDetail', {
          chainId,
          pair
        })
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult(undefined)
          return
        }
        const _pair = Object.assign(data.pair, {
          id: Number(data.pair.id),
          chainId: Number(data.pair.chainId),
          token0Type:
            data.pair.token0Type === 'ERC20'
              ? Mode.ERC20
              : data.pair.token0Type === 'ERC721'
              ? Mode.ERC721
              : Mode.ERC1155,
          token1Type:
            data.pair.token1Type === 'ERC20'
              ? Mode.ERC20
              : data.pair.token1Type === 'ERC721'
              ? Mode.ERC721
              : Mode.ERC1155
        })
        setResult({
          tvl: data.tvl,
          Volume: data.Volume,
          pair: _pair
        })
      } catch (error) {
        setResult(undefined)
        setLoading(false)
        console.error('usePoolDetailData', error)
      }
    })()
  }, [chainId, pair])

  return {
    loading: loading,
    result
  }
}

export interface SearchTokenInfoProp {
  pools: StatTopPoolsProp[]
  tokens: {
    tokenId: number
    tokenType: Mode
    token: string
  }[]
}

export function useSearchTokenInfo(chainId: ChainId, token: string) {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<SearchTokenInfoProp>({ pools: [], tokens: [] })

  useEffect(() => {
    ;(async () => {
      if (!chainId || !token) {
        setResult({ pools: [], tokens: [] })
        return
      }
      setLoading(true)
      try {
        const res = await Axios.get(StatBaseURL + 'getTokenInfo', {
          chainId,
          token
        })
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult({ pools: [], tokens: [] })
          return
        }
        const tokens: {
          tokenId: number
          tokenType: Mode
          token: string
        }[] = data.tokens
          ? data.tokens.map((item: any) =>
              Object.assign(item, {
                tokenType:
                  item.tokenType === 'ERC20' ? Mode.ERC20 : item.tokenType === 'ERC721' ? Mode.ERC721 : Mode.ERC1155
              })
            )
          : []
        const pools = data.pool
          ? [
              Object.assign(data.pool, {
                token0Type:
                  data.pool.token0Type === 'ERC20'
                    ? Mode.ERC20
                    : data.pool.token0Type === 'ERC721'
                    ? Mode.ERC721
                    : Mode.ERC1155,
                token1Type:
                  data.pool.token1Type === 'ERC20'
                    ? Mode.ERC20
                    : data.pool.token1Type === 'ERC721'
                    ? Mode.ERC721
                    : Mode.ERC1155,
                token0: data.pool.token0Address,
                token1: data.pool.token1Address
              })
            ]
          : []
        if (pools.length === 0 && tokens.length > 0) {
          const poolsRes = await Promise.all(
            tokens.map(item =>
              Axios.get(StatBaseURL + 'getPoolList', {
                chainId,
                token: item.token,
                type: item.tokenType === Mode.ERC20 ? 1 : item.tokenType === Mode.ERC721 ? 2 : 3,
                pageSize,
                pageNum: 1
              })
            )
          )

          let _pools: StatTopPoolsProp[] = []
          for (const res1 of poolsRes) {
            const _item = res1.data.data?.list
            if (!_item) {
              continue
            }
            _pools = [..._pools, ...topPoolsListDataHandler(_item)]
          }
          setResult({ pools: _pools, tokens })
        } else {
          setResult({ pools, tokens })
        }
      } catch (error) {
        setResult({ pools: [], tokens: [] })
        setLoading(false)
        console.error('useSearchTokenInfo', error)
      }
    })()
  }, [chainId, token])

  return {
    loading: loading,
    result
  }
}
