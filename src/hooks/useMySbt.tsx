import { useEffect, useState } from 'react'
import { Axios, testURL } from '../utils/axios'
import { useActiveWeb3React } from './index'

export function useMySbt(pageSize = 10) {
  const { account, chainId } = useActiveWeb3React()
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState([])
  const [count, setCount] = useState<number>(0)
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await Axios.get(testURL + 'getOnwedSbt', {
          chainId,
          address: account
        })
        setLoading(false)
        const data = res.data.data as any
        if (!data) {
          setResult([])
          setCount(0)
          return
        }
        setCount(Number(data.total))
        setResult(data.list)
      } catch (error) {
        setResult([])
        setCount(0)
        setLoading(false)
        console.error('useTopTokensList', error)
      }
    })()
  }, [chainId, currentPage, account])

  return {
    loading: loading,
    page: {
      setCurrentPage: (page: number) => setCurrentPage(page),
      currentPage,
      count,
      totalPage: Math.ceil(count / pageSize),
      pageSize: pageSize
    },
    result
  }
}
