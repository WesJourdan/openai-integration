// import primary libraries
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// import services
import { useNotificationFromMap } from '../notificationService'


const NotificationListItem = ({ id, handleClick = () => { } }) => {
  const notification = useNotificationFromMap(id);
  if(!notification) return <Skeleton />;
  return (
    <li className={`list-none p-2 block ${notification.unread ? "font-bold" : ""}`}>
      {notification.link ?
        <Link onClick={handleClick} to={notification.link}>{notification.message}</Link>
        :
        <span>{notification.message}</span>
      }
    </li>
  )
}

// custom loading skeleton for this component, by defining it right here we can keep it synced with any changes we make to the actual component above
const Skeleton = () => {
  return (
    <li className="animate-pulse list-none p-2 block">
      <p className='bg-gray-600 h-4 w-32 mt-1'></p>
    </li>
  )
}
// add the skeleton to the component so we can access it in other components (NotificationList in this case)
NotificationListItem.Skeleton = Skeleton

NotificationListItem.propTypes = {
  id: PropTypes.string.isRequired
  , handleClick: PropTypes.func
}

export default NotificationListItem