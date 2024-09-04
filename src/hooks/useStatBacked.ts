import { ChainId } from '@ladder/sdk'
import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { PoolPairType } from 'pages/Statistics'
import { Order } from 'pages/Statistics/StatTable'
import { useCallback, useEffect, useState } from 'react'
import { Axios, StatBaseURL } from 'utils/axios'
import { useTransactionsQueries, useTransactionsTotal } from '../graphql/useTransactionsQueries'
import { convertWeiToEther } from '../utils'
import { usePoolsDetailsQueries, usePoolsQueries } from '../graphql/usePoolsQueries'
import { useTokensQueries } from '../graphql/useTokenQueries'

export enum GraphOrderType {
  Time = 'timestamp',
  TVL = 'liquidity'
}

const pageSize = 5

export interface StatTokenInfo {
  symbol: string
  name: string
  logo: string
  address: string
  type: Mode
  token?: string
  price?: string
  tokenId?: number
  balance?: string
}

export interface StatTopTokensProp {
  Volume: string
  price: string
  token: StatTokenInfo
  tvl: string
  transfers: number
}

export function useTopTokensList(
  chainId: ChainId,
  defaultMode: Mode = Mode.ERC721,
  defaultPageSize: number = pageSize,
  token?: string,
  token1155Id?: number
) {
  const [currentPage, setCurrentPage] = useState(1)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<string | number>('')
  const [type, setType] = useState(defaultMode)
  const [loading, setLoading] = useState<boolean>(false)
  // const [count, setCount] = useState<number>(20)
  const [result, setResult] = useState<StatTopTokensProp[]>([])
  const count = 20
  const id = token || token1155Id
  const { dataTokens, loadingToken } = useTokensQueries({
    currentPage,
    pageSize: defaultPageSize,
    order,
    orderBy,
    id,
    type
  })

  useEffect(() => {
    const tokens =
      dataTokens.map(i => ({
        Volume: i.volume,
        tvl: convertWeiToEther(i.liquidity),
        price: convertWeiToEther(i.price),
        token: {
          name: i.name,
          symbol: i.symbol,
          address: i.id,
          type: i.type === 'ERC20' ? Mode.ERC20 : i.type === 'ERC721' ? Mode.ERC721 : Mode.ERC1155,
          tokenId: i.id
        }
      })) || []
    setResult(tokens)
  }, [dataTokens])
  useEffect(() => {
    setLoading(loadingToken)
  }, [loadingToken])

  const search = useCallback((val: string) => {
    setOrderBy(val)
    setCurrentPage(1)
  }, [])

  return {
    loading: loading,
    page: {
      setCurrentPage,
      currentPage,
      count,
      totalPage: Math.ceil(count / defaultPageSize),
      pageSize: defaultPageSize
    },
    search: {
      type,
      setType
    },
    order: {
      order,
      orderBy,
      setOrder,
      setOrderBy: search
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

const mapToken = (item: any, tokenKey: string) => {
  const token = item[tokenKey]
  const price = convertWeiToEther(token.price)
  return {
    ...token,
    address: token.id,
    price,
    type: token.type === 'ERC20' ? Mode.ERC20 : token.type === 'ERC721' ? Mode.ERC721 : Mode.ERC1155
  }
}

export const topPoolsListDataHandler = (list: any) =>
  list.map(item => ({
    ...item,
    pair: item.id,
    Volume: item.volume,
    Volume7: item.volume7d,
    tvl: convertWeiToEther(item.liquidity),
    token0: mapToken(item, 'tokenA'),
    token1: mapToken(item, 'tokenB')
  }))

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

  const [loading, setLoading] = useState<boolean>(false)
  const [count, setCount] = useState<number>(20)
  const [result, setResult] = useState<StatTopPoolsProp[]>([])

  const { dataPairs, loadingPairs } = usePoolsQueries({
    chainId,
    currentPage,
    pageSize: _pageSize,
    order,
    orderBy,
    token,
    token1155Id,
    type,
    setLoading,
    setCount,
    setResult
  })
  useEffect(() => {
    const formatData = topPoolsListDataHandler(dataPairs)
    setResult(formatData)
  }, [dataPairs])

  useEffect(() => {
    setLoading(loadingPairs)
  }, [loadingPairs])

  const search = useCallback((val: string) => {
    setOrderBy(val)
    setCurrentPage(1)
  }, [])

  return {
    loading,
    page: {
      setCurrentPage,
      currentPage,
      count,
      totalPage: Math.ceil(count / _pageSize),
      pageSize: _pageSize
    },
    search: {
      type,
      setType
    },
    order: {
      order,
      orderBy,
      setOrder,
      setOrderBy: search
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

const getTokenData = (token: StatTokenInfo) => ({
  ...token,
  address: token.id,
  type: token.type === 'ERC20' ? Mode.ERC20 : token.type === 'ERC721' ? Mode.ERC721 : Mode.ERC1155,
  tokenId: token.id
})

const transactionsListDataHandler = (list: any[]) => {
  console.log(list)
  return list.map((item: any) => ({
    ...item,
    buyToken: getTokenData(item.TokenA),
    buyAmount: convertWeiToEther(item.TokenAamount),
    sellToken: getTokenData(item.TokenB),
    sellAmount: convertWeiToEther(item.TokenBamount),
    totalValue: convertWeiToEther(item.value),
    type:
      item.type === 'Swap'
        ? StatTransactionsType.SWAPS
        : item.type === 'addLiquidity'
        ? StatTransactionsType.ADDS
        : StatTransactionsType.REMOVES,
    hash: item.id.includes('-') ? item.id.split('-')[0] : item.id
  }))
}

export function useTransactionsList({
  chainId,
  token,
  pair,
  tokenType
}: {
  chainId: ChainId
  token?: string
  pair?: string
  tokenType: Mode
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<string>('Time')
  const [type, setType] = useState(StatTransactionsType.ALL)
  const [count, setCount] = useState<number>(0)
  const [result, setResult] = useState([] as StatTransactionsProp[])
  const { dataA, dataB, dataDefault, loading } = useTransactionsQueries({
    currentPage,
    pageSize,
    order,
    orderBy,
    token,
    tokenType,
    pair,
    type
  })
  const { total } = useTransactionsTotal({ type, token })

  useEffect(() => {
    const transactions = [
      ...(dataA ? transactionsListDataHandler(dataA.transactions) : []),
      ...(dataB ? transactionsListDataHandler(dataB.transactions) : []),
      ...(dataDefault ? transactionsListDataHandler(dataDefault.transactions) : [])
    ]
    setResult(transactions)
  }, [dataA, dataB, dataDefault, total])

  useEffect(() => {
    setCurrentPage(1)
  }, [chainId, type, token])

  useEffect(() => {
    setCount(total)
  }, [total])
  const search = useCallback((val: string) => {
    setOrderBy(val)
    setCurrentPage(1)
  }, [])
  return {
    loading: loading,
    page: {
      setCurrentPage,
      currentPage,
      count,
      totalPage: Math.ceil(count / pageSize),
      pageSize
    },
    search: {
      type,
      setType
    },
    order: {
      order,
      orderBy,
      setOrder,
      setOrderBy: search
    },
    result
  }
}

export interface StatisticsTVLProp {
  totalTvl: number
  totalVolume: number
}

export function useStatisticsOverviewData(chainId: ChainId) {
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<StatisticsTVLProp>()

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
          setResult(undefined)
          return
        }
        setResult({ totalVolume: Number(data.totalVolume), totalTvl: Number(data.totalTvl) })
      } catch (error) {
        setResult(undefined)
        setLoading(false)
        console.error('useStatisticsTVL', error)
      }
    })()
  }, [chainId])

  return {
    loading: loading,
    result
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

  const { data: pairDetails, loading: pairDetailsLoading } = usePoolsDetailsQueries(chainId, pair)

  useEffect(() => {
    setLoading(pairDetailsLoading)
  }, [pairDetailsLoading])

  useEffect(() => {
    if (!pairDetails) {
      setResult(undefined)
      return
    }
    const data = pairDetails.pair
    setResult({
      Volume: data.volume,
      Volume7: data.volume7d,
      tvl: convertWeiToEther(data.liquidity),
      tokenId: data.tokenId,
      pair: data.id,
      token0: {
        symbol: data.tokenA.symbol,
        name: data.tokenA.name,
        logo: data.tokenA.logo,
        address: data.tokenA.id,
        type: data.tokenA.type === 'ERC20' ? Mode.ERC20 : data.tokenA.type === 'ERC721' ? Mode.ERC721 : Mode.ERC1155
      },
      token1: {
        symbol: data.tokenB.symbol,
        name: data.tokenB.name,
        logo: data.tokenB.logo,
        address: data.tokenB.id,
        type: data.tokenB.type === 'ERC20' ? Mode.ERC20 : data.tokenB.type === 'ERC721' ? Mode.ERC721 : Mode.ERC1155
      }
    })
  }, [pairDetails])

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
