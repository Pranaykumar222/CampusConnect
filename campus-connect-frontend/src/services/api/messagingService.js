import client from './client'

const messagingService = {
  getConversations: () => client.get('/messages/conversations'),
  getMessages: (conversationId) => client.get(`/messages/${conversationId}`),
  sendMessage: (conversationId, data) =>
    client.post(`/messages/${conversationId}`, data),
  createConversation: (data) => client.post('/messages/conversations', data),
  createGroupChat: (data) => client.post('/messages/groups', data),
  updateGroupChat: (groupId, data) => client.put(`/messages/groups/${groupId}`, data),
  addGroupMember: (groupId, userId) =>
    client.post(`/messages/groups/${groupId}/members`, { userId }),
  removeGroupMember: (groupId, userId) =>
    client.delete(`/messages/groups/${groupId}/members/${userId}`),
  deleteConversation: (conversationId) =>
    client.delete(`/messages/conversations/${conversationId}`),
}

export default messagingService
