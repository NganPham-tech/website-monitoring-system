import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

// Mock data for development
const MOCK_MONITORS = [
  { id: '1', name: 'Google Search', url: 'https://google.com', frequency: 5, lastCheck: new Date(Date.now() - 1000 * 60 * 2).toISOString(), uptime: 99.9, responseTime: 120, status: 'Online', protocol: 'HTTP' },
  { id: '2', name: 'Facebook', url: 'https://facebook.com', frequency: 10, lastCheck: new Date(Date.now() - 1000 * 60 * 8).toISOString(), uptime: 98.5, responseTime: 250, status: 'Online', protocol: 'HTTP' },
  { id: '3', name: 'Internal API', url: 'https://api.internal.com', frequency: 1, lastCheck: new Date(Date.now() - 1000 * 30).toISOString(), uptime: 45.2, responseTime: 1500, status: 'Offline', protocol: 'HTTP' },
  { id: '4', name: 'Database Server', url: '192.168.1.50', frequency: 5, lastCheck: new Date(Date.now() - 1000 * 60 * 4).toISOString(), uptime: 100, responseTime: 5, status: 'Online', protocol: 'Ping' },
  { id: '5', name: 'Legacy App', url: 'https://legacy.com', frequency: 15, lastCheck: new Date(Date.now() - 1000 * 60 * 12).toISOString(), uptime: 92.1, responseTime: 450, status: 'Warning', protocol: 'HTTP' },
  { id: '6', name: 'Redis Cache', url: 'redis://cache:6379', frequency: 2, lastCheck: new Date(Date.now() - 1000 * 60 * 1).toISOString(), uptime: 99.9, responseTime: 2, status: 'Online', protocol: 'Port' },
];

/**
 * Fetch monitors based on search query, status, and protocol.
 */
const fetchMonitors = async ({ search, status, protocol, page, limit }) => {
  try {
    const response = await api.get('/monitors', {
      params: { search, status, protocol, page, limit },
    });
    return response.data;
  } catch (error) {
    console.warn('API call failed, using mock data for demo:', error.message);
    
    // Simulate filtering for mock data
    let filtered = [...MOCK_MONITORS];
    if (search) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(search.toLowerCase()) || 
        m.url.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status && status !== 'All') {
      filtered = filtered.filter(m => m.status === status);
    }
    if (protocol && protocol !== 'All') {
      filtered = filtered.filter(m => m.protocol === protocol);
    }

    const total = filtered.length;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      monitors: paginated,
      total,
      totalPages: Math.ceil(total / limit),
      page
    };
  }
};

export const useMonitors = (filters) => {
  return useQuery({
    queryKey: ['monitors', filters],
    queryFn: () => fetchMonitors(filters),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
