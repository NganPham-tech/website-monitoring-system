import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

// --- Severity badge config ---
const SEVERITY_CONFIG = {
  critical: { label: 'Critical', className: 'bg-red-100 text-red-600 border border-red-200' },
  warning:  { label: 'Warning',  className: 'bg-amber-100 text-amber-700 border border-amber-200' },
  info:     { label: 'Info',     className: 'bg-blue-100 text-blue-700 border border-blue-200' },
};

// --- Status badge config ---
const STATUS_CONFIG = {
  ongoing:  { emoji: '🔴', label: 'Đang xảy ra', className: 'bg-red-100 text-red-600 border border-red-200' },
  resolved: { emoji: '🟢', label: 'Đã giải quyết', className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
};

const SkeletonOverview = () => (
  <div className="w-full bg-white rounded-2xl p-6 lg:p-8 shadow-sm animate-pulse">
    <div className="flex flex-col gap-5">
      <div className="h-8 w-36 bg-gray-200 rounded-full" />
      <div className="h-9 w-2/3 bg-gray-200 rounded-lg" />
      <div className="flex flex-wrap gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-5 w-32 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  </div>
);

const AssigneeAvatar = ({ assignee }) => {
  if (!assignee) return <span className="text-slate-400 italic text-sm">Chưa gán</span>;
  return (
    <div className="flex items-center gap-2">
      {assignee.avatar ? (
        <img
          src={assignee.avatar}
          alt={assignee.name}
          className="w-7 h-7 rounded-full object-cover ring-2 ring-teal-200"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-teal-200">
          {assignee.initials || assignee.name?.charAt(0) || '?'}
        </div>
      )}
      <span className="text-slate-700 font-semibold text-sm">{assignee.name}</span>
    </div>
  );
};

const IncidentOverview = ({ incident, isLoading }) => {
  if (isLoading) return <SkeletonOverview />;
  if (!incident) return null;

  const status = STATUS_CONFIG[incident.status] || STATUS_CONFIG.ongoing;
  const severity = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.info;

  const startedRelative = incident.startedAt
    ? formatDistanceToNow(new Date(incident.startedAt), { addSuffix: true, locale: vi })
    : 'N/A';

  const startedFormatted = incident.startedAt
    ? new Date(incident.startedAt).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : 'N/A';

  const downtimeDisplay = incident.status === 'resolved' && incident.resolvedAt
    ? `${Math.round(
        (new Date(incident.resolvedAt) - new Date(incident.startedAt)) / 60000
      )} phút`
    : `${incident.downtimeMinutes ?? 0} phút (đang tính)`;

  return (
    <div className="w-full bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
      {/* Status badge */}
      <span
        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${status.className}`}
      >
        <span>{status.emoji}</span>
        {status.label}
      </span>

      {/* Title */}
      <h1 className="text-gray-800 text-2xl lg:text-3xl font-extrabold font-['Inter'] mb-5 leading-tight">
        {incident.title}
      </h1>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {/* Start time */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            <span className="text-slate-400">Bắt đầu:</span>{' '}
            <span className="font-medium text-slate-700">
              {startedFormatted}
            </span>{' '}
            <span className="text-slate-400 text-xs">({startedRelative})</span>
          </span>
        </div>

        {/* Downtime */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
          <span>
            <span className="text-slate-400">Downtime:</span>{' '}
            <span className="font-semibold text-slate-700">{downtimeDisplay}</span>
          </span>
        </div>

        {/* Severity */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Mức độ:</span>
          <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${severity.className}`}>
            {severity.label}
          </span>
        </div>

        {/* Assignee */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">Người xử lý:</span>
          <AssigneeAvatar assignee={incident.assignee} />
        </div>
      </div>
    </div>
  );
};

export default IncidentOverview;
