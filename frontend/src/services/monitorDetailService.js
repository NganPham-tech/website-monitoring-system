import api from './api';

const monitorDetailService = {
  getMonitorDetail: async (id) => {
    try {
      const response = await api.get(`/monitors/${id}`);
      return response.data.data;
    } catch (error) {
      console.warn("API lỗi hoặc ID không tồn tại (Test Mode), trả về dữ liệu mẫu:", error.message);
      return {
        id: id,
        name: 'Website Chính (Mock Data)',
        url: 'https://websitemain.com',
        type: 'Http Monitor',
        createdAt: '25/1/2026',
        status: 'active',
        interval: 60,
        timeout: 30,
        retries: 3,
        method: 'GET',
        sslExpiry: '42 ngày nữa',
        description: 'Dữ liệu mẫu do API không kết nối được hoặc ID sai (ví dụ ID: 1).'
      };
    }
  },

  getMonitorKpis: async (id) => {
    // Giả lập API lấy KPIs
    // const response = await api.get(`/monitors/${id}/kpis`);
    // return response.data.data;
    
    // Mock data for demo
    return {
      uptime: { value: 99.98, trend: 0.05, isUp: true },
      responseTime: { value: 180, trend: 12, isUp: false }, // Response time tăng là xấu
      downtime: { value: 2, trend: 5, isUp: false }
    };
  },

  getMonitorChartData: async (id, range = '7d') => {
    // Giả lập API lấy dữ liệu biểu đồ
    // const response = await api.get(`/monitors/${id}/chart?range=${range}`);
    // return response.data.data;

    // Mock data
    const points = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    return Array.from({ length: points }, (_, i) => ({
      time: `${i + 1}`,
      value: Math.floor(Math.random() * (250 - 150 + 1)) + 150
    }));
  },

  getActivityLogs: async (id) => {
    // const response = await api.get(`/monitors/${id}/logs`);
    // return response.data.data;

    return [
      { id: 1, status: 200, message: 'OK', responseTime: 180, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
      { id: 2, status: 200, message: 'OK', responseTime: 185, timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
      { id: 3, status: 503, message: 'Service Unavailable', responseTime: 0, timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
    ];
  },

  toggleStatus: async (id) => {
    const response = await api.put(`/monitors/${id}/toggle-status`);
    return response.data;
  },

  deleteMonitor: async (id) => {
    const response = await api.delete(`/monitors/${id}`);
    return response.data;
  }
};

export default monitorDetailService;
