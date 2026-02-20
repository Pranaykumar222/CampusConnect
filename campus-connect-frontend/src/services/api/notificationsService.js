import client from './client'

const notificationsService = {
  getNotifications: (params) => client.get('/notifications', { params }),
  markAsRead: (notificationId) => client.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => client.put('/notifications/read-all'),
  deleteNotification: (notificationId) =>
    client.delete(`/notifications/${notificationId}`),
  getUnreadCount: () => client.get('/notifications/unread-count'),
}

export default notificationsService
