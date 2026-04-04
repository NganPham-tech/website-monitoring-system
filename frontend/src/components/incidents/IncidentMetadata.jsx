import React from 'react';
import { format } from 'date-fns';

const MetaRow = ({ label, value, valueClass = 'text-gray-800' }) => (
  <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
    <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">{label}</div>
    <div className={`text-sm font-semibold truncate ${valueClass}`}>{value}</div>
  </div>
);

const SkeletonMetadata = () => (
  <div className="w-full bg-white rounded-2xl p-6 shadow-sm animate-pulse space-y-6">
    <div className="h-6 w-32 bg-gray-200 rounded"></div>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

const NotificationHistory = ({ notifications }) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-slate-100">
      <h3 className="text-gray-800 text-lg font-bold font-['Inter'] mb-4">
        Cảnh báo đã gửi
      </h3>
      <div className="space-y-3">
        {notifications.map((notif, idx) => (
          <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-sm text-slate-700 w-16">{notif.channel}</span>
              <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                {notif.recipients} người nhận
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium text-right">
              {format(new Date(notif.sentAt), 'HH:mm - dd/MM')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const IncidentMetadata = ({ incident, isLoading }) => {
  if (isLoading) return <SkeletonMetadata />;
  if (!incident) return null;

  const priorityColor = incident.priority === 'P1' ? 'text-red-600' 
    : incident.priority === 'P2' ? 'text-amber-600' 
    : 'text-blue-600';

  return (
    <div className="w-full bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 h-fit sticky top-6">
      <h2 className="text-gray-800 text-xl font-bold font-['Inter'] mb-6">
        Thông tin chi tiết
      </h2>
      
      <div className="flex flex-col gap-4">
        <MetaRow label="ID sự cố" value={`#${incident.id}`} valueClass="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded w-max" />
        <MetaRow label="Dịch vụ bị ảnh hưởng" value={incident.affectedService} />
        <MetaRow label="Loại sự cố" value={incident.incidentType} />
        <MetaRow label="Nguyên nhân (Root cause)" value={incident.rootCause || 'Đang điều tra...'} valueClass={incident.rootCause ? 'text-gray-800' : 'text-amber-600 italic'} />
        <MetaRow label="Mức độ ưu tiên" value={`${incident.priority} - ${incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}`} valueClass={priorityColor} />
      </div>

      <NotificationHistory notifications={incident.notifications} />
    </div>
  );
};

export default IncidentMetadata;
