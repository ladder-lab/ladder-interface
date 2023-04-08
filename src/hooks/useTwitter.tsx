import { useCallback, useState } from 'react'
import { Axios, v4Url } from '../utils/axios'
import { useActiveWeb3React } from './index'

export function useCheckOauth() {
  const [oauth, isOauth] = useState()
  const { account } = useActiveWeb3React()
  const checkOauth = useCallback(() => {
    Axios.get(v4Url + 'cheackTwiterOauth', {
      address: account
    }).then(resp => {
      isOauth(resp.data.data)
    })
  }, [account])
  return {
    checkOauth,
    oauth
  }
}
