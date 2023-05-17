import { createSlice } from '@reduxjs/toolkit'

const loginUserSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser: (state, action) => {
      return action.payload
    },
    clearUser: () => {
      return null
    },
  },
})

export const { setUser, clearUser } = loginUserSlice.actions
export default loginUserSlice.reducer
