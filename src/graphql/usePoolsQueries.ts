import { gql, useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import { ChainId } from '@ladder/sdk'
import { GraphOrderTypeMap } from '../hooks/useStatBacked'
import client from './apolloClient'

const TOKEN_FIELDS = gql`
  fragment TokenFields on Token {
    id
    price
    symbol
    name
    type
    liquidity
  }
`

const GET_PAIRS = gql`
  query GetPairs(
    $skip: Int
    $pageSize: Int
    $orderBy: String
    $order: String
    $pairType: [String]!
    $tokenA: String
    $tokenB: String
  ) {
    pairs(
      skip: $skip
      first: $pageSize
      orderBy: $orderBy
      orderDirection: $order
      where: { pairType_in: $pairType, tokenA_contains: $tokenA, tokenB_contains: $tokenB }
    ) {
      tokenA {
        ...TokenFields
      }
      tokenB {
        ...TokenFields
      }
      id
      address
      liquidity
      tokenAAmount
      tokenBAmount
      volume
      pairType
    }
  }
  ${TOKEN_FIELDS}
`

const GET_PAIR_VOLUME_BY_DAY = gql`
  query GetPairVolumeByDay($pairId: String!, $todayMidnight: Int!) {
    pairVolumeByDays(where: { timestamp_lt: $todayMidnight, pair_contains: $pairId }) {
      id
      pair
      timestamp
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
  type: string
  token?: string
  showNFT?: boolean
}
export function usePoolsQueries(props: Props) {
  const { currentPage, pageSize, type, order, orderBy, token, showNFT } = props
  const [dataPairs, setDataPairs] = useState([])
  const today = new Date()
  const todayMidnight = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000) // 转换为秒
  const pairType = type.split(' - ')[1]
  let tokenType: string[] = ['ERC20', 'ERC1155', 'ERC721']
  if (showNFT) {
    tokenType = ['ERC1155', 'ERC721']
  } else if (!!type) {
    tokenType = [pairType]
  }
  const skip = pageSize * (currentPage - 1)
  const queryOrderBy = orderBy ? GraphOrderTypeMap[orderBy] : 'liquidity'
  const baseVariables = {
    skip,
    pageSize,
    order,
    orderBy: queryOrderBy,
    pairType: tokenType
  }
  const {
    loading: loadingPairsA,
    error: errorPairsA,
    data: dataPairsA
  } = useQuery(GET_PAIRS, {
    variables: {
      ...baseVariables,
      tokenA: token,
      tokenB: ''
    },
    skip: !token || !!(pairType && pairType === 'ERC20')
  })
  const {
    loading: loadingPairsB,
    error: errorPairsB,
    data: dataPairsB
  } = useQuery(GET_PAIRS, {
    variables: {
      ...baseVariables,
      tokenA: '',
      tokenB: token
    },
    skip: !token || !!(pairType && pairType !== 'ERC20')
  })
  const {
    loading: loadingPairsDefault,
    error: errorPairsDefault,
    data: dataPairsDefault
  } = useQuery(GET_PAIRS, {
    variables: {
      ...baseVariables,
      tokenA: '',
      tokenB: ''
    },
    skip: !!token
  })
  const loadingPairs = loadingPairsA || loadingPairsB || loadingPairsDefault
  const errorPairs = errorPairsA || errorPairsB || errorPairsDefault
  const resPairsData = useMemo(() => {
    const result = []
    if (dataPairsA?.pairs) {
      result.push(...dataPairsA.pairs)
    } else if (dataPairsB?.pairs) {
      result.push(...dataPairsB.pairs)
    } else if (dataPairsDefault?.pairs) {
      result.push(...dataPairsDefault.pairs)
    }
    return result
  }, [dataPairsA, dataPairsB, dataPairsDefault])
  useEffect(() => {
    if (resPairsData) {
      const fetchVolumes = async () => {
        const volumePromises = resPairsData.map(pair => {
          return client.query({
            query: GET_PAIR_VOLUME_BY_DAY,
            variables: { pairId: pair.id, todayMidnight }
          })
        })
        const volumesResults = await Promise.all(volumePromises)
        const pairVolumeByDayMap = new Map()
        volumesResults.map(item => {
          if (item.data.pairVolumeByDays.length) {
            const pairVolumeByDayData = item.data.pairVolumeByDays[0]
            pairVolumeByDayMap.set(pairVolumeByDayData.pair, { ...pairVolumeByDayData })
          }
        })
        const pairsData = resPairsData.reduce((acc, cur) => {
          // acc[pairId] = volumes
          const byDayData = pairVolumeByDayMap.get(cur.pairId) || { volume: 0, volume7d: 0 }
          acc.push({
            ...cur,
            ...byDayData
          })
          return acc
        }, [])
        setDataPairs(pairsData)
      }
      fetchVolumes()
    }
  }, [resPairsData, todayMidnight])

  return {
    errorPairs,
    dataPairs,
    loadingPairs
  }
}

const GET_PAIRS_DETAILS = gql`
  query GetPair($pair: String!) {
    pair(id: $pair) {
      tokenA {
        ...TokenFields
      }
      tokenB {
        ...TokenFields
      }
      id
      address
      liquidity
      tokenAAmount
      tokenBAmount
      volume
      pairType
    }
  }
  ${TOKEN_FIELDS}
`
export function usePoolsDetailsQueries(chainId: ChainId, pair: string) {
  const { data, loading } = useQuery(GET_PAIRS_DETAILS, {
    variables: {
      pair: pair
    }
  })
  return {
    data,
    loading
  }
}
