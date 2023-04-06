import { useActiveWeb3React } from './index'
import { useCallback, useState } from 'react'
import { Axios, testURL } from '../utils/axios'

export interface UserProps {
  email: string
  username: string
  twitter: string
  type: number
}

export interface OrganProps {
  logo: string
  username: string
  website: string
  telegram: string
  email: string
  type: number
}

export function useSaveAccount(props: UserProps | OrganProps) {
  const { account, chainId } = useActiveWeb3React()
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState([])
  const save = useCallback(async () => {
    setLoading(true)
    try {
      const res = await Axios.post(testURL + 'saveAccount', { ...props, address: account, chainId })
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
      console.error('useSaveAccount', error)
    }
  }, [account, chainId, props])

  return {
    save,
    loading: loading,
    result
  }
}
