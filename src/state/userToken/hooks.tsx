import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updateUserToken, UserTokenProp } from './actions'
import { API_TOKEN, getCookie } from '../../utils/cookies'
import { useActiveWeb3React } from '../../hooks'

export function useUserTokenCallback() {
  const { account } = useActiveWeb3React()
  const data = useSelector((state: AppState) => state.userToken.userToken)
  const cookieToken = getCookie(API_TOKEN + account)

  const dispatch = useDispatch<AppDispatch>()
  const updateUserTokenCallback = useCallback(
    (userToken: UserTokenProp) => {
      dispatch(updateUserToken({ userToken }))
    },
    [dispatch]
  )
  const setToken = useCallback(
    (token: string) => {
      updateUserTokenCallback({ ...data, token })
    },
    [data, updateUserTokenCallback]
  )

  return {
    setToken,
    token: data.token || cookieToken
  }
}
