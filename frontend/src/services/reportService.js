import api from './api';

// ─── Mock data fallback (used when API is not ready) ─────────────────────────

const buildMockUptime = (range) => {
    const count = range === '24h' ? 12 : range === '7D' ? 7 : range === '30D' ? 14 : 18;
    const labels =
        range === '24h'
            ? Array.from({ length: count }, (_, i) => `${(i * 2).toString().padStart(2, '0')}:00`)
            : Array.from({ length: count }, (_, i) => `${i + 1}/${range === '90D' ? '01' : '04'}`);
    return labels.map((date, i) => ({
        date,
        uptime: parseFloat((97.5 + Math.sin(i) * 1.5 + Math.random() * 0.5).toFixed(2)),
    }));
};

const buildMockResponseTime = (range) => {
    const count = range === '24h' ? 12 : range === '7D' ? 7 : range === '30D' ? 14 : 18;
    return Array.from({ length: count }, (_, i) => ({
        date: `${i + 1}`,
        avg: Math.round(180 + Math.sin(i * 0.8) * 60 + Math.random() * 20),
        max: Math.round(350 + Math.cos(i * 0.5) * 80 + Math.random() * 30),
    }));
};

const mockSummary = {
    uptime: { value: 99.8, delta: 0.3, higherIsBetter: true },
    responseTime: { value: 245, delta: 15, higherIsBetter: false },
    incidents: { value: 8, delta: 2, higherIsBetter: false },
    downtime: { value: '2h 15m', delta: 5, higherIsBetter: false },
};

const mockCharts = (range) => ({
    uptimeTrend: buildMockUptime(range),
    responseTimeTrend: buildMockResponseTime(range),
    incidentDistribution: [
        { name: 'Timeout', value: 4 },
        { name: 'SSL Error', value: 2 },
        { name: '500 Error', value: 2 },
    ],
});

const mockMonitorsDetail = [
    {
        id: 1,
        name: 'web chính',
        uptime: 99.8,
        status: 'up',
        responseTime: 180,
        downtime: '2m',
        incidents: 1,
        history: [180, 195, 170, 210, 165, 180, 190, 175],
    },
    {
        id: 2,
        name: 'API Gateway',
        uptime: 85.2,
        status: 'down',
        responseTime: 340,
        downtime: '1h 12m',
        incidents: 3,
        history: [200, 280, 340, 420, 380, 310, 340, 290],
    },
    {
        id: 3,
        name: 'Admin Panel',
        uptime: 90.0,
        status: 'down',
        responseTime: 250,
        downtime: '45m',
        incidents: 2,
        history: [220, 240, 260, 300, 280, 250, 230, 250],
    },
    {
        id: 4,
        name: 'CDN / Assets',
        uptime: 78.5,
        status: 'down',
        responseTime: 120,
        downtime: '3h 20m',
        incidents: 2,
        history: [130, 120, 110, 140, 160, 120, 115, 120],
    },
];

// ─── API Calls ────────────────────────────────────────────────────────────────

export const getSummary = async (range) => {
    try {
        const { data } = await api.get('/reports/summary', { params: { range } });
        return data;
    } catch {
        return mockSummary;
    }
};

export const getCharts = async (range) => {
    try {
        const { data } = await api.get('/reports/charts', { params: { range } });
        return data;
    } catch {
        return mockCharts(range);
    }
};

export const getMonitorsDetail = async (range) => {
    try {
        const { data } = await api.get('/reports/monitors-detail', { params: { range } });
        return data;
    } catch {
        return mockMonitorsDetail;
    }
};
