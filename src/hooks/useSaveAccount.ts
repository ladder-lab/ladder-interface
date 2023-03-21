import { useActiveWeb3React } from './index'
import { useEffect, useState } from 'react'
import { Axios, testURL } from '../utils/axios'

export function useSaveAccount() {
  const { account, chainId } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState([])
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(testURL + 'saveAccount', {
          chainId,
          address: account
        })
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          return
        }
        setResult(data.list)
      } catch (error) {
        setResult([])
        setLoading(false)
        console.error('useTopTokensList', error)
      }
    })()
  }, [chainId, account])

  return {
    loading: loading,
    result
  }
}
