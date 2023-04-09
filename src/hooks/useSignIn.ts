import { useActiveWeb3React } from 'hooks'
import { useCallback, useEffect } from 'react'
import { useUserTokenCallback } from 'state/userToken/hooks'
import { Axios, axiosInstance, v4Url } from 'utils/axios'
import { API_TOKEN, getCookie, setCookie } from 'utils/cookies'
import { useWeb3Instance } from './useWeb3Instance'

export function useSignLogin(afterToken?: () => void) {
  const { account, chainId, library } = useActiveWeb3React()
  const web3 = useWeb3Instance()
  const { token, setToken } = useUserTokenCallback()

  const sign = useCallback(async () => {
    if (!web3 || !account || token) return

    const message = 'Login to ladder'
    const signature = await library?.getSigner().signMessage(message)

    Axios.post(v4Url + 'accountSign', {
      publicAddress: account,
      signature,
      chainId,
      message
    })
      .then(r => {
        if (r?.data.code === 200) {
          const _token = r.data.data.token
          setCookie(API_TOKEN + account, _token)
          setToken(_token)
          axiosInstance.defaults.headers.common['token'] = _token
          if (afterToken) {
            setTimeout(afterToken)
          }
        } else {
          throw Error('Sign in error')
        }
      })
      .catch(e => {
        console.error(e)
      })
  }, [account, afterToken, chainId, library, setToken, token, web3])

  return {
    sign,
    token
  }
}

export function useAxiosInterceptors() {
  const { account } = useActiveWeb3React()
  const { setToken } = useUserTokenCallback()

  useEffect(() => {
    const _token = account ? getCookie(API_TOKEN + account) : ''
    axiosInstance.defaults.headers.common['token'] = _token
    setToken(_token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  useEffect(() => {
    axiosInstance.interceptors.response.use(response => {
      if (response.data.code === 401) {
        setCookie(API_TOKEN + account, '')
        setToken('')
        axiosInstance.defaults.headers.common['token'] = ''
      }
      return response
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return null
}
