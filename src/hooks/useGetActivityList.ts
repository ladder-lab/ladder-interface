import { useActiveWeb3React } from './index'
import { useEffect, useState } from 'react'
import { Axios, testURL } from '../utils/axios'

interface ActivityList {
  account: string
  chainId: string
  contract: string
  id: string
  logo: string
  name: string
  symbol: string
  timestamp: string
}

export function useGetActivityList(sbt: string) {
  const { chainId } = useActiveWeb3React()
  const [result, setResult] = useState<ActivityList[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const res = await Axios.get(testURL + 'mintRecord', {
          chainId,
          sbt: sbt
        })
        const data = res.data.data.list as ActivityList[]
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
  }, [chainId, sbt])

  return {
    result
  }
}
