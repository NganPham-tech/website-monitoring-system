import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import settingsService from '../../../services/settingsService';

const AnnouncementHistory = () => {
  const { data: history, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: settingsService.getAnnouncements,
    initialData: [ // Mock for visual parity if API fails or empty
      { _id: '1', title: '🚀 Cập nhật tính năng: Webhook Tùy chỉnh', createdAt: '2026-03-20T10:00:00Z', target: 'pro_ent', type: 'info' },
      { _id: '2', title: '⚠️ Bảo trì Database Cluster định kỳ', createdAt: '2026-03-15T10:00:00Z', target: 'all', type: 'warning' },
      { _id: '3', title: '🎉 Chúc mừng năm mới 2026 - Tặng mã giảm giá', createdAt: '2026-01-01T10:00:00Z', target: 'all', type: 'info' },
      { _id: '4', title: '🔴 Khắc phục sự cố mạng khu vực EU-West', createdAt: '2025-12-12T10:00:00Z', target: 'all', type: 'critical' },
    ]
  });

  const getTargetLabel = (val) => {
    switch (val) {
      case 'pro_ent': return { label: 'Chỉ PRO & ENT', style: 'bg-blue-50 text-blue-700' };
      case 'free': return { label: 'Chỉ gói FREE', style: 'bg-gray-100 text-gray-700' };
      default: return { label: 'All Users', style: 'bg-slate-200 text-slate-700' };
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'critical': return '🔴';
      case 'info':
      default: return '📢';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Thông báo đã gửi</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-teal-500" /></div>
      ) : (
        <ul className="flex-1 overflow-y-auto">
          {history.length === 0 && <p className="text-slate-500 text-sm">Chưa có thông báo nào.</p>}
          {history.map((item) => {
            const badge = getTargetLabel(item.target);
            return (
              <li key={item._id} className="p-4 border-b border-slate-100 hover:bg-slate-50 transition rounded-md">
                <div className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                  <span>{getIcon(item.type)}</span> {item.title}
                </div>
                <div className="flex justify-between items-center text-sm text-slate-500 mt-2">
                  <span>Gửi lúc: {new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.style}`}>
                    {badge.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AnnouncementHistory;
