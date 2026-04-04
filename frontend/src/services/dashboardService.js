import api from './api';

export const getDashboardMetrics = async () => {
  const response = await api.get('/dashboard/metrics');
  return response.data;
};

export const getResponseTimeChart = async (range) => {
  const response = await api.get(`/dashboard/chart?range=${range}`);
  return response.data;
};

export const getRecentMonitors = async () => {
  const response = await api.get('/dashboard/recent-monitors');
  return response.data;
};
