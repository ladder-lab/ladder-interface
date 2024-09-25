import { gql, useQuery } from '@apollo/client'
import { useEffect, useMemo, useState } from 'react'
import client from './apolloClient'
import { ChainId } from '../constants/chain'

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
    pairVolumeByDays(where: { timestamp_gte: $todayMidnight, pair_contains: $pairId }) {
      id
      pair
      timestamp
      volume
      volume7d
    }
  }
`

interface Props {
  chainId: ChainId
  currentPage: number
  pageSize: number
  order: string
  orderBy: string
  type: string | null
  token?: string
  showNFT?: boolean
}
export function usePoolsQueries(props: Props) {
  const { currentPage, pageSize, type, order, orderBy, token, showNFT } = props
  const [dataPairs, setDataPairs] = useState([])
  const today = new Date()
  const todayMidnight = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000)
  const sevenDaysAgoMidnight = todayMidnight - 7 * 24 * 60 * 60

  const pairType = type ? type.split(' - ')[1] : ''
  let tokenType: string[] = ['ERC20', 'ERC1155', 'ERC721']
  if (showNFT) {
    tokenType = ['ERC1155', 'ERC721']
  } else if (!!type) {
    tokenType = [pairType]
  }
  const skip = pageSize * (currentPage - 1)
  const queryOrderBy = orderBy ? orderBy : 'liquidity'
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
        const volumePromises = resPairsData.map(async pair => {
          /*      return client.query({
            query: GET_PAIR_VOLUME_BY_DAY,
            variables: { pairId: pair.id, todayMidnight }
          })*/
          const result = await client.query({
            query: GET_PAIR_VOLUME_BY_DAY,
            variables: { pairId: pair.id, todayMidnight }
          })
          if (!result.data.pairVolumeByDays.length) {
            const result7d = await client.query({
              query: GET_PAIR_VOLUME_BY_DAY,
              variables: { pairId: pair.id, todayMidnight: sevenDaysAgoMidnight }
            })
            const result7dData = result7d.data.pairVolumeByDays[0] || { volume: '0', volume7d: '0' }
            return {
              pairId: pair.id,
              data: {
                ...result7dData,
                volume: '0',
                volume7d: result7dData.volume
              }
            }
          }

          return { pairId: pair.id, data: result.data.pairVolumeByDays[0] }
        })
        const volumesResults = await Promise.all(volumePromises)
        const pairVolumeByDayMap = new Map()
        volumesResults.forEach(item => {
          pairVolumeByDayMap.set(item.pairId, { ...item.data })
        })
        const pairsData = resPairsData.reduce((acc, cur) => {
          const byDayData = pairVolumeByDayMap.get(cur.id) || { volume: '0', volume7d: '0' }
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
