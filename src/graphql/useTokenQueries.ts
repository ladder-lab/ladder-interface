import { gql, useQuery } from '@apollo/client'
import { StatTransactionsType, GraphOrderType } from '../hooks/useStatBacked'
import { Mode } from '../components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { useEffect, useState } from 'react'
import { ChainId } from '@ladder/sdk'
import { convertWeiToEther } from '../utils'

export const GET_TOKENS = gql`
  query TokensQuery($skip: Int, $pageSize: Int, $orderBy: String, $order: String, $type: String) {
    tokens(skip: $skip, first: $pageSize, orderBy: $orderBy, orderDirection: $order, where: { type_contains: $type }) {
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
    tokenVolumeByDays(where: { timestamp_lt: $todayMidnight, token: $token }) {
      volume
      volume7d
    }
  }
`

interface Props {
  currentPage: number
  pageSize: number
  order: string
  orderBy: string
  id?: string | number
  type: string
}

export function useTokensQueries(props: Props) {
  const today = new Date()
  const todayMidnight = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000) // 转换为秒

  const [dataTokens, setDataTokens] = useState([])
  const { currentPage, pageSize, order, orderBy, id, type } = props
  const TokensTypeMap: Record<string, string> = {
    [Mode.ERC20]: 'ERC20',
    [Mode.ERC1155]: 'ERC1155',
    [Mode.ERC721]: 'ERC721'
  }

  const tokenType = TokensTypeMap[type] || ''
  const skip = pageSize * (currentPage - 1)
  const queryOrderBy = orderBy ? GraphOrderType[orderBy] : 'liquidity'

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
        const volumePromises = resTokensData.map(token => {
          return client.query({
            query: GET_TOKEN_VOLUME_BY_DAY,
            variables: { token: token.id, todayMidnight }
          })
        })
        const volumesResults = await Promise.all(volumePromises)
        const tokenVolumeByDayMap = new Map()
        volumesResults.map(item => {
          if (item.data.tokenVolumeByDays.length) {
            const tokenVolumeByDayData = item.data.tokenVolumeByDays[0]
            tokenVolumeByDayMap.set(tokenVolumeByDayData.token, { ...tokenVolumeByDayData })
          }
        })
        const tokensData = resTokensData.reduce((acc, cur) => {
          // acc[pairId] = volumes
          const byDayData = tokenVolumeByDayMap.get(cur.token) || { volume: 0, volume7d: 0 }
          acc.push({
            ...cur,
            ...byDayData
          })
          return acc
        }, [])
        setDataTokens(tokensData)
      }
      fetchVolumes()
    }
  }, [data, todayMidnight])

  return {
    loadingToken,
    dataTokens
  }
}

const GET_TOKEN_DETAILS = gql`
  query GetToken($id: String!) {
    tokens(where: { id: $id }) {
      id
      name
      price
      symbol
      type
      liquidity
    }
  }
`
export function useTokenDetailsQueries(chainId: ChainId, address: string) {
  const { data, loading } = useQuery(GET_TOKEN_DETAILS, {
    variables: {
      id: address
    }
  })
  const tokenDetailsData = data?.tokens[0] || {}
  let result
  if (data?.tokens) {
    const tokenDetailsData = data?.tokens[0] || {}
    result = {
      ...tokenDetailsData,
      address: tokenDetailsData.id,
      tokenId: tokenDetailsData.id,
      price: convertWeiToEther(tokenDetailsData.price),
      liquidity: convertWeiToEther(tokenDetailsData.liquidity)
    }
  }
  return {
    result,
    loading
  }
}
