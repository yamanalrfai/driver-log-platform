import axios from 'axios';

const api = axios.create({
    baseURL: 'https://driver-log-platform.onrender.com/',

});

export default api;