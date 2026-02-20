import client from './client'

const discoverService = {
  getUsers: (params) => client.get('/discover/users', { params }),
  getClubs: (params) => client.get('/discover/clubs', { params }),
  joinClub: (clubId) => client.post(`/discover/clubs/${clubId}/join`),
  leaveClub: (clubId) => client.delete(`/discover/clubs/${clubId}/leave`),
  getSuggested: () => client.get('/discover/suggested'),
  search: (query) => client.get('/discover/search', { params: { q: query } }),
}

export default discoverService
