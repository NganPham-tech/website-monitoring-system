import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const AlertsSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 animate-pulse space-y-4">
    <div className="h-5 w-36 bg-gray-200 rounded" />
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-16 bg-rose-50 rounded-xl" />
    ))}
  </div>
);

const AlertsTab = ({ logs, isLoading }) => {
  if (isLoading) return <AlertsSkeleton />;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-base font-bold text-gray-800">Nhật ký Cảnh báo</h4>
        <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
          logs?.length > 0
            ? 'bg-rose-50 text-rose-500 border-rose-100'
            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
        }`}>
          {logs?.length || 0} sự cố
        </span>
      </div>

      {(!logs || logs.length === 0) && (
        <div className="py-16 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <div>
            <p className="font-bold text-gray-700 text-lg">Không có sự cố nào! 🎉</p>
            <p className="text-gray-400 text-sm mt-1">Monitor của bạn đang hoạt động ổn định.</p>
          </div>
        </div>
      )}

      {logs && logs.length > 0 && (
        <div className="space-y-3">
          {logs.map((log) => {
            const code = log.status || log.statusCode;
            return (
              <div
                key={log.id || log._id}
                className="flex items-start gap-4 p-4 bg-rose-50 border border-rose-100 rounded-xl hover:border-rose-200 transition-colors"
              >
                <div className="p-2 bg-rose-100 rounded-lg shrink-0 mt-0.5">
                  <AlertTriangle size={18} className="text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-rose-700">
                      {code ? `HTTP ${code}` : 'Không phản hồi'}
                    </span>
                    <span className="text-xs font-semibold text-rose-500 bg-rose-100 px-2 py-0.5 rounded-md">
                      Offline
                    </span>
                  </div>
                  {log.message && (
                    <p className="text-xs text-rose-400 mt-1 truncate">{log.message}</p>
                  )}
                  <p className="text-xs text-rose-400 mt-1.5">
                    {log.timestamp
                      ? formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: vi })
                      : '—'}
                  </p>
                </div>
                <span className="text-xs font-bold text-rose-500 shrink-0">
                  {log.responseTime != null ? `${log.responseTime}ms` : '—'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlertsTab;
