import axios from 'axios'

import { IOrganizer, ITask } from '../models'

const instance = axios.create({
  baseURL: 'https://rs-react-schedule.firebaseapp.com/api/team/49/',
  headers: {},
})

export const API = {
  getEvents(): Promise<ITask[]> {
    return instance.get(`events`).then((response) => response.data.data)
  },

  addNewEvent(event: any) {
    return instance.post(`event`, event).then((response) => response.data)
  },

  findEventById(eventId: string): Promise<ITask> {
    return instance.get(`event/${eventId}`).then((response) => response.data)
  },

  updateEvent(eventId: string, event: Partial<ITask>) {
    return instance
      .put(`event/${eventId}`, event)
      .then((response) => response.data)
  },

  deleteEvent(eventId: string) {
    return instance.delete(`event/${eventId}`).then((response) => response.data)
  },

  getOrganizers(): Promise<IOrganizer[]> {
    return instance.get(`organizers`).then((response) => response.data.data)
  },

  addNewOrganizer(organizer: IOrganizer) {
    return instance
      .post(`organizer`, organizer)
      .then((response) => response.data)
  },

  findOrganizerById(organizerId: string): Promise<IOrganizer> {
    return instance
      .get(`organizer/${organizerId}`)
      .then((response) => response.data)
  },

  updateOrganizer(organizerId: string, organizer: Partial<IOrganizer>) {
    return instance
      .put(`organizer/${organizerId}`, organizer)
      .then((response) => response.data)
  },

  deleteOrganizer(organizerId: string) {
    return instance
      .delete(`organizer/${organizerId}`)
      .then((response) => response.data)
  },
}
