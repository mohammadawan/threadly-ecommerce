import axios from 'axios';

// In dev: Vite proxy forwards /api → localhost:5000
// In prod: VITE_API_URL = https://your-backend.railway.app/api
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('userInfo') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
