import * as axios from 'axios';

const instance = axios.create({
    withCredentials: true,
    baseURL: "https://rs-react-schedule.firebaseapp.com/api/team/49/",
    headers: {

    },
})


