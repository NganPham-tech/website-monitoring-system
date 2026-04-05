import apiClient from '../api/apiClient';

export const alertService = {
  getAlertHistory: async (params) => {
    try {
      const response = await apiClient.get('/alerts', { params });
      return response.data;
    } catch (error) {
      console.warn("API failed, falling back to mock data", error);
      return mockData(params);
    }
  }
};

// Mock data generator matching the design
const mockData = (params) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            id: '1',
            monitorName: 'Blog Website',
            type: 'Website Down',
            severity: 'critical',
            message: 'Status: 503 Service Unavailable | Response Time: Timeout',
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
            channels: ['Email', 'Telegram', 'Discord'],
          },
          {
            id: '2',
            monitorName: 'CDN Server',
            type: 'Response Time Chậm',
            severity: 'warning',
            message: 'Response Time: 890ms (vượt ngưỡng 500ms)',
            timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
            channels: ['Email'],
          },
          {
            id: '3',
            monitorName: 'Website Chính',
            type: 'Website Khôi Phục',
            severity: 'success',
            message: 'Website đã hoạt động trở lại sau 15 phút downtime',
            timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
            channels: ['Email'],
          },
          {
            id: '4',
            monitorName: 'Website Phụ',
            type: 'Máy chủ quá tải',
            severity: 'critical',
            message: 'CPU usage > 90% in 5 minutes',
            timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
            channels: ['Email', 'Telegram', 'SMS'],
          },
          {
            id: '5',
            monitorName: 'Website Chính',
            type: 'SSL Certificate Sắp Hết Hạn',
            severity: 'info',
            message: 'SSL certificate sẽ hết hạn trong 7 ngày',
            timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
            channels: ['Email', 'Telegram'],
          }
        ],
        meta: {
          total: 47,
          page: params.page ? parseInt(params.page) : 1,
          totalPages: 5,
        },
        stats: {
          total: 47,
          info: 8,
          critical: 24,
          warning: 15
        }
      });
    }, 600);
  });
};
