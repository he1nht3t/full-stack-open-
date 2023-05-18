import { useSelector } from 'react-redux'

//UI
import { Message } from 'semantic-ui-react'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (notification === null) {
    return null
  }

  if (notification.type === 'success') {
    return <Message success header={notification.message} />
  }

  if (notification.type === 'error') {
    return <Message error header={notification.message} />
  }
}

export default Notification
