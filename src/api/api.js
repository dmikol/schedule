import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://rs-react-schedule.firebaseapp.com/api/team/49/',
  headers: {},
})

export const API = {
  getEvents() {
    return instance.get(`events`).then((response) => response.data)
  },

  addNewEvent({
    id,
    name,
    description,
    descriptionUrl,
    type,
    timeZone,
    dateTime,
    place,
    comment,
  }) {
    return instance
      .post(`event`, {
        id,
        name,
        description,
        descriptionUrl,
        type,
        timeZone,
        dateTime,
        place,
        comment,
      })
      .then((response) => response.data)
  },

  findEventById(eventId) {
    return instance.get(`event/${eventId}`).then((response) => response.data)
  },

  updateEvent(eventId, changes) {
    return instance
      .post(`event/${eventId}`, {
        changes,
      })
      .then((response) => response.data)
  },

  deleteEvent(eventId) {
    return instance.delete(`event/${eventId}`).then((response) => response.data)
  },

  getOrganizers() {
    return instance.get(`organizers`).then((response) => response.data)
  },

  addNewOrganizer({ id, name }) {
    return instance
      .post(`organizer`, {
        id,
        name,
      })
      .then((response) => response.data)
  },

  findOrganizerById(organizerId) {
    return instance
      .get(`organizer/${organizerId}`)
      .then((response) => response.data)
  },

  updateOrganizer(organizerId, changes) {
    return instance
      .put(`organizer/${organizerId}`, {
        changes,
      })
      .then((response) => response.data)
  },

  deleteOrganizer(organizerId) {
    return instance
      .delete(`organizer/${organizerId}`)
      .then((response) => response.data)
  },
}
