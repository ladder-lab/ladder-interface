import { useCallback, useEffect, useMemo, useState } from 'react'
import { Axios, testURL, v4Url } from '../utils/axios'
import { useActiveWeb3React } from './index'
import { useSignLogin } from './useSignIn'
import { useIsWindowFocus } from './useIsWindowVisible'
import MessageBox from '../components/Modal/TransactionModals/MessageBox'
import useModal from './useModal'

export function useVerifyTwitterFollow(sbtContract: string) {
  const { account, chainId } = useActiveWeb3React()
  const [follow, isFollow] = useState(false)

  const verifyFollow = useCallback(async () => {
    Axios.get(testURL + 'cheackTwiterFollow', {
      address: account,
      sbtContract,
      chainId
    })
      .then(r => {
        if (r?.data.code === 200) {
          const followResult = r.data.data
          let isFollowAll = true
          Object.keys(followResult).forEach(key => {
            isFollowAll = isFollowAll && followResult[key] == 2
          })
          isFollow(isFollowAll)
        } else {
          isFollow(false)
          throw Error('useVerifyTwitterFollow error')
        }
      })
      .catch(e => {
        isFollow(false)
        console.error(e)
      })
  }, [account, chainId, sbtContract])

  return {
    follow,
    verifyFollow
  }
}

export function useVerifyTwitterRetweet(sbtContract: string) {
  const { account, chainId } = useActiveWeb3React()
  const [retweet, isRetweet] = useState(false)

  const verifyRetweet = useCallback(async () => {
    Axios.get(testURL + 'cheackTwiterRetweet', {
      address: account,
      sbtContract,
      chainId
    })
      .then(r => {
        if (r?.data.code === 200 && r.data.data.retweetStatus == 2) {
          isRetweet(true)
        } else {
          isRetweet(false)
          throw Error('useVerifyTwitterRetweet error')
        }
      })
      .catch(e => {
        isRetweet(false)
        console.error(e)
      })
  }, [account, chainId, sbtContract])

  return {
    retweet,
    verifyRetweet
  }
}

export function useVerifyTwitterOauth(sbtContract: string) {
  const { account, chainId } = useActiveWeb3React()
  const [oauth, isOauth] = useState(false)

  const verifyOauth = useCallback(async () => {
    Axios.get(testURL + 'cheackTwiterOauth', {
      address: account,
      sbtContract,
      chainId
    })
      .then(r => {
        if (r?.data.code === 200 && r.data.data.oauthStatus == 2) {
          isOauth(true)
        } else {
          isOauth(false)
          throw Error('useVerifyTwitterRetweet error')
        }
      })
      .catch(e => {
        isOauth(false)
        console.error(e)
      })
  }, [account, chainId, sbtContract])

  return {
    oauth,
    verifyOauth
  }
}

export function useVerifyLadderOauth() {
  const { account } = useActiveWeb3React()
  const [oauth, isOauth] = useState(false)

  const verifyOauth = useCallback(async () => {
    Axios.get(v4Url + 'cheackTwiterOauth', {
      address: account
    })
      .then(r => {
        if (r?.data.code === 200 && r.data.data.oauthStatus == 2) {
          isOauth(true)
        } else {
          isOauth(false)
          throw Error('useVerifyTwitterRetweet error')
        }
      })
      .catch(e => {
        isOauth(false)
        console.error(e)
      })
  }, [account])

  return {
    oauth,
    verifyOauth
  }
}

export function useVerifyTwitter() {
  const { account } = useActiveWeb3React()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isWindowVisible = useIsWindowFocus()

  useEffect(() => {
    if (isWindowVisible) {
      setTimeout(() => {
        setIsLoading(false)
      })
    }
  }, [isWindowVisible])
  const jump = useCallback(async () => {
    try {
      if (!account) return
      const res = await Axios.get('/auth/twitter/login')
      console.log(res.data.authUrl)
      window.location.href = res.data.authUrl
    } catch (error) {
      setIsLoading(false)
      console.error('useAccountTestInfo', error)
    }
  }, [account])
  const { token, sign } = useSignLogin(jump)
  const openVerify = useCallback(() => {
    if (!token) {
      sign()
    } else {
      jump()
    }
  }, [jump, sign, token])
  return {
    openVerify,
    isLoading
  }
}

const STEP_STATUS = {
  wallet_connected: 1,
  twitter_connected: 2,
  tweet_sent: 3,
  claim_completed: 4
}

function useGetUserStatus(account: string | null | undefined) {
  const [userStatus, setUserStatus] = useState<keyof typeof STEP_STATUS>('')

  const getUserStatus = useCallback(async () => {
    try {
      const response = await Axios.get('/user-status', {
        walletAddress: account
      })
      if (response?.status === 200) {
        setUserStatus(response.data.status)
      } else {
        setUserStatus('')
        throw new Error('Failed to fetch user status')
      }
    } catch (error) {
      console.error('getUserStatus error:', error)
    }
  }, [account])

  return {
    getUserStatus,
    userStatus
  }
}
export function useGetRemoteStep() {
  const { account } = useActiveWeb3React()
  const { token } = useSignLogin()
  const { getUserStatus, userStatus } = useGetUserStatus(account)

  const remoteStep = useMemo(() => {
    if (!account || !userStatus) {
      return 0
    } else {
      return STEP_STATUS[userStatus]
    }
  }, [account, userStatus, token])

  return {
    verifyAll: getUserStatus,
    remoteStep
  }
}

export function useCheckMakeTwitter() {
  const { account } = useActiveWeb3React()
  const [makeTwitter, isMakeTwitter] = useState(false)

  const checkMakeTwitter = useCallback(async () => {
    Axios.get(v4Url + 'checkMakeTwitter', {
      address: account
    })
      .then(r => {
        if (r?.data.code === 200 && r.data.data.tweetStatus == 2) {
          isMakeTwitter(true)
        } else {
          isMakeTwitter(false)
          throw Error('useCheckMakeTwitter error')
        }
      })
      .catch(e => {
        isMakeTwitter(false)
        console.error(e)
      })
  }, [account])

  return {
    makeTwitter,
    checkMakeTwitter
  }
}

export function useMakeTwitter(verifyAll?: () => void) {
  const { account } = useActiveWeb3React()
  const [makeTwitter, isMakeTwitter] = useState(false)
  const { showModal } = useModal()

  const checkMakeTwitter = useCallback(async () => {
    Axios.post('/post-tweet', {
      walletAddress: account
    })
      .then(r => {
        if (r?.tweet) {
          isMakeTwitter(true)
          if (verifyAll) {
            setTimeout(verifyAll)
          }
          showModal(<MessageBox type="success">Make A Tweet Success</MessageBox>)
        } else {
          isMakeTwitter(false)
          throw Error('useCheckMakeTwitter error')
        }
      })
      .catch((e: any) => {
        const err: any = e
        isMakeTwitter(false)
        showModal(<MessageBox type="error">Make A Tweet Failed</MessageBox>)
        console.error(e)
      })
  }, [account])

  return {
    makeTwitter,
    checkMakeTwitter
  }
}
