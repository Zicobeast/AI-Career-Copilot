import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach JWT token from localStorage if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('career_copilot_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Diagnostic and health checks
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const checkRoot = async () => {
  const response = await api.get('/');
  return response.data;
};

export default api;
