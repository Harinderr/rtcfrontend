
// utils/axios.js
import axios from 'axios';
// https://witty-graceful-winterberry.glitch.me
const instance = axios.create({
  baseURL: 'http://localhost:5000', // Replace this with your API base URL
  withCredentials : true,
  headers: {
    'Content-Type': 'application/json',
    // You can add more default headers here if needed
  },
});

export default instance;
