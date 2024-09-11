import { gql, useQuery } from '@apollo/client'
import { GraphOrderType, GraphOrderTypeMap } from '../hooks/useStatBacked'
import { Mode } from '../components/Input/CurrencyInputPanel/SelectCurrencyModal'
import { useEffect, useState } from 'react'
import { ChainId } from '@ladder/sdk'
import { convertWeiToEther } from '../utils'

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
  orderBy: GraphOrderType
  id?: string | number
  type: string
  showNFT?: boolean
}

export const TokensTypeMap: Record<string, string> = {
  [Mode.ERC20]: 'ERC20',
  [Mode.ERC1155]: 'ERC1155',
  [Mode.ERC721]: 'ERC721'
}

export function useTokensQueries(props: Props) {
  const today = new Date()
  const todayMidnight = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000)

  const [dataTokens, setDataTokens] = useState([])
  const { currentPage, pageSize, order, orderBy, id, type, showNFT } = props
  let tokenType: string[] = ['ERC20', 'ERC1155', 'ERC721']
  if (showNFT) {
    tokenType = ['ERC1155', 'ERC721']
  } else if (!!type) {
    tokenType = [TokensTypeMap[type]]
  }
  const skip = pageSize * (currentPage - 1)
  const queryOrderBy = orderBy ? GraphOrderTypeMap[orderBy] : 'liquidity'
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
        const volumePromises = resTokensData.map((token: { id: any }) => {
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
        const tokensData = resTokensData.reduce((acc: any[], cur: { token: any }) => {
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
  }, [client, data, todayMidnight])

  return {
    loadingToken,
    dataTokens
  }
}

const GET_TOKEN_DETAILS = gql`
  query GetTokenDetails($id: String!) {
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

export function useTokenDetailsQueries(chainId: ChainId, address?: string) {
  const todayMidnight = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000)
  const [result, setResult] = useState()
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
          tokenId: tokenDetailsData.id,
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
