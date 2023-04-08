import { useCallback, useState } from 'react'
import { Axios, testURL, v4Url } from '../utils/axios'
import { useActiveWeb3React } from './index'
import { useSignLogin } from './useSignIn'

export function useVerifyTwitterAll(sbt: string) {
  const { account, chainId } = useActiveWeb3React()
  const [allPass, isAllPass] = useState('')

  const verifyAll = useCallback(async () => {
    Axios.get(testURL + 'checkTwiterTaskStatus', {
      address: account,
      sbt,
      chainId
    })
      .then(r => {
        if (r?.data.code === 200) {
          const statusResult = r.data.data
          let verify = false
          let retweet = false
          let followAll = true
          Object.keys(statusResult).forEach(key => {
            if (key.includes('oauthStatus')) {
              verify = statusResult[key] == 2
            }
            if (key.includes('retweetStatus')) {
              retweet = statusResult[key] == 2
            }
            if (key.includes('followStatus')) {
              followAll = followAll && statusResult[key] == 2
            }
          })
          console.log('verify', verify)
          console.log('verify1', followAll)
          console.log('verify2', retweet)
          if (!verify) {
            isAllPass('Twitter not verify')
            return
          }
          if (!followAll) {
            isAllPass('Need to follow all users')
            return
          }
          if (!retweet) {
            isAllPass('Need to retweet')
            return
          }
          isAllPass('')
        } else {
          throw Error('useVerifyTwitterFollow error')
        }
      })
      .catch(e => {
        console.error(e)
      })
  }, [account, chainId, sbt])

  return {
    verifyAll,
    allPass
  }
}

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

export function useVerifyTwitter(isV4 = false) {
  const { token, sign } = useSignLogin()
  const { account } = useActiveWeb3React()
  const openVerify = useCallback(() => {
    async function jump() {
      try {
        if (!account) return
        const res = await Axios.get((isV4 ? v4Url : testURL) + 'requestToken', {
          address: account
        })
        const data = res.data.msg as string
        if (!data) {
          return
        }
        const twitter = window.open(
          data,
          'intent',
          'scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=500,height=500,left=0,top=0'
        )
        twitter?.addEventListener('beforeunload', () => {
          // not working
          console.log('close twitter')
        })
        return
      } catch (error) {
        console.error('useAccountTestInfo', error)
      }
    }

    if (!token) {
      sign().then(async () => {
        jump()
      })
    } else {
      jump()
    }
  }, [account, isV4, sign, token])
  return {
    openVerify
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
