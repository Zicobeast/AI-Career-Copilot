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

// Job endpoints
export const analyzeJob = async ({ job_title, company, description }) => {
  const response = await api.post('/api/job/analyze', { job_title, company, description });
  return response.data;
};

export const getDemoJob = async () => {
  const response = await api.post('/api/job/demo');
  return response.data;
};

// Skill Gap Analysis endpoints
export const calculateSkillGap = async ({ resume_skills, job_skills, job_title }) => {
  const response = await api.post('/api/analysis/skill-gap', {
    resume_skills,
    job_skills,
    job_title,
  });
  return response.data;
};

export const getDemoSkillGap = async () => {
  const response = await api.get('/api/analysis/demo');
  return response.data;
};

// Roadmap endpoints
export const generateRoadmap = async ({ missing_skills, job_title, target_company }) => {
  const response = await api.post('/api/roadmap/generate', {
    missing_skills,
    job_title,
    target_company,
  });
  return response.data;
};

export const updateRoadmapItemProgress = async (item_id, completed) => {
  const response = await api.patch(`/api/roadmap/${item_id}/progress`, { completed });
  return response.data;
};

export const getDemoRoadmap = async () => {
  const response = await api.get('/api/roadmap/demo');
  return response.data;
};

// Chatbot Assistant endpoint
export const sendChatMessage = async ({ message, history, context }) => {
  const response = await api.post('/api/chat', {
    message,
    history: history || [],
    context: context || null,
  });
  return response.data;
};

export const getDemoChat = async () => {
  const response = await api.get('/api/chat/demo');
  return response.data;
};

export default api;







