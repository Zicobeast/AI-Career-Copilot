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

// Resume endpoints
export const uploadResume = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/api/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return response.data;
};

export const getDemoResume = async () => {
  const response = await api.post('/api/resume/demo');
  return response.data;
};

// Skill extraction & catalog endpoints
export const extractSkills = async (text) => {
  const response = await api.post('/api/skills/extract', { text });
  return response.data;
};

export const getSkillCatalog = async () => {
  const response = await api.get('/api/skills/catalog');
  return response.data;
};

export default api;


