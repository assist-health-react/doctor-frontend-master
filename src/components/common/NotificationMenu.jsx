import { useState,useEffect  } from 'react'
import { FaBell, FaCircle } from 'react-icons/fa'
import NotificationDetail from './NotificationDetail'
import { useNavigate } from 'react-router-dom';

import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../../services/notification.api';
const NotificationMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  //24.1.26
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const unreadNotifications = Array.isArray(notifications)
  ? notifications.filter(n => !n.isRead)
  : [];
  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     title: 'New Appointment',
  //     message: 'Dr. Smith has confirmed your appointment',
  //     time: '5 min ago',
  //     isRead: false
  //   },
  //   {
  //     id: 2,
  //     title: 'Reminder',
  //     message: 'Your appointment is scheduled for tomorrow',
  //     time: '1 hour ago',
  //     isRead: false
  //   },
  //   {
  //     id: 3,
  //     title: 'System Update',
  //     message: 'The system will be under maintenance',
  //     time: '2 hours ago',
  //     isRead: true
  //   }
  // ])


//24.1.26
// const loadNotifications = async () => {
//   setLoading(true);
//   try {
//     const res = await fetchNotifications();
//     const data = res.data.data;

//     setNotifications(data);
//     setUnreadCount(data.filter(n => !n.isRead).length);
//   } catch (err) {
//     console.error('Notification fetch failed', err);
//   } finally {
//     setLoading(false);
//   }
// };
const loadNotifications = async () => {
  try {
    const res = await fetchNotifications();
    // res === { status, data }
    console.log("***")
    console.log(res)
    console.log(res.data)
    console.log("***")
   const list = Array.isArray(res?.data?.data) ? res.data.data : [];


    setNotifications(list);
    setUnreadCount(list.filter(n => !n.isRead).length);
  } catch (err) {
    console.error('Notification fetch failed', err);
    setNotifications([]);
    setUnreadCount(0);
  }
};


useEffect(() => {
  loadNotifications();
}, []);
const markAsReadLocal = (id) => {
  setNotifications(prev =>
    prev.map(n =>
      n._id === id
        ? { ...n, isRead: true, readAt: new Date() }
        : n
    )
  );
};
const handleNotificationClick = async (n) => {
  if (!n.isRead) {
    await markNotificationRead(n._id);
    markAsReadLocal(n._id);
  }
  navigate(n.actionUrl);
};
const markAllReadLocal = () => {
  setNotifications(prev =>
    prev.map(n => ({
      ...n,
      isRead: true,
      readAt: new Date()
    }))
  );
  setUnreadCount(0);
};
const clearNotifications = () => {
  setNotifications([]);
  setUnreadCount(0);
};


//24.1.26---

  //const unreadCount = notifications.filter(n => !n.isRead).length

  // const handleNotificationClick = () => {
  //   setShowDetail(true)
  //   setIsOpen(false)
  // }

  // const handleMarkAllRead = () => {
  //   setNotifications(notifications.map(notification => ({
  //     ...notification,
  //     isRead: true
  //   })))
  // }
const handleMarkAllRead = async () => {
  await markAllNotificationsRead(); // backend
  markAllReadLocal();               // frontend
};
  const handleClearAll = () => {
    setNotifications([])
    setShowDetail(false)
  }

  const formatTime = (date) =>
  new Date(date).toLocaleString();

  return (
    <>
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
          <>
            <div className="fixed inset-0 bg-black bg-opacity-25 z-[998]" onClick={() => setIsOpen(false)}></div>
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-1 z-[999]">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-500">{unreadCount} unread notifications</p>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {/* {Array.isArray(notifications) && notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`px-4 py-3 cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    No notifications
                  </div>
                )} */}
                {unreadNotifications.length > 0 ? (
                      unreadNotifications.map(notification => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className="px-4 py-3 cursor-pointer bg-blue-50"
                        >
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-gray-500">
                        No new notifications
                      </div>
                    )}


              </div>
              {notifications.length > 0 && (
                <div className="px-4 py-2 border-t border-gray-200">
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      {showDetail && (
        <NotificationDetail
          notifications={notifications}
          onClose={() => setShowDetail(false)}
          onMarkAllRead={handleMarkAllRead}
          onClearAll={handleClearAll}
        />
      )}
    </>
  )
}

export default NotificationMenu 