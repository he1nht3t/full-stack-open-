import { createSlice } from '@reduxjs/toolkit'

import { setNotification } from './notificationReducer'

//services
import { get } from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (state, action) => {
      return action.payload
    },
  },
})
export const { setUsers } = usersSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    try {
      const users = await get()
      dispatch(setUsers(users))
    } catch (error) {
      dispatch(
        setNotification(
          {
            message: error.response.data.error,
            type: 'error',
          },
          5
        )
      )
    }
  }
}

export default usersSlice.reducer
