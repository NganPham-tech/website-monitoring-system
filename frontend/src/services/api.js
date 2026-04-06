import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token from localStorage if it exists
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle errors (e.g., logout on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if we're not already on the login page
    // and if the error is a 401 Unauthorized
    if (error.response && error.response.status === 401 && !window.location.pathname.includes('/login')) {
      // Clear local storage and redirect to login if unauthorized
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
