import client from './client'

const adminService = {
  getAnalytics: () => client.get('/admin/analytics'),
  getUsers: (params) => client.get('/admin/users', { params }),
  banUser: (userId) => client.post(`/admin/users/${userId}/ban`),
  unbanUser: (userId) => client.post(`/admin/users/${userId}/unban`),
  deleteUser: (userId) => client.delete(`/admin/users/${userId}`),
  getReportedContent: (params) => client.get('/admin/reported-content', { params }),
  moderateContent: (contentId, action) =>
    client.post(`/admin/content/${contentId}/moderate`, { action }),
  getSettings: () => client.get('/admin/settings'),
  updateSettings: (data) => client.put('/admin/settings', data),
}

export default adminService
