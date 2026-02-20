import client from './client'

const connectionService = {
  sendRequest: (userId) => client.post(`/connections/${userId}`),

  getMyConnections: () => client.get('/connections'),

  getPendingRequests: () => client.get('/connections/requests'),

  respond: (connectionId, action) =>
    client.patch(`/connections/${connectionId}/respond`, { action }),

  cancel: (connectionId) =>
    client.delete(`/connections/${connectionId}/cancel`),

  remove: (connectionId) =>
    client.delete(`/connections/${connectionId}/remove`),
}

export default connectionService
