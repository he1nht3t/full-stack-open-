import { useContext } from 'react'

import NotificationContext from '../contexts/notificationContext'

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    )
  }

  return context.notification
}

export const useSetNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useSetNotification must be used within a NotificationProvider'
    )
  }

  const setNotification = (notification) => {
    context.dispatchNotification({
      type: 'SET_NOTIFICATION',
      data: notification,
    })

    setTimeout(() => {
      context.dispatchNotification({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }

  return setNotification
}
