import client from './client'

const eventsService = {
  getEvents: (params) => client.get('/events', { params }),
  getEvent: (eventId) => client.get(`/events/${eventId}`),
  createEvent: (data) => client.post('/events', data),
  updateEvent: (eventId, data) => client.put(`/events/${eventId}`, data),
  deleteEvent: (eventId) => client.delete(`/events/${eventId}`),
  registerEvent: (eventId) => client.post(`/events/${eventId}/register`),
  unregisterEvent: (eventId) => client.delete(`/events/${eventId}/register`),
  saveEvent: (eventId) => client.post(`/events/${eventId}/save`),
  getAttendees: (eventId) => client.get(`/events/${eventId}/attendees`),
}

export default eventsService
