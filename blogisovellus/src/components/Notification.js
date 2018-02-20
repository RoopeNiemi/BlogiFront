import React from 'react'

const Notification = ({ message }) => {
    if (message !== '') {
    
    return (
      <div className="notification">
        {message}
      </div>
    )
  }
  }
  export default Notification;