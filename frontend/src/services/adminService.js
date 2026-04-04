import api from './api';

const adminService = {
  // ─── Stats & Metrics ────────────────────────────────────────────────────────
  getQuickStats: async () => {
    // Expected response shape: { data: { totalMonitors, totalUsers, alerts30d, dbSize } }
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  getServerHealth: async () => {
    // Expected response shape: { data: { cpu: 42, memory: 68, disk: 35, uptime: 99.98, history: [...] } }
    const response = await api.get('/admin/health');
    return response.data.data;
  },

  // ─── User Management ────────────────────────────────────────────────────────
  getUsers: async (page = 1, limit = 10, search = '') => {
    const response = await api.get('/admin/users', {
      params: { page, limit, search },
    });
    return response.data.data; // { users: [], total, totalPages }
  },

  updateUserRole: async (userId, data) => {
    // data: { role, plan, status }
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data.data;
  },

  // ─── System Configuration ───────────────────────────────────────────────────
  getSystemSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data.data;
  },

  updateSystemSettings: async (settings) => {
    const response = await api.post('/admin/settings', settings);
    return response.data.data;
  },

  // ─── System Logs ────────────────────────────────────────────────────────────
  getSystemLogs: async (limit = 100) => {
    const response = await api.get('/admin/logs', { params: { limit } });
    return response.data.data; // Array of log strings or objects
  },

  clearSystemLogs: async () => {
    const response = await api.delete('/admin/logs');
    return response.data;
  },
};

export default adminService;
