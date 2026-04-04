import api from './api';

// ─── Mock data fallback ───────────────────────────────────────────────────────

const mockStats = {
    totalMembers: 8,
    managers: 2,
    members: 6,
    pendingInvites: 3,
};

const mockMembers = [
    {
        id: '1',
        name: 'Nguyễn Văn A',
        email: 'nguyen.van.a@example.com',
        role: 'owner',
        joinedAt: '2025-01-01T00:00:00.000Z',
        alertCount: 156,
    },
    {
        id: '2',
        name: 'Trần Thị Bình',
        email: 'tran.thi.binh@example.com',
        role: 'admin',
        joinedAt: '2025-02-15T00:00:00.000Z',
        alertCount: 98,
    },
    {
        id: '3',
        name: 'Lê Văn Cường',
        email: 'le.van.cuong@example.com',
        role: 'member',
        joinedAt: '2025-03-20T00:00:00.000Z',
        alertCount: 42,
    },
];

const mockPermissions = {
    owner: { monitor: true, reports: true, team: true, admin: true },
    admin: { monitor: true, reports: true, team: true, admin: true },
    member: { monitor: false, reports: false, team: false, admin: false },
};

// ─── API functions ────────────────────────────────────────────────────────────

export const getTeamStats = async () => {
    try {
        const res = await api.get('/team/stats');
        return res.data.data;
    } catch {
        return mockStats;
    }
};

export const getMembers = async () => {
    try {
        const res = await api.get('/team/members');
        return res.data.data;
    } catch {
        return mockMembers;
    }
};

export const getPermissions = async () => {
    try {
        const res = await api.get('/team/permissions');
        return res.data.data;
    } catch {
        return mockPermissions;
    }
};

export const inviteMember = async ({ email, role }) => {
    const res = await api.post('/team/invite', { email, role });
    return res.data;
};

export const updateMember = async ({ id, role }) => {
    const res = await api.patch(`/team/members/${id}`, { role });
    return res.data;
};

export const removeMember = async (id) => {
    const res = await api.delete(`/team/members/${id}`);
    return res.data;
};

export const updatePermissions = async (permissions) => {
    const res = await api.patch('/team/permissions', permissions);
    return res.data;
};
