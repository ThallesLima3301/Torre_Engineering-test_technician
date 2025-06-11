// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,   
  timeout: 10_000,                              
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  res => res,
  err => {
    console.error('[API ERROR]', err.response?.status, err.message);
    return Promise.reject(err);
  }
);

export default api;
