import { useNotification } from '../hooks/notificationHooks'

const Notification = () => {
  const notification = useNotification()

  if (notification === null) {
    return null
  }

  if (notification.type === 'success') {
    return <div className="success">{notification.message}</div>
  }

  if (notification.type === 'error') {
    return <div className="error">{notification.message}</div>
  }
}

export default Notification
