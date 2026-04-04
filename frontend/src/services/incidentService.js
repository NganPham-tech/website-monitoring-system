import api from './api';

const MOCK_INCIDENT = {
  id: 'INC-2026-001',
  title: 'Blog Website không thể truy cập',
  status: 'ongoing', // 'ongoing' | 'resolved'
  severity: 'critical', // 'critical' | 'warning' | 'info'
  priority: 'P1',
  startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 phút trước
  resolvedAt: null,
  downtimeMinutes: 15,
  rootCause: 'Database Connection Pool Exhausted',
  affectedService: 'Blog Website',
  incidentType: 'Service Unavailable',
  assignee: {
    id: 'user-1',
    name: 'Nguyễn Văn A',
    avatar: null,
    initials: 'NA',
  },
  impact: {
    affectedServices: 1,
    downtimeFormatted: '15m',
    alertsSent: 5,
    usersAffected: '~500',
  },
  notifications: [
    { channel: 'Email', recipients: 12, sentAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { channel: 'Telegram', recipients: 12, sentAt: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
    { channel: 'SMS', recipients: 5, sentAt: new Date(Date.now() - 14 * 60 * 1000).toISOString() },
  ],
  timeline: [
    {
      id: 't-4',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      title: 'Đang khắc phục',
      description: 'Restart database service và tối ưu lại query. Monitoring quá trình khôi phục.',
      type: 'fixing',
    },
    {
      id: 't-3',
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      title: 'Xác định nguyên nhân',
      description: 'Phát hiện vấn đề: Database connection pool bị cạn kiệt do query không tối ưu. Đang tiến hành khắc phục.',
      type: 'identified',
    },
    {
      id: 't-2',
      timestamp: new Date(Date.now() - 13 * 60 * 1000).toISOString(),
      title: 'Bắt đầu điều tra',
      description: 'Đội kỹ thuật bắt đầu điều tra nguyên nhân. Kiểm tra server logs và database connections.',
      type: 'investigating',
    },
    {
      id: 't-1',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      title: 'Phát hiện sự cố',
      description: 'Hệ thống phát hiện Blog Website không thể truy cập. Status Code: 503 Service Unavailable. Đã gửi cảnh báo qua Email, Telegram và Discord.',
      type: 'detected',
    },
  ],
};

const MOCK_TEAM_MEMBERS = [
  { id: 'user-1', name: 'Nguyễn Văn A', role: 'Backend Engineer', initials: 'NA', avatar: null },
  { id: 'user-2', name: 'Trần Thị B', role: 'Frontend Engineer', initials: 'TB', avatar: null },
  { id: 'user-3', name: 'Lê Văn C', role: 'DevOps Engineer', initials: 'LC', avatar: null },
  { id: 'user-4', name: 'Phạm Thị D', role: 'QA Engineer', initials: 'PD', avatar: null },
  { id: 'user-5', name: 'Hoàng Văn E', role: 'Tech Lead', initials: 'HE', avatar: null },
];

const incidentService = {
  getIncidentById: async (id) => {
    try {
      const response = await api.get(`/incidents/${id}`);
      return response.data.data;
    } catch (error) {
      console.warn('[incidentService] API unavailable, returning mock data:', error.message);
      return { ...MOCK_INCIDENT, id };
    }
  },

  resolveIncident: async (id) => {
    try {
      const response = await api.put(`/incidents/${id}/resolve`);
      return response.data;
    } catch (error) {
      console.warn('[incidentService] resolve API unavailable, simulating success:', error.message);
      // Simulate mock resolve
      return {
        success: true,
        data: {
          ...MOCK_INCIDENT,
          id,
          status: 'resolved',
          resolvedAt: new Date().toISOString(),
        },
      };
    }
  },

  addTimelineNote: async (id, note) => {
    try {
      const response = await api.post(`/incidents/${id}/timeline`, { note });
      return response.data;
    } catch (error) {
      console.warn('[incidentService] timeline API unavailable, simulating success:', error.message);
      return {
        success: true,
        data: {
          id: `t-${Date.now()}`,
          timestamp: new Date().toISOString(),
          title: 'Ghi chú cập nhật',
          description: note,
          type: 'note',
        },
      };
    }
  },

  assignIncident: async (id, assigneeId) => {
    try {
      const response = await api.put(`/incidents/${id}/assign`, { assigneeId });
      return response.data;
    } catch (error) {
      console.warn('[incidentService] assign API unavailable, simulating success:', error.message);
      const member = MOCK_TEAM_MEMBERS.find((m) => m.id === assigneeId);
      return {
        success: true,
        data: { assignee: member },
      };
    }
  },

  getTeamMembers: async () => {
    try {
      const response = await api.get('/team/members');
      return response.data.data;
    } catch (error) {
      console.warn('[incidentService] team API unavailable, returning mock members:', error.message);
      return MOCK_TEAM_MEMBERS;
    }
  },
};

export default incidentService;
