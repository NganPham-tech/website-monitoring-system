import api from './api';

// ─── Mock data fallback ───────────────────────────────────────────────────────

const mockMacroStats = {
    activeUsers: {
        value: '5,234',
        change: '+12.5%',
        direction: 'up',
        sub: '142 đăng ký mới hôm nay',
    },
    mrr: {
        value: '$12,450',
        change: '+8.2%',
        direction: 'up',
        sub: 'Dự kiến tháng: $14,200',
    },
    monitors: {
        value: '45,120',
        change: '+5.1%',
        direction: 'up',
        sub: '~8,500 requests / giây',
    },
    systemLoad: {
        value: '42%',
        change: 'Ổn định',
        direction: 'stable',
        sub: 'RAM: 18GB / 32GB',
    },
};

const mockNodes = [
    {
        id: '1',
        region: '🇺🇸 US East (N. Virginia)',
        status: 'online',
        latency: 45,
        cpu: 32,
        queue: 0,
    },
    {
        id: '2',
        region: '🇸🇬 Asia (Singapore)',
        status: 'online',
        latency: 72,
        cpu: 28,
        queue: 2,
    },
    {
        id: '3',
        region: '🇩🇪 EU (Frankfurt)',
        status: 'online',
        latency: 38,
        cpu: 45,
        queue: 0,
    },
];

// ─── API functions ────────────────────────────────────────────────────────────

export const getMacroStats = async () => {
    try {
        const res = await api.get('/infrastructure/macro-stats');
        return res.data.data;
    } catch {
        return mockMacroStats;
    }
};

export const getNodes = async () => {
    try {
        const res = await api.get('/infrastructure/nodes');
        return res.data.data;
    } catch {
        return mockNodes;
    }
};

export const deployNode = async (region) => {
    const res = await api.post('/infrastructure/nodes/deploy', { region });
    return res.data;
};
