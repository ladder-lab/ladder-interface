import { useEffect, useState } from 'react'
import { Axios, StatBaseURL } from 'utils/axios'
import { ChainId } from 'constants/chain'
import { StatTopPoolsProp, topPoolsListDataHandler } from './useStatBacked'
import { useActiveWeb3React } from 'hooks'

export function useV3ActivityData(chainId: ChainId) {
  const [result, setResult] = useState<{
    transfers: number
    tvl: number
    assets: number
  }>()

  useEffect(() => {
    ;(async () => {
      if (!chainId) {
        setResult(undefined)
        return
      }
      try {
        const res = await Axios.get(StatBaseURL + 'getActivityData', {
          chainId
        })
        const data = res.data.data as any
        if (!data) {
          setResult(undefined)
          return
        }
        setResult({
          transfers: data.transfers,
          tvl: Number(data.tvl),
          assets: Number(data.assets)
        })
      } catch (error) {
        setResult(undefined)
        console.error('useV3ActivityData', error)
      }
    })()
  }, [chainId])

  return result
}

export function useV3PoolTop10(chainId: ChainId) {
  const [result, setResult] = useState<StatTopPoolsProp[]>()

  useEffect(() => {
    ;(async () => {
      if (!chainId) {
        setResult(undefined)
        return
      }
      try {
        const res = await Axios.get(StatBaseURL + 'getTopPool', {
          chainId
        })
        const data = res.data.data as any
        if (!data) {
          setResult(undefined)
          return
        }
        setResult(topPoolsListDataHandler(data))
      } catch (error) {
        setResult(undefined)
        console.error('useV3PoolTop10', error)
      }
    })()
  }, [chainId])

  return result
}

export function useV3AccountVolumeRank(chainId: ChainId) {
  const { account } = useActiveWeb3React()
  const [result, setResult] = useState<
    {
      volumes: string
      rank: number
      account: string
    }[]
  >()

  useEffect(() => {
    ;(async () => {
      if (!chainId) {
        setResult(undefined)
        return
      }
      try {
        const res = await Axios.get(StatBaseURL + 'getAccountVolumeRank', {
          chainId,
          address: account || ''
        })
        const data = res.data.data as any
        if (!data) {
          setResult(undefined)
          return
        }
        setResult(data.ranks.list)
      } catch (error) {
        setResult(undefined)
        console.error('useV3AccountVolumeRank', error)
      }
    })()
  }, [account, chainId])

  return {
    rankList: result
  }
}
