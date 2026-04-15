import axios from 'axios';

const API = `${import.meta.env.VITE_BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Add token from localStorage to all requests
api.interceptors.request.use(config => {
  const user = localStorage.getItem('FixNow_user');
  if (user) {
    try {
      const { token } = JSON.parse(user);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {}
  }
  return config;
});

export default api;
