import client from './client'

const profileService = {
  getProfile: (userId) => client.get(`/profile/${userId}`),
  updateProfile: (data) => client.put('/profile', data),
  uploadAvatar: (formData) =>
    client.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadBanner: (formData) =>
    client.post('/profile/banner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  addSkill: (skill) => client.post('/profile/skills', { skill }),
  removeSkill: (skill) => client.delete(`/profile/skills/${skill}`),
  addInterest: (interest) => client.post('/profile/interests', { interest }),
  removeInterest: (interest) => client.delete(`/profile/interests/${interest}`),
  getActivity: (userId) => client.get(`/profile/${userId}/activity`),
  followUser: (userId) => client.post(`/profile/${userId}/follow`),
  unfollowUser: (userId) => client.delete(`/profile/${userId}/follow`),
  getFollowers: (userId) => client.get(`/profile/${userId}/followers`),
  getFollowing: (userId) => client.get(`/profile/${userId}/following`),
  getRelationship: (userId) =>
    client.get(`/follow/${userId}/relationship`),
  
}

export default profileService
