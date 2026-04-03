import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Trash2, ArrowLeft, Loader2 } from 'lucide-react';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const HeaderSkeleton = () => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 animate-pulse">
    <div className="flex flex-col gap-2">
      <div className="h-4 w-20 bg-gray-200 rounded" />
      <div className="flex items-center gap-4">
        <div className="h-8 w-56 bg-gray-200 rounded" />
        <div className="h-6 w-16 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-4 w-40 bg-gray-100 rounded" />
    </div>
    <div className="flex gap-3">
      <div className="h-12 w-32 bg-gray-200 rounded-xl" />
      <div className="h-12 w-24 bg-gray-100 rounded-xl" />
    </div>
  </div>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ monitor }) => {
  if (!monitor?.isActive) {
    return (
      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">
        ⏸ Tạm dừng
      </span>
    );
  }
  const isOnline = monitor.status?.toLowerCase() === 'online';
  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
      isOnline
        ? 'bg-[#E0F2F1] text-[#00BFA5] border-[#B2DFDB]'
        : 'bg-rose-50 text-rose-500 border-rose-100'
    }`}>
      {isOnline && <span className="w-1.5 h-1.5 rounded-full bg-[#00BFA5] animate-pulse" />}
      {monitor.status || 'Pending'}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const DetailHeader = ({ monitor, isLoading, onToggleStatus, onDelete, isTogglingStatus }) => {
  const navigate = useNavigate();

  if (isLoading) return <HeaderSkeleton />;
  if (!monitor) return null;

  const isActive = monitor?.isActive;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
      {/* Left: breadcrumb + title */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate('/monitors')}
          className="flex items-center gap-2 text-gray-400 hover:text-[#00BFA5] font-bold text-sm transition-colors self-start group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Quay lại
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{monitor.name}</h1>
          <StatusBadge monitor={monitor} />
        </div>

        <a
          href={monitor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[#80CBC4] hover:text-[#00BFA5] hover:underline transition-colors"
        >
          {monitor.url}
        </a>
      </div>

      {/* Right: action buttons */}
      <div className="flex gap-3 shrink-0">
        {/* Pause / Resume */}
        <button
          onClick={onToggleStatus}
          disabled={isTogglingStatus}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-60 ${
            isActive
              ? 'bg-[#E0F2F1] text-[#00897B] hover:bg-[#B2DFDB]'
              : 'bg-[#00BFA5] text-white hover:bg-[#00897B]'
          }`}
        >
          {isTogglingStatus ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isActive ? (
            <Pause size={16} />
          ) : (
            <Play size={16} />
          )}
          {isActive ? 'Tạm dừng' : 'Tiếp tục'}
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl font-bold text-sm transition-all border border-rose-100 shadow-sm"
        >
          <Trash2 size={16} />
          Xóa
        </button>
      </div>
    </div>
  );
};

export default DetailHeader;
