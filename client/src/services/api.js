import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response error interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response && error.response.data) {
      if (error.response.data.message) {
        message = error.response.data.message;
      } else if (Array.isArray(error.response.data.errors)) {
        message = error.response.data.errors.join(', ');
      }
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

// Quiz Endpoints
export const quizAPI = {
  getAll: () => api.get('/quizzes'),
  getById: (id, admin = false) => api.get(`/quizzes/${id}${admin ? '?admin=true' : ''}`),
  create: (data) => api.post('/quizzes', data),
  update: (id, data) => api.put(`/quizzes/${id}`, data),
  delete: (id) => api.delete(`/quizzes/${id}`),
};

// Attempt Endpoints
export const attemptAPI = {
  start: (quizId) => api.post('/attempts/start', { quizId }),
  get: (attemptId) => api.get(`/attempts/${attemptId}`),
  submit: (attemptId, answers) => api.post(`/attempts/${attemptId}/submit`, { answers }),
  getResult: (attemptId) => api.get(`/attempts/${attemptId}/result`),
  getReview: (attemptId) => api.get(`/attempts/${attemptId}/review`),
};

// Dashboard Endpoints
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
