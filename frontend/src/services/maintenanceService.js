import apiClient from '../api/apiClient';

export const maintenanceService = {
    getMaintenances: async () => {
        try {
            const response = await apiClient.get('/maintenances');
            return response.data;
        } catch (error) {
            console.warn('API /maintenances unavailable, falling back to mock data', error);
            return mockData;
        }
    },

    createMaintenance: async (payload) => {
        try {
            const response = await apiClient.post('/maintenances', payload);
            return response.data;
        } catch (error) {
            console.warn('API POST /maintenances unavailable, mocking success');
            const newMaint = {
                id: Date.now().toString(),
                ...payload,
                status: getStatus(payload.startTime, payload.endTime),
                monitorNames: payload.monitors.join(', ') // mock
            };
            mockData.data.push(newMaint);
            return { success: true, data: newMaint };
        }
    }
};

const getStatus = (start, end) => {
    const now = new Date();
    const sDate = new Date(start);
    const eDate = new Date(end);
    if (now < sDate) return 'scheduled';
    if (now >= sDate && now <= eDate) return 'ongoing';
    return 'completed';
};

const mockData = {
    success: true,
    data: [
        {
            id: '1',
            title: 'API Server',
            monitorNames: 'API Server',
            notes: 'API Server Maintenance',
            startTime: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(),
            endTime: new Date(new Date().setHours(new Date().getHours() + 2)).toISOString(),
            status: 'ongoing'
        },
        {
            id: '2',
            title: 'Database Cluster',
            monitorNames: 'Database Cluster',
            notes: 'Database Upgrade',
            startTime: new Date(new Date().setHours(new Date().getHours() + 5)).toISOString(),
            endTime: new Date(new Date().setHours(new Date().getHours() + 8)).toISOString(),
            status: 'scheduled'
        },
        {
            id: '3',
            title: 'Payment Gateway',
            monitorNames: 'Payment Gateway',
            notes: 'Security patch applied',
            startTime: new Date(new Date().setHours(new Date().getHours() - 10)).toISOString(),
            endTime: new Date(new Date().setHours(new Date().getHours() - 5)).toISOString(),
            status: 'completed'
        }
    ]
};
