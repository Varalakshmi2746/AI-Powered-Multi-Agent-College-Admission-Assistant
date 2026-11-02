import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
};

export const collegeAPI = {
  getAll: (params) => api.get('/colleges', { params }),
  getById: (id) => api.get(`/colleges/${id}`),
  create: (data) => api.post('/colleges', data),
  update: (id, data) => api.put(`/colleges/${id}`, data),
  delete: (id) => api.delete(`/colleges/${id}`),
};

export const eligibilityAPI = {
  check: (data) => api.post('/eligibility/check', data),
};

export const feeAPI = {
  analyze: (params) => api.get('/fees/analyze', { params }),
};

export const comparisonAPI = {
  compare: (collegeIds) => api.post('/compare', { collegeIds }),
};

export const applicationAPI = {
  getMyApplications: () => api.get('/applications'),
  applyOrShortlist: (data) => api.post('/applications', data),
  updateStatus: (id, data) => api.put(`/applications/${id}`, data),
  delete: (id) => api.delete(`/applications/${id}`),
};

export const aiAPI = {
  getRecommendations: (profileData) => api.post('/ai/recommend', profileData),
  chat: (data) => api.post('/ai/chat', data),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllStudents: () => api.get('/students/all'),
};

export default api;
