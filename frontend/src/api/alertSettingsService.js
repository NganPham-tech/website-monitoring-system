import apiClient from './apiClient';

const alertSettingsService = {
  getSettings: async () => {
    // In actual app, this calls GET /api/alert-rules
    // For now, mock the API logic if not implemented in backend yet, or call the endpoint
    try {
      const response = await apiClient.get('/alert-rules');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 403 || error) {
        // Return default structure if endpoint is not built yet or user not logged in
         return {
            triggers: {
              websiteDown: true,
              slowResponse: { enabled: false, threshold: 500 },
              ssl: { enabled: true, daysBefore: 7 }
            },
            channels: {
              email: { enabled: true, target: 'admin@example.com' },
              discord: { enabled: false, target: '' },
              telegram: { enabled: false, target: '' },
              sms: { enabled: false, target: '' }
            },
            silentMode: {
              enabled: false,
              startTime: '22:00',
              endTime: '06:00',
              days: {
                mon: false, tue: false, wed: false, thu: false, fri: false, sat: true, sun: true
              }
            },
            customPayload: {
              title: '{name} đang gặp sự cố',
              body: 'Website {url} không thể truy cập.\nStatus: {status}\nThời gian: {time}\n\nVui lòng kiểm tra ngay!'
            }
          };
      }
      throw error;
    }
  },

  updateSettings: async (payload) => {
    // In actual app, this calls PUT /api/alert-rules
    // Mock the delay if it throws 404 to simulate saving during frontend building
    try {
        const response = await apiClient.put('/alert-rules', payload);
        return response.data;
    } catch(error) {
        if (error.response?.status === 404 || error.response?.status === 401 || error.response?.status === 403 || error) {
            return new Promise((resolve) => setTimeout(() => resolve(payload), 800));
        }
        throw error;
    }
  }
};

export default alertSettingsService;
