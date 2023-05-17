import { createContext, useReducer } from 'react'

const NotificationContext = createContext()

/* eslint-disable indent */
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data
    case 'CLEAR_NOTIFICATION':
      return null
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatchNotification] = useReducer(
    notificationReducer,
    null
  )

  return (
    <NotificationContext.Provider
      value={{ notification, dispatchNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
