import api from './api';

const profileService = {
  // ─── Personal Info ─────────────────────────────────────────────────────────
  getProfile: () => api.get('/profile'),

  updateProfile: (data) => api.put('/profile', data),

  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.put('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // ─── Security ──────────────────────────────────────────────────────────────
  changePassword: (data) => api.put('/profile/password', data),

  enable2FA: () => api.post('/profile/2fa/enable'),

  verify2FA: (code) => api.post('/profile/2fa/verify', { code }),

  disable2FA: () => api.post('/profile/2fa/disable'),

  // ─── Notification Settings ─────────────────────────────────────────────────
  getNotificationSettings: () => api.get('/profile/notifications'),

  updateNotificationSettings: (data) => api.put('/profile/notifications', data),

  // ─── API Keys ──────────────────────────────────────────────────────────────
  getApiKeys: () => api.get('/api-keys'),

  createApiKey: (name) => api.post('/api-keys', { name }),

  deleteApiKey: (keyId) => api.delete(`/api-keys/${keyId}`),

  // ─── Billing & Plan ────────────────────────────────────────────────────────
  getBillingInfo: () => api.get('/profile/billing'),

  // ─── Account Deletion ──────────────────────────────────────────────────────
  deleteAccount: (confirmation) => api.delete('/profile', { data: { confirmation } }),
};

export default profileService;
