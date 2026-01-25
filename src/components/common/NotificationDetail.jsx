import React from 'react';
import { FaTimes, FaTrash, FaCheck } from 'react-icons/fa';

const NotificationDetail = ({ notifications, onClose, onMarkAllRead, onClearAll }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-25 z-[998]" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-lg shadow-xl z-[999] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">All Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-end gap-4 mb-6">
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50"
          >
            <FaCheck className="w-4 h-4" />
            Mark All as Read
          </button>
          <button
            onClick={onClearAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50"
          >
            <FaTrash className="w-4 h-4" />
            Clear All
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-4 rounded-lg border ${
                  notification.isRead ? 'bg-white' : 'bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-800">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600">{notification.message}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">{notification.time}</span>
                      <span className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-blue-600 font-medium'}`}>
                        {notification.isRead ? 'Read' : 'Unread'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationDetail; 