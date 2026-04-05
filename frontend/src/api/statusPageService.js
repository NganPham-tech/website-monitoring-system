import publicClient from './publicClient';

const statusPageService = {
  getSummary: async () => {
    const response = await publicClient.get('/status-page/summary');
    return response.data;
  },
  
  subscribe: async (email) => {
    const response = await publicClient.post('/status-page/subscribe', { email });
    return response.data;
  }
};

export default statusPageService;
