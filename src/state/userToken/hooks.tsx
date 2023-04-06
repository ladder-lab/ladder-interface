import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { updateUserToken, UserTokenProp } from './actions'

export function useUserTokenCallback() {
  const data = useSelector((state: AppState) => state.userToken.userToken)

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
    token: data.token
  }
}
