import { ChainId } from '@ladder/sdk'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { PoolPairType } from 'pages/Statistics'
import { Order } from 'pages/Statistics/StatTable'
import { useEffect, useMemo, useState } from 'react'
import { Axios, StatBaseURL } from 'utils/axios'

export interface StatTokenInfo {
  symbol: string
  name: string
  logo: string
  address: string
  type: Mode
  tokenId?: number
}

export interface StatTopTokensProp {
  Volume: string
  price: string
  token: StatTokenInfo
  tvl: string
  transfers: number
}
const pageSize = 5

export function useTopTokensList(
  chainId: ChainId,
  defaultMode?: Mode,
  defaultPageSize?: number,
  token?: string,
  token1155Id?: number
) {
  const [currentPage, setCurrentPage] = useState(1)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<string | number>('')
  const [_pageSize] = useState(defaultPageSize || pageSize)
  const [type, setType] = useState(defaultMode || Mode.ERC721)

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
        const filter: any = token ? { token } : {}
        if (Mode.ERC1155 === type) {
          filter.tokenId = token1155Id
        }
        const res = await Axios.get(StatBaseURL + 'getTokenList', {
          chainId,
          type: type === Mode.ERC20 ? 1 : type === Mode.ERC721 ? 2 : 3,
          ...filter,
          pageSize: _pageSize,
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
        setResult(
          data.list.map((item: any) => ({
            ...item,
            token: {
              symbol: item.symbol,
              name: item.name,
              logo: item.logo,
              address: item.token,
              tokenId: item.tokenId,
              type
            }
          }))
        )
      } catch (error) {
        setResult([])
        setCount(0)
        setLoading(false)
        console.error('useTopTokensList', error)
      }
    })()
  }, [chainId, currentPage, order, orderBy, _pageSize, type, token, token1155Id])

  useEffect(() => {
    ;(async () => {
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const filter: any = token ? { token } : {}
        if (Mode.ERC1155 === type) {
          filter.tokenId = token1155Id
        }
        const res = await Axios.get(StatBaseURL + 'getTokenList', {
          chainId,
          type: type === Mode.ERC20 ? 1 : type === Mode.ERC721 ? 2 : 3,
          ...filter,
          pageSize: _pageSize,
          pageNum: currentPage,
          order,
          orderBy
        })
        const data = res.data.data as any
        if (!data) {
          return
        }
        setCount(Number(data.total))
        setResult(
          data.list.map((item: any) => ({
            ...item,
            token: {
              symbol: item.symbol,
              name: item.name,
              logo: item.logo,
              address: item.token,
              tokenId: item.tokenId,
              type
            }
          }))
        )
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
      totalPage: Math.ceil(count / _pageSize),
      pageSize: _pageSize
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
  tokenId: number
  Volume: string
  token0: StatTokenInfo
  Volume7: string
  token1: StatTokenInfo
  tvl: string
  pair: string
}

const topPoolsListDataHandler = (list: any) => {
  return list.map((item: any) =>
    Object.assign(item, {
      token0: {
        ...item[item.token0],
        type: item.token0Type === 1 ? Mode.ERC20 : item.token0Type === 2 ? Mode.ERC721 : Mode.ERC1155,
        address: item.token0
      },
      token1: {
        ...item[item.token1],
        address: item.token1,
        type: item.token1Type === 1 ? Mode.ERC20 : item.token1Type === 2 ? Mode.ERC721 : Mode.ERC1155
      }
    })
  )
}
export function useTopPoolsList(
  chainId: ChainId | undefined,
  token?: string,
  defaultPoolPairType?: PoolPairType,
  token1155Id?: number,
  defaultPageSize?: number
) {
  const [currentPage, setCurrentPage] = useState(1)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<string | number>('')
  const [type, setType] = useState(defaultPoolPairType || PoolPairType.ERC20_ERC20)
  const [_pageSize] = useState(defaultPageSize || pageSize)

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
      if (!chainId) {
        setResult([])
        return
      }
      setLoading(true)
      try {
        const filter: any = token ? { token } : {}
        if (PoolPairType.ERC20_ERC1155 === type) {
          filter.tokenId = token1155Id
        }
        const res = await Axios.get(StatBaseURL + 'getPoolList', {
          chainId,
          type: type === PoolPairType.ERC20_ERC20 ? 1 : type === PoolPairType.ERC20_ERC721 ? 2 : 3,
          pageSize: _pageSize,
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
  }, [_pageSize, chainId, currentPage, order, orderBy, token, token1155Id, type])

  useEffect(() => {
    ;(async () => {
      if (!chainId) {
        setResult([])
        return
      }
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const filter: any = token ? { token } : {}
        if (PoolPairType.ERC20_ERC1155 === type) {
          filter.tokenId = token1155Id
        }
        const res = await Axios.get(StatBaseURL + 'getPoolList', {
          chainId,
          type: type === PoolPairType.ERC20_ERC20 ? 1 : type === PoolPairType.ERC20_ERC721 ? 2 : 3,
          pageSize: _pageSize,
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
      totalPage: Math.ceil(count / _pageSize),
      pageSize: _pageSize
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
  buyToken: StatTokenInfo
  pair: string
  sellToken: StatTokenInfo
  buyAmount: string
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
      buyToken: {
        symbol: item.buyTokenSymbol,
        name: item.buyTokenName,
        logo: item.buyTokenUri,
        address: item.buyToken,
        type: item.buyTokenType === 'ERC20' ? Mode.ERC20 : item.buyTokenType === 'ERC721' ? Mode.ERC721 : Mode.ERC1155,
        tokenId: item.tokenId
      },
      sellToken: {
        symbol: item.sellTokenSymbol,
        name: item.sellTokenName,
        logo: item.sellTokenUri,
        address: item.sellToken,
        type:
          item.sellTokenType === 'ERC20' ? Mode.ERC20 : item.sellTokenType === 'ERC721' ? Mode.ERC721 : Mode.ERC1155,
        tokenId: item.tokenId
      },
      type: StatTransactionsType.SWAPS
    })
  )
}
export function useTransactionsList(chainId: ChainId, token?: string, pair?: string) {
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
        const filterPair = pair ? { pair } : {}
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
          ...filterPair,
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
  }, [chainId, currentPage, order, orderBy, pair, token, type])

  useEffect(() => {
    ;(async () => {
      if (timeRefresh === -1) {
        toTimeRefresh()
        return
      }
      try {
        const filter = token ? { token } : {}
        const filterPair = pair ? { pair } : {}
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
          ...filterPair,
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
  const [result, setResult] = useState<StatTopPoolsProp>()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(StatBaseURL + 'getPoolList', {
          chainId,
          pair,
          pageNum: 1,
          pageSize: 1
        })
        setLoading(false)
        const data = res.data.data as any
        if (!data?.list?.length) {
          setResult(undefined)
          return
        }
        setResult(topPoolsListDataHandler(data.list)[0])
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

export function useTokenDetailData(chainId: ChainId, token: string, mode: Mode, token1155Id?: number) {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<StatTokenInfo>()

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        if (mode === Mode.ERC1155) {
          const res = await Axios.get(StatBaseURL + 'getTokenList', {
            chainId,
            token,
            tokenId: token1155Id,
            pageNum: 1,
            pageSize: 1,
            type: 3
          })
          setLoading(false)
          const data = res.data.data as any
          const _data = data?.list?.[0]
          if (!_data) {
            setResult(undefined)
            return
          }

          setResult({ ..._data, type: Mode.ERC1155, address: token })
        } else {
          const res = await Axios.get(StatBaseURL + 'getTokenInfo', {
            chainId,
            token
          })
          setLoading(false)
          const data = res.data.data as any
          if (!data?.tokens?.length) {
            setResult(undefined)
            return
          }
          setResult({
            ...data.tokens[0],
            address: data.tokens[0].token,
            type:
              data.tokens[0].tokenType === 1 ? Mode.ERC20 : data.tokens[0].tokenType === 2 ? Mode.ERC721 : Mode.ERC1155
          })
        }
      } catch (error) {
        setResult(undefined)
        setLoading(false)
        console.error('useTokenDetailData', error)
      }
    })()
  }, [chainId, mode, token, token1155Id])

  return {
    loading: loading,
    result
  }
}

export interface SearchTokenInfoProp {
  pools: StatTopPoolsProp[]
  tokens: StatTokenInfo[]
  is1155Token: boolean
}

export function useSearchTokenInfo(chainId: ChainId, token: string) {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<SearchTokenInfoProp>({
    pools: [],
    tokens: [],
    is1155Token: false
  })

  useEffect(() => {
    ;(async () => {
      if (!chainId || !token) {
        setResult({ pools: [], tokens: [], is1155Token: false })
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
          setResult({ pools: [], tokens: [], is1155Token: false })
          return
        }

        const tokens: StatTokenInfo[] =
          data.tokens?.map((item: any) => ({
            ...item,
            address: item.token,
            type: item.tokenType === 1 ? Mode.ERC20 : item.tokenType === 2 ? Mode.ERC721 : Mode.ERC1155
          })) || []
        const pools = topPoolsListDataHandler(data.pool instanceof Array ? data.pool : [data.pool])
        const is1155 =
          tokens.length === 1 &&
          tokens[0].type === Mode.ERC1155 &&
          tokens[0].address.toLowerCase() === token.toLowerCase()

        setResult({ pools, tokens, is1155Token: is1155 })
      } catch (error) {
        setResult({ pools: [], tokens: [], is1155Token: false })
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
