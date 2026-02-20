import client from './client'

const communityService = {
  getPosts: (params) => client.get('/community/posts', { params }),
  getPost: (postId) => client.get(`/community/posts/${postId}`),
  createPost: (data) => client.post('/community/posts', data),
  updatePost: (postId, data) => client.put(`/community/posts/${postId}`, data),
  deletePost: (postId) => client.delete(`/community/posts/${postId}`),
  likePost: (postId) => client.post(`/community/posts/${postId}/like`),
  unlikePost: (postId) => client.delete(`/community/posts/${postId}/like`),
  savePost: (postId) => client.post(`/community/posts/${postId}/save`),
  unsavePost: (postId) => client.delete(`/community/posts/${postId}/save`),
  getComments: (postId) => client.get(`/community/posts/${postId}/comments`),
  addComment: (postId, data) => client.post(`/community/posts/${postId}/comments`, data),
  deleteComment: (postId, commentId) =>
    client.delete(`/community/posts/${postId}/comments/${commentId}`),
}

export default communityService
