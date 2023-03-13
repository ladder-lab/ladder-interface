import { useEffect, useState } from 'react'
import { Axios, StatBaseURL } from 'utils/axios'
import { ChainId } from 'constants/chain'
import { StatTopPoolsProp, topPoolsListDataHandler } from './useStatBacked'
import { useActiveWeb3React } from 'hooks'

export function useV3ActivityData(chainId: ChainId) {
  const { account } = useActiveWeb3React()
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
          chainId,
          account: account || ''
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
  }, [account, chainId])

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
  rank: string | number
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
        // const res = await Axios.get(StatBaseURL + 'getAccountVolumeRank', {
        //   chainId,
        //   address: account || ''
        // })
        // const data = res.data.data as any
        const data = {
          accountVolumes: '0',
          volumesRank: -1,
          ranks: {
            total: '155',
            list: [
              {
                volumes: '27958137.773300',
                rank: 1.0,
                account: '0x7ac36247457dab3abb833accc538a3e56ce538b1'
              },
              {
                volumes: '20260050.512500',
                rank: 2.0,
                account: '0x5d5658e00ae51938423a31227971fc9848fb87f4'
              },
              {
                volumes: '18906313.980800',
                rank: 3.0,
                account: '0x542a889db38220c8fde30f62da0146daf9b166b3'
              },
              {
                volumes: '7294953.863100',
                rank: 4.0,
                account: '0x541c655fe515e4f23ceba008aefe77f76c14704b'
              },
              {
                volumes: '3581423.785500',
                rank: 5.0,
                account: '0x994b99e259ffc9134bf9504c6a42387defe54515'
              },
              {
                volumes: '828761.566500',
                rank: 6.0,
                account: '0xd2e44e40b5fb960a8a74dd7b9d6b7f14b805b50d'
              },
              {
                volumes: '544313.944700',
                rank: 7.0,
                account: '0x30960bab8a1c8c236809de1f7f6d71ba6d9cd403'
              },
              {
                volumes: '520017.030100',
                rank: 8.0,
                account: '0x0b2686938c273494544cff85ef45bbb5565acc95'
              },
              {
                volumes: '369350.715300',
                rank: 9.0,
                account: '0x5ae14e9675f51f503ee85760d23218eb3a0b602a'
              },
              {
                volumes: '249258.981700',
                rank: 10.0,
                account: '0xcf3d99d4edc0b15948ae516c71fefc09d8938d58'
              }
            ]
          }
        }
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
        // const res = await Axios.get(StatBaseURL + 'getAccountAssetRank', {
        //   chainId,
        //   address: account || '',
        //   pageSize: 10,
        //   pageNum: 1
        // })
        // const data = res.data.data as any
        const data = {
          ranks: {
            total: '163',
            list: [
              {
                chainId: 11155111,
                rank: 1.0,
                asset: '80421.2973',
                account: '0x30960bab8a1c8c236809de1f7f6d71ba6d9cd403'
              },
              {
                chainId: 11155111,
                rank: 2.0,
                asset: '55797.1182',
                account: '0x5ae14e9675f51f503ee85760d23218eb3a0b602a'
              },
              {
                chainId: 11155111,
                rank: 3.0,
                asset: '28648.3861',
                account: '0xfc7d1491dfcdcf6e72bf202e6d3bf5cc55e5b5ee'
              },
              {
                chainId: 11155111,
                rank: 4.0,
                asset: '20627.1615',
                account: '0xbcbfa2e11e18432e058a3f005c709dbcdd060308'
              },
              {
                chainId: 11155111,
                rank: 5.0,
                asset: '18453.1564',
                account: '0x541c655fe515e4f23ceba008aefe77f76c14704b'
              },
              {
                chainId: 11155111,
                rank: 6.0,
                asset: '15464.5053',
                account: '0x19bf4fe746c370e2930cd8c1b3dcfa55270c8ed7'
              },
              {
                chainId: 11155111,
                rank: 7.0,
                asset: '13002.8145',
                account: '0x631ab8eb40588543df900263f864b6376d56a587'
              },
              {
                chainId: 11155111,
                rank: 8.0,
                asset: '10992.0546',
                account: '0x32227adbbacec1a1b84dc6d6c4b0ceff2c622f07'
              },
              {
                chainId: 11155111,
                rank: 9.0,
                asset: '8811.9038',
                account: '0x5d18a44476d6acb7fa7c1ec09333966b82021ff0'
              },
              {
                chainId: 11155111,
                rank: 10.0,
                asset: '8347.5745',
                account: '0x6ebbd2f1ce30b0b9e61ae35344255a80fdfa9e5e'
              }
            ]
          },
          accountAsset: '0',
          accountRank: -1
        }
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
        // const res = await Axios.get(StatBaseURL + 'getAccountTvlRank', {
        //   chainId,
        //   address: account || '',
        //   pageSize: 10,
        //   pageNum: 1
        // })
        // const data = res.data.data as any
        const data = {
          accountTvl: '0',
          ranks: {
            total: '163',
            list: [
              {
                chainId: 11155111,
                rank: 1.0,
                tvl: '55797.11823142',
                account: '0x5ae14e9675f51f503ee85760d23218eb3a0b602a'
              },
              {
                chainId: 11155111,
                rank: 2.0,
                tvl: '18453.15641884',
                account: '0x541c655fe515e4f23ceba008aefe77f76c14704b'
              },
              {
                chainId: 11155111,
                rank: 3.0,
                tvl: '11907.72776344',
                account: '0x19bf4fe746c370e2930cd8c1b3dcfa55270c8ed7'
              },
              {
                chainId: 11155111,
                rank: 4.0,
                tvl: '10323.66830231',
                account: '0xbcbfa2e11e18432e058a3f005c709dbcdd060308'
              },
              {
                chainId: 11155111,
                rank: 5.0,
                tvl: '10078.21715511',
                account: '0x631ab8eb40588543df900263f864b6376d56a587'
              },
              {
                chainId: 11155111,
                rank: 6.0,
                tvl: '6821.34703626',
                account: '0x3d446c9528f5dec1848dbe4cc6d4fd2c432b336c'
              },
              {
                chainId: 11155111,
                rank: 7.0,
                tvl: '6649.63710278',
                account: '0xc212d5339bec65ea533b6dde66829c873b8ce390'
              },
              {
                chainId: 11155111,
                rank: 8.0,
                tvl: '6557.58753879',
                account: '0x2904cd62abed42916990219cee643f4a26bc5643'
              },
              {
                chainId: 11155111,
                rank: 9.0,
                tvl: '6498.29389543',
                account: '0xa11682f14a888e3ddc85fd396cc509e822e3c97a'
              },
              {
                chainId: 11155111,
                rank: 10.0,
                tvl: '6222.31471821',
                account: '0x2a3381b6909512ff4a028b6ca747e4592f8384d5'
              }
            ]
          },
          accountRank: -1
        }
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
