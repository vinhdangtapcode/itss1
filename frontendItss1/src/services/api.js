// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để tự động thêm token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để handle token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Chỉ redirect nếu ĐÃ có token (token expired)
      // KHÔNG redirect nếu đang login/signup (chưa có token)
      const token = localStorage.getItem('token');
      if (token) {
        // Token hết hạn -> xóa và redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      // Nếu chưa có token (đang login) -> không redirect, để component xử lý
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (email, password) =>
    api.post('/api/auth/signup', { email, password }),

  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),

  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorize/google`;
  },

  facebookLogin: () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorize/facebook`;
  },
};

// Translation API
export const translationAPI = {
  translate: (text) =>
    api.post('/api/translate', { text }),
};

export default api;
