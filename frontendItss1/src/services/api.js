// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://translate-production-6a99.up.railway.app';
// const API_BASE_URL = 'http://localhost:8080';

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
      const user = localStorage.getItem('user');

      // Chỉ redirect nếu cả token và user đều tồn tại (nghĩa là đã login trước đó)
      // Tránh redirect ngay sau khi login thành công
      if (token && user) {
        // Kiểm tra xem có phải là request từ trang translate không
        // Nếu là request từ translate và bị 401, có thể là token chưa được set đúng
        const currentPath = window.location.pathname;
        // Chỉ redirect nếu không phải đang ở trang login/signup
        if (currentPath !== '/login' && currentPath !== '/signup') {
          // Token hết hạn -> xóa và redirect
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
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
    window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  },

  facebookLogin: () => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/facebook`;
  },

  checkEmail: (email) =>
    api.post('/api/auth/check-email', { email }),

  resetPassword: (email, newPassword, confirmPassword) =>
    api.post('/api/auth/reset-password', { email, newPassword, confirmPassword }),

  changePassword: (currentPassword, newPassword, confirmPassword) =>
    api.post('/api/auth/change-password', { currentPassword, newPassword, confirmPassword }),
};

// Translation API
export const translationAPI = {
  translate: (text, context) =>
    api.post('/api/translate', { text, context }),


  getHistory: () =>
    api.get('/api/translate/history/all'),

};

export default api;
