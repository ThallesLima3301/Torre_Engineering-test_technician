import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  // Render's free tier spins the backend down when idle and can take ~50s to wake.
  // Keep the timeout generous so the first request after inactivity doesn't fail.
  timeout: 60_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API ERROR]', err.response?.status, err.message);
    return Promise.reject(err);
  },
);

export default api;
