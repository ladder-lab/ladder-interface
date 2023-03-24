import { useActiveWeb3React } from './index'
import { useEffect, useState } from 'react'
import { Axios, testURL } from '../utils/axios'

export interface SbtListResult {
  address: string
  amount: string
  back_ground_image: string
  chain_id: string
  contract: string
  follows: string
  id: string
  introduction: string
  logo: string
  name: string
  sbt_url: string
  symbol: string
  twiter_retweet_link: string
  twitter: string
  twitter_link: string
}

export function useGetSbtList() {
  const { account, chainId } = useActiveWeb3React()
  const [result, setResult] = useState<SbtListResult[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const res = await Axios.get(testURL + 'getSbtToken', {
          chainId
        })
        const data = res.data.data.list as any
        if (!data) {
          setResult([])
          return
        }
        setResult(data)
      } catch (error) {
        setResult([])
        console.error('useMySbt', error)
      }
    })()
  }, [chainId, account])

  return {
    result
  }
}
