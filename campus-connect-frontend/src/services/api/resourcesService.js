import client from './client'

const resourcesService = {
  getResources: (params) => client.get('/resources', { params }),
  getResource: (resourceId) => client.get(`/resources/${resourceId}`),
  uploadResource: (formData) =>
    client.post('/resources', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteResource: (resourceId) => client.delete(`/resources/${resourceId}`),
  downloadResource: (resourceId) =>
    client.get(`/resources/${resourceId}/download`, { responseType: 'blob' }),
  rateResource: (resourceId, rating) =>
    client.post(`/resources/${resourceId}/rate`, { rating }),
}

export default resourcesService
