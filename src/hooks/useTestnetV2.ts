import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { Axios, baseURL } from 'utils/axios'
import { useWeb3Instance } from 'hooks/useWeb3Instance'

export interface FeedbackInfoProp {
  feedback: {
    id: string
    email: string
    address: string
    summary: string
    description: string
    type: string
  } | null
  links: [
    {
      id: string
      address: string
      links: string
    }
  ]
}

export function useFeedbackInfo(account: string | undefined) {
  const [data, setData] = useState<FeedbackInfoProp>()
  const web3 = useWeb3Instance()

  useEffect(() => {
    setData(undefined)
    if (!account) {
      return
    }
    Axios.get('/getFeedback', { address: account })
      .then(res => {
        if (res.data?.data) {
          setData(res.data.data)
        } else {
          setData(undefined)
        }
      })
      .catch(() => setData(undefined))
  }, [account])

  const commit = useCallback(
    async (formData: FormData) => {
      if (!web3 || !account) return
      const message = 'commit feedback'
      const signature = await web3.eth.personal.sign(message, account, '')
      formData.append('message', message)
      formData.append('address', account)
      formData.append('signature', signature)
      return axios.post(baseURL + 'saveFeedback', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    [account, web3]
  )

  return { data, commit }
}
