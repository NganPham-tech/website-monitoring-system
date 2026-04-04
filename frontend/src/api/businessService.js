import apiClient from './apiClient';

// Mock Data fallbacks
const MOCK_USERS = [
  { id: '1', name: 'Nguyen Nhat Quang', email: 'quang@example.com', keycloakId: '8f7a-4b92-9c1d', plan: 'Enterprise', maxMonitors: 500, currentMonitors: 45, status: 'Active', joinDate: '28/01/2026', avatar: 'Q', color: '#553c9a', bg: '#e9d8fd' },
  { id: '2', name: 'Alice Smith', email: 'alice@startup.io', keycloakId: '1b2a-3c4d-5e6f', plan: 'PRO', maxMonitors: 50, currentMonitors: 12, status: 'Active', joinDate: '15/02/2026', avatar: 'A', color: '#4a5568', bg: '#e2e8f0' },
  { id: '3', name: 'Bob Spammer', email: 'bob@spam.com', keycloakId: 'a1b2-c3d4-e5f6', plan: 'Free', maxMonitors: 5, currentMonitors: 5, status: 'Banned', joinDate: '22/03/2026', avatar: 'B', color: '#742a2a', bg: '#fed7d7' },
];

const MOCK_TRANSACTIONS = [
  { id: 'INV-2026-8891', stripeId: 'pi_3MtwB...', email: 'quang@example.com', amount: 49.00, content: 'Gia hạn Enterprise (Tháng 3)', time: 'Hôm nay, 14:30', status: 'success' },
  { id: 'INV-2026-8890', stripeId: 'pi_2BvcC...', email: 'alice@startup.io', amount: 12.00, content: 'Nâng cấp lên PRO', time: 'Hôm qua, 09:15', status: 'success' },
  { id: 'INV-2026-8889', stripeId: 'pi_1AvbC...', email: 'charlie@dev.net', amount: 12.00, content: 'Gia hạn PRO', time: '27/03/2026', status: 'failed', error: 'Thẻ bị từ chối' },
];

const MOCK_PLANS = [
  { id: 'free', name: 'Gói Free', price: 0, period: '/tháng', popular: false, features: [{ text: 'Max Monitors: 5', included: true }, { text: 'Chu kỳ check: 5 phút', included: true }, { text: 'Alert Channels: Email', included: true }, { text: 'Status Page: Không', included: false }, { text: 'Team Members: 1', included: false }] },
  { id: 'pro', name: 'Gói PRO', price: 12, period: '/tháng', popular: true, features: [{ text: 'Max Monitors: 50', included: true }, { text: 'Chu kỳ check: 1 phút', included: true }, { text: 'Alert Channels: Email, Telegram, Discord', included: true }, { text: 'Status Page: 1 trang', included: true }, { text: 'Team Members: 5', included: true }] },
  { id: 'enterprise', name: 'Gói Enterprise', price: 49, period: '/tháng', popular: false, features: [{ text: 'Max Monitors: 500', included: true }, { text: 'Chu kỳ check: 30 giây', included: true }, { text: 'Alert Channels: Tùy chọn + Webhook + SMS', included: true }, { text: 'Status Page: Không giới hạn', included: true }, { text: 'Team Members: Không giới hạn', included: true }] },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const businessService = {
  // Users Tab
  fetchUsers: async (filters) => {
    try {
      const { data } = await apiClient.get('/admin/business/users', { params: filters });
      return data;
    } catch (e) {
      await sleep(800); // Simulate network delay
      return MOCK_USERS;
    }
  },
  
  toggleUserStatus: async (userId, action) => {
    try {
      const { data } = await apiClient.post(`/admin/business/users/${userId}/status`, { action });
      return data;
    } catch (e) {
      await sleep(500);
      return { success: true, message: `Đã ${action === 'ban' ? 'khóa' : 'mở khóa'} thành công.` };
    }
  },

  impersonateUser: async (userId) => {
    try {
      const { data } = await apiClient.post(`/admin/business/users/${userId}/impersonate`);
      return data;
    } catch (e) {
      await sleep(500);
      return { access_token: "MOCK_IMPERSONATE_TOKEN", redirectUrl: "/dashboard" };
    }
  },

  // Transactions Tab
  fetchTransactions: async (filters) => {
    try {
      const { data } = await apiClient.get('/admin/business/transactions', { params: filters });
      return data;
    } catch (e) {
      await sleep(800);
      return MOCK_TRANSACTIONS;
    }
  },

  refundTransaction: async (transactionId) => {
    try {
      const { data } = await apiClient.post(`/admin/business/transactions/${transactionId}/refund`);
      return data;
    } catch (e) {
      await sleep(1000);
      return { success: true };
    }
  },

  // Plans Tab
  fetchPlans: async () => {
    try {
      const { data } = await apiClient.get('/admin/business/plans');
      return data;
    } catch (e) {
      await sleep(600);
      return MOCK_PLANS;
    }
  }
};
