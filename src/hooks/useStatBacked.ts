import { Mode } from 'components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { PoolPairType } from 'pages/Statistics'
import { Order } from 'pages/Statistics/StatTable'
import { useCallback, useEffect, useState } from 'react'
import { Axios, StatBaseURL } from 'utils/axios'
import { useTransactionsQueries, useTransactionsTotal } from '../graphql/useTransactionsQueries'
import { convertWeiToEther } from '../utils'
import { usePoolsDetailsQueries, usePoolsQueries } from '../graphql/usePoolsQueries'
import { useTokensQueries } from '../graphql/useTokenQueries'
import { useTotal } from '../graphql/useTotal'
import tokenLogoUriList from '../assets/tokenLogoUriList.json'
import { ChainId } from '../constants/chain'

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
  type: string
  token?: string
  price?: string
  tokenId?: number
  balance?: string
}

export interface StatTopTokensProp {
  Volume?: string
  price?: string
  token?: StatTokenInfo
  tvl?: string
  transfers?: number
}

export interface TokensListProp {
  chainId?: ChainId
  defaultMode?: Mode | null
  defaultPageSize?: number
  token?: StatTokenInfo
  token1155Id?: number
  showNFT?: boolean
}

export function useTopTokensList({
  chainId,
  defaultMode = Mode.ERC721,
  defaultPageSize,
  token,
  token1155Id,
  showNFT
}: TokensListProp) {
  const [currentPage, setCurrentPage] = useState(1)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<GraphOrderType | string>('')
  const [_pageSize] = useState(defaultPageSize || pageSize)
  const [type, setType] = useState(defaultMode)
  const [loading, setLoading] = useState<boolean>(false)
  // const [count, setCount] = useState<number>(20)
  const [result, setResult] = useState<StatTopTokensProp[]>([])
  const count = 20
  const id = token || token1155Id
  const { dataTokens, loadingToken } = useTokensQueries({
    currentPage,
    pageSize: _pageSize,
    order,
    orderBy,
    id,
    type,
    showNFT
  })

  useEffect(() => {
    const tokens =
      dataTokens.map(i => ({
        Volume: i.volume,
        tvl: convertWeiToEther(i.liquidity),
        price: convertWeiToEther(i.price),
        token: {
          logo: (tokenLogoUriList as any)[i.symbol],
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
  list.map((item: any) => {
    item.tokenA = {
      ...item.tokenA,
      logo: (tokenLogoUriList as any)[item.tokenA.symbol],
      balance: convertWeiToEther(item.tokenAAmount, item.tokenA.type)
    }
    item.tokenB = {
      ...item.tokenB,
      logo: (tokenLogoUriList as any)[item.tokenB.symbol],
      balance: convertWeiToEther(item.tokenBAmount, item.tokenB.type)
    }
    return {
      ...item,
      Volume: convertWeiToEther(item.volume),
      Volume7: convertWeiToEther(item.volume7d),
      tvl: convertWeiToEther(item.liquidity),
      token0: mapToken(item, 'tokenA'),
      token1: mapToken(item, 'tokenB')
    }
  })

export interface PoolsListProp {
  chainId: ChainId
  token?: string | undefined
  poolPairType?: PoolPairType | null
  token1155Id?: number | undefined
  defaultPageSize?: number
  showNFT?: boolean
}

export function useTopPoolsList({
  chainId,
  token,
  poolPairType,
  token1155Id,
  defaultPageSize,
  showNFT
}: PoolsListProp) {
  const [currentPage, setCurrentPage] = useState(1)
  const [order, setOrder] = useState<Order>('desc')
  const [orderBy, setOrderBy] = useState<GraphOrderType | string>('')
  const [type, setType] = useState(poolPairType === null ? null : poolPairType ?? PoolPairType.ERC20_ERC20)
  const [_pageSize] = useState(defaultPageSize || pageSize)
  // const [count] = useState<number>(20)
  const count = 20
  const [result, setResult] = useState<StatTopPoolsProp[]>([])

  const { dataPairs, loadingPairs } = usePoolsQueries({
    chainId,
    currentPage,
    pageSize: _pageSize,
    order,
    orderBy,
    token,
    token1155Id,
    showNFT,
    type
  })
  useEffect(() => {
    const formatData = topPoolsListDataHandler(dataPairs)
    setResult(formatData)
  }, [dataPairs])

  const search = useCallback((val: string) => {
    setOrderBy(val)
    setCurrentPage(1)
  }, [])

  return {
    loading: loadingPairs,
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
  id: string
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
  return list.map((item: any) => {
    return {
      ...item,
      buyToken: getTokenData(item.TokenA),
      buyAmount: convertWeiToEther(item.TokenAamount, item.TokenA.type),
      sellToken: getTokenData(item.TokenB),
      sellAmount: convertWeiToEther(item.TokenBamount, item.TokenB.type),
      totalValue: convertWeiToEther(item.value),
      type:
        item.type === 'Swap'
          ? StatTransactionsType.SWAPS
          : item.type === 'addLiquidity'
          ? StatTransactionsType.ADDS
          : StatTransactionsType.REMOVES,
      hash: item.id.includes('-') ? item.id.split('-')[0] : item.id
    }
  })
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
  const [orderBy, setOrderBy] = useState<GraphOrderType>(GraphOrderType.Time)
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
  const { total } = useTransactionsTotal(type, token || pair)

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

export function useStatisticsOverviewData() {
  const [result, setResult] = useState<StatisticsTVLProp>()

  const { data, loading } = useTotal()
  useEffect(() => {
    if (Object.keys(data).length) {
      const { liquidity, volume } = data
      setResult({
        totalTvl: +convertWeiToEther(liquidity),
        totalVolume: +convertWeiToEther(volume)
      })
    } else {
      setResult(undefined)
    }
  }, [data])

  return {
    loading,
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
        logo: (tokenLogoUriList as any)[data.tokenA.symbol],
        address: data.tokenA.id,
        balance: convertWeiToEther(data.tokenAAmount, data.tokenA.type),
        type: data.tokenA.type === 'ERC20' ? Mode.ERC20 : data.tokenA.type === 'ERC721' ? Mode.ERC721 : Mode.ERC1155
      },
      token1: {
        symbol: data.tokenB.symbol,
        name: data.tokenB.name,
        logo: (tokenLogoUriList as any)[data.tokenB.symbol],
        address: data.tokenB.id,
        balance: convertWeiToEther(data.tokenBAmount, data.tokenB.type),
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
