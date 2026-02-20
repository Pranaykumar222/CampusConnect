import client from './client'

const projectsService = {
  getProjects: (params) => client.get('/projects', { params }),
  getProject: (projectId) => client.get(`/projects/${projectId}`),
  createProject: (data) => client.post('/projects', data),
  updateProject: (projectId, data) => client.put(`/projects/${projectId}`, data),
  deleteProject: (projectId) => client.delete(`/projects/${projectId}`),
  applyToProject: (projectId, data) => client.post(`/projects/${projectId}/apply`, data),
  acceptApplicant: (projectId, userId) =>
    client.post(`/projects/${projectId}/accept/${userId}`),
  rejectApplicant: (projectId, userId) =>
    client.post(`/projects/${projectId}/reject/${userId}`),
  getMembers: (projectId) => client.get(`/projects/${projectId}/members`),
}

export default projectsService
