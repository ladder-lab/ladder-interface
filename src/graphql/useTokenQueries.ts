import { gql, useQuery } from '@apollo/client'
import { GraphOrderType } from '../hooks/useStatBacked'
import { Mode } from '../components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { useEffect, useState } from 'react'
import { ChainId } from '@ladder/sdk'
import { convertWeiToEther } from '../utils'
import tokenLogoUriList from '../assets/tokenLogoUriList.json'

export const GET_TOKENS = gql`
  query TokensQuery($skip: Int, $pageSize: Int, $orderBy: String, $order: String, $type: [String]) {
    tokens(skip: $skip, first: $pageSize, orderBy: $orderBy, orderDirection: $order, where: { type_in: $type }) {
      id
      name
      price
      symbol
      type
      liquidity
    }
  }
`

const GET_TOKEN_VOLUME_BY_DAY = gql`
  query GetTokenVolumeByDay($token: String!, $todayMidnight: Int!) {
    tokenVolumeByDays(where: { timestamp_gte: $todayMidnight, token: $token }) {
      token
      volume
      volume7d
    }
  }
`

const GET_TOKEN_DETAILS = gql`
  query GetTokenDetails($id: String!) {
    tokens(where: { id: $id }) {
      id
      name
      price
      symbol
      type
      liquidity
      total {
        transactions
      }
    }
  }
`

interface FetchToken {
  address?: string
  logo?: string
  tokenId?: string
  transfers?: string
  volume?: string
  volume7d?: string
}

export interface TokenDetailItem extends FetchToken {
  id: string
  name: string
  price: string
  symbol: string
  type: string
  liquidity: string
}

interface TokenVolumeByDay {
  volume: string
  volume7d: string
}

interface TokenDetails extends TokenDetailItem {
  total: {
    transactions: number
  }
}

interface Props {
  currentPage: number
  pageSize: number
  order: string
  orderBy: GraphOrderType | string
  id?: string | number
  type: string
  showNFT?: boolean
}

interface UseTokensQueriesResult {
  loadingToken: boolean
  dataTokens: TokenDetailItem[]
}

interface UseTokenDetailsQueriesResult {
  result: TokenDetails | undefined
  loading: boolean
}

export const TokensTypeMap: Record<string, string> = {
  [Mode.ERC20]: 'ERC20',
  [Mode.ERC1155]: 'ERC1155',
  [Mode.ERC721]: 'ERC721'
}

export function useTokensQueries(props: Props): UseTokensQueriesResult {
  const todayMidnight = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)
  const [dataTokens, setDataTokens] = useState<TokenDetailItem[]>([])
  const { currentPage, pageSize, order, orderBy, id, type, showNFT } = props
  const tokenType: string[] = showNFT ? ['ERC1155', 'ERC721'] : [TokensTypeMap[type] || 'ERC20', 'ERC1155', 'ERC721']

  const skip = pageSize * (currentPage - 1)
  const queryOrderBy = orderBy ? orderBy : 'liquidity'
  const {
    client,
    loading: loadingToken,
    data
  } = useQuery(GET_TOKENS, {
    variables: {
      skip,
      pageSize,
      order,
      orderBy: queryOrderBy,
      id,
      type: tokenType
    }
  })
  useEffect(() => {
    if (data) {
      const resTokensData = data.tokens
      const fetchVolumes = async () => {
        const volumePromises = resTokensData.map((token: TokenDetailItem) => {
          return client.query({
            query: GET_TOKEN_VOLUME_BY_DAY,
            variables: { token: token.id, todayMidnight }
          })
        })
        const volumesResults = await Promise.all(volumePromises)
        const tokenVolumeByDayMap = new Map<string, TokenVolumeByDay>()
        volumesResults.map(item => {
          if (item.data.tokenVolumeByDays.length) {
            const tokenVolumeByDayData = item.data.tokenVolumeByDays[0]
            tokenVolumeByDayMap.set(tokenVolumeByDayData.token, { ...tokenVolumeByDayData })
          }
        })

        const tokensData = resTokensData.reduce((acc: TokenDetailItem[], cur: TokenDetailItem) => {
          const byDayData = tokenVolumeByDayMap.get(cur.id) || { volume: '0', volume7d: '0' }
          acc.push({
            ...cur,
            volume: byDayData.volume,
            volume7d: byDayData.volume7d
          })
          return acc
        }, [])
        setDataTokens(tokensData)
      }
      fetchVolumes()
    }
  }, [client, data, todayMidnight])

  return {
    loadingToken,
    dataTokens
  }
}

export function useTokenDetailsQueries(chainId: ChainId, address?: string): UseTokenDetailsQueriesResult {
  const todayMidnight = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)
  const [result, setResult] = useState<TokenDetails | undefined>()
  const { data, loading, client } = useQuery(GET_TOKEN_DETAILS, {
    variables: {
      id: address
    },
    skip: !address
  })
  useEffect(() => {
    const fetchVolumes = async (tokenId: string) => {
      const res = await client.query({
        query: GET_TOKEN_VOLUME_BY_DAY,
        variables: { token: tokenId, todayMidnight }
      })
      const volumeByDayData = res.data.tokenVolumeByDays[0]
      return {
        volume: volumeByDayData ? convertWeiToEther(volumeByDayData.volume) : 0,
        volume7d: volumeByDayData ? convertWeiToEther(volumeByDayData.volume7d) : 0
      }
    }

    if (data?.tokens) {
      const tokenDetailsData = data.tokens[0] || {}
      const fetchAndSetResult = async () => {
        const volumes = await fetchVolumes(tokenDetailsData.id)
        setResult({
          ...tokenDetailsData,
          address: tokenDetailsData.id,
          logo: (tokenLogoUriList as any)[tokenDetailsData.symbol],
          tokenId: tokenDetailsData.id,
          transfers: tokenDetailsData.total.transactions,
          price: convertWeiToEther(tokenDetailsData.price),
          liquidity: convertWeiToEther(tokenDetailsData.liquidity),
          ...volumes
        })
      }

      fetchAndSetResult()
    }
  }, [data, client, todayMidnight])
  return {
    result,
    loading
  }
}
