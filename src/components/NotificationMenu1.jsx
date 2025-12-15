import { useState } from 'react'
import { FaBell, FaCircle } from 'react-icons/fa'

const NotificationMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications] = useState([
    {
      id: 1,
      title: 'New Appointment',
      message: 'Dr. Smith has confirmed your appointment',
      time: '5 min ago',
      isRead: false
    },
    {
      id: 2,
      title: 'Reminder',
      message: 'Your appointment is scheduled for tomorrow',
      time: '1 hour ago',
      isRead: false
    },
    {
      id: 3,
      title: 'System Update',
      message: 'The system will be under maintenance',
      time: '2 hours ago',
      isRead: true
    }
  ])

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        <FaBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">{unreadCount} unread notifications</p>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.isRead && (
                      <FaCircle className="w-2 h-2 mt-2 text-blue-500" />
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                No notifications
              </div>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200">
              <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationMenu 