import api from './api';

const settingsService = {
  // Integrations (API / Webhooks)
  getIntegrations: async () => {
    const response = await api.get('/admin/settings/integrations');
    return response.data;
  },
  
  updateIntegrations: async (data) => {
    const response = await api.put('/admin/settings/integrations', data);
    return response.data;
  },

  testSmtp: async (smtpData) => {
    const response = await api.post('/admin/settings/test-smtp', smtpData);
    return response.data;
  },

  // Announcements
  getAnnouncements: async () => {
    const response = await api.get('/admin/announcements');
    return response.data;
  },

  createAnnouncement: async (data) => {
    const response = await api.post('/admin/announcements', data);
    return response.data;
  }
};

export default settingsService;
