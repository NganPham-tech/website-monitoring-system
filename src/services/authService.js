import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Trỏ về Node.js Backend

// Cấu hình axios để luôn gửi tự động Cookie chứa token lên server
axios.defaults.withCredentials = true;

const authService = {
  login: async (email, password, rememberMe) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { 
        email, 
        password, 
        rememberMe 
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Chuyển hướng SSO
  redirectToGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  redirectToGithub: () => {
    window.location.href = `${API_URL}/auth/github`;
  }
};

export default authService;
