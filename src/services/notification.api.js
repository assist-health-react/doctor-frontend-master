//import axios from '/utils/axios'; // or ../utils/axios
import api from './api';
export const fetchNotifications = () => {
  return api.get('/api/v1/notifications');
};

export const markNotificationRead = (id) => {
  return api.patch(`/api/v1/notifications/${id}/read`);
};

export const markAllNotificationsRead = () => {
  return api.patch('/api/v1/notifications/mark-all-read');
};
