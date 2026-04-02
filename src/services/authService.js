import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Giả định domain backend

const authService = {
  login: async (email, password, rememberMe) => {
    try {
      // Giả lập gọi API login
      // Trong thực tế sẽ là: const response = await axios.post(`${API_URL}/auth/login`, { email, password, rememberMe });
      
      // Mock response
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (email === 'admin@example.com' && password === '123456') {
            resolve({
              data: {
                token: 'mock-jwt-token',
                user: { id: 1, email: 'admin@example.com', name: 'Admin User' }
              }
            });
          } else {
            reject({ response: { data: { message: 'Email hoặc mật khẩu không chính xác' } } });
          }
        }, 1500);
      });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => {
    return localStorage.getItem('token');
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
