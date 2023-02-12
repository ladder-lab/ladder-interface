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

interface AccountRankValues {
  value: string
  rank: number
  account: string
}

export function useV3AccountVolumeRankTop(chainId: ChainId) {
  const { account } = useActiveWeb3React()
  const [accountRank, setAccountRank] = useState<AccountRankValues>()
  const [result, setResult] = useState<AccountRankValues[]>()

  useEffect(() => {
    ;(async () => {
      if (!chainId) {
        setResult(undefined)
        setAccountRank(undefined)
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
          setAccountRank(undefined)
          return
        }
        setResult(
          data.ranks.list.map((item: any) => ({
            value: item.volumes,
            rank: item.rank,
            account: item.account
          }))
        )
        account &&
          setAccountRank({
            account: account || '',
            rank: data.volumesRank === -1 ? '-' : data.volumesRank,
            value: data.accountVolumes
          })
      } catch (error) {
        setResult(undefined)
        setAccountRank(undefined)
        console.error('useV3AccountVolumeRank', error)
      }
    })()
  }, [account, chainId])

  return {
    rankList: result,
    accountRank
  }
}

export function useV3AccountAssetsRankTop(chainId: ChainId) {
  const { account } = useActiveWeb3React()
  const [accountRank, setAccountRank] = useState<AccountRankValues>()
  const [result, setResult] = useState<AccountRankValues[]>()

  useEffect(() => {
    ;(async () => {
      if (!chainId) {
        setResult(undefined)
        setAccountRank(undefined)
        return
      }
      try {
        const res = await Axios.get(StatBaseURL + 'getAccountAssetRank', {
          chainId,
          address: account || '',
          pageSize: 10,
          pageNum: 1
        })
        const data = res.data.data as any
        if (!data) {
          setResult(undefined)
          setAccountRank(undefined)
          return
        }
        setResult(
          data.ranks.list.map((item: any) => ({
            value: item.asset,
            rank: item.rank,
            account: item.account
          }))
        )
        account &&
          setAccountRank({
            account: account || '',
            rank: data.accountRank === -1 ? '-' : data.accountRank,
            value: data.accountAsset
          })
      } catch (error) {
        setResult(undefined)
        setAccountRank(undefined)
        console.error('useV3AccountAssetsRankTop', error)
      }
    })()
  }, [account, chainId])

  return {
    rankList: result,
    accountRank
  }
}

export function useV3AccountLiquidityRankTop(chainId: ChainId) {
  const { account } = useActiveWeb3React()
  const [accountRank, setAccountRank] = useState<AccountRankValues>()
  const [result, setResult] = useState<AccountRankValues[]>()

  useEffect(() => {
    ;(async () => {
      if (!chainId) {
        setResult(undefined)
        setAccountRank(undefined)
        return
      }
      try {
        const res = await Axios.get(StatBaseURL + 'getAccountTvlRank', {
          chainId,
          address: account || '',
          pageSize: 10,
          pageNum: 1
        })
        const data = res.data.data as any
        if (!data) {
          setResult(undefined)
          setAccountRank(undefined)
          return
        }
        setResult(
          data.ranks.list.map((item: any) => ({
            value: item.tvl,
            rank: item.rank,
            account: item.account
          }))
        )
        account &&
          setAccountRank({
            account: account || '',
            rank: data.accountRank === -1 ? '-' : data.accountRank,
            value: data.accountTvl
          })
      } catch (error) {
        setResult(undefined)
        setAccountRank(undefined)
        console.error('useV3AccountLiquidityRankTop', error)
      }
    })()
  }, [account, chainId])

  return {
    rankList: result,
    accountRank
  }
}
