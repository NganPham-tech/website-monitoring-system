import apiClient from '../api/apiClient';

let mockIntegrations = [
    { id: '1', type: 'email', name: 'Email', status: 'connected', details: { addresses: 'admin@example.com' }, desc: 'Nhận cảnh báo trực tiếp qua Email.\nHỗ trợ nhiều địa chỉ email và tùy chỉnh nội dung' },
    { id: '2', type: 'telegram', name: 'Telegram', status: 'connected', details: { chatId: '-10023456789' }, desc: 'Nhận thông báo tức thì qua Telegram Bot.\nHỗ trợ gửi đến nhóm hoặc kênh' },
    { id: '3', type: 'discord', name: 'Discord', status: 'disconnected', details: null, desc: 'Gửi cảnh báo vào Discord channel qua Webhook.\nHỗ trợ rich embed với màu sắc và biểu tượng.' },
    { id: '4', type: 'slack', name: 'Slack', status: 'disconnected', details: null, desc: 'Tích hợp với Slack workspace.\nGửi thông báo vào channel hoặc DM cụ thể.' },
    { id: '5', type: 'webhook', name: 'Webhook', status: 'disconnected', details: null, desc: 'Gửi cảnh báo đến webhook URL tùy chỉnh.\nHỗ trợ JSON payload với đầy đủ thông tin sự cố.' },
    { id: '6', type: 'sms', name: 'SMS', status: 'disconnected', details: null, desc: 'Nhận cảnh báo qua tin nhắn SMS cho các sự cố nghiêm trọng.\nTính phí theo tin nhắn' },
];

export const integrationService = {
    getIntegrations: async () => {
        try {
            const response = await apiClient.get('/integrations');
            return response.data;
        } catch (error) {
            console.warn('API fetch failed, returning mock integrations', error);
            return new Promise((resolve) => setTimeout(() => {
                resolve({ success: true, data: mockIntegrations });
            }, 500));
        }
    },

    connectIntegration: async (type, configData) => {
        try {
            const response = await apiClient.post('/integrations', { type, configData });
            return response.data;
        } catch (error) {
            console.warn('API POST failed, mocking success', error);
            return new Promise((resolve) => setTimeout(() => {
                const idx = mockIntegrations.findIndex(i => i.type === type);
                if (idx !== -1) {
                    mockIntegrations[idx] = { ...mockIntegrations[idx], status: 'connected', details: configData };
                }
                resolve({ success: true });
            }, 800));
        }
    },

    disconnectIntegration: async (id) => {
        try {
            const response = await apiClient.delete(`/integrations/${id}`);
            return response.data;
        } catch (error) {
            console.warn('API DELETE failed, mocking success', error);
            return new Promise((resolve) => setTimeout(() => {
                const integration = mockIntegrations.find(i => i.id === id);
                if (integration) {
                    integration.status = 'disconnected';
                    integration.details = null;
                }
                resolve({ success: true });
            }, 800));
        }
    }
};
