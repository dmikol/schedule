import * as axios from 'axios';

const instance = axios.create({
    withCredentials: true,
    baseURL: "https://rs-react-schedule.firebaseapp.com/api/team/49/",
    headers: {

    },
})


export const API = {

    getEvents() {
        return instance.get( `events` ).then( response => response.data );
    },

    addNewEvent(id, name, description, descriptionUrl, type, timeZone, dateTime, place, comment) {
        return instance.post( `event`, {id, name, description, descriptionUrl, type, timeZone, dateTime, place, comment}).then( response => response.data );
    },

    findEventById(eventId) {
        return instance.get( `event/${eventId}` ).then( response => response.data );
    },

    updateEvent(eventId) {
        return instance.post( `event/${eventId}`, {} ).then( response => response.data );
    },

    deleteEvent(eventId) {
        return instance.delete( `event/${eventId}` ).then( response => response.data );
    },
}