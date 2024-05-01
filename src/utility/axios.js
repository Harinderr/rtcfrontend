
// utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://rtc-backend-orpin.vercel.app/', // Replace this with your API base URL
  withCredentials : true,
  headers: {
    'Content-Type': 'application/json',
    // You can add more default headers here if needed
  },
});

export default instance;
