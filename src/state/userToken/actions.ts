import { createAction } from '@reduxjs/toolkit'

export interface UserTokenProp {
  token: string
}

export const updateUserToken = createAction<{ userToken: UserTokenProp }>('userToken/updateUserToken')
