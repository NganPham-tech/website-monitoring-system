import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

axios.defaults.withCredentials = true;

const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password, rememberMe) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password, rememberMe });
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

  redirectToGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  redirectToGithub: () => {
    window.location.href = `${API_URL}/auth/github`;
  }
};

export default authService;
