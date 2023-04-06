import { createReducer } from '@reduxjs/toolkit'
import { updateUserToken, UserTokenProp } from './actions'

interface SysUserToken {
  userToken: UserTokenProp
}

export const initialState: SysUserToken = {
  userToken: {
    token: ''
  }
}

export default createReducer(initialState, builder =>
  builder.addCase(updateUserToken, (state, action) => {
    state.userToken = action.payload.userToken
  })
)
