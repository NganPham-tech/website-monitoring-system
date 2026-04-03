import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const LogSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-xl shrink-0" />
          <div className="space-y-2">
            <div className="h-3.5 w-28 bg-gray-200 rounded" />
            <div className="h-2.5 w-20 bg-gray-100 rounded" />
          </div>
        </div>
        <div className="space-y-1.5 text-right">
          <div className="h-3.5 w-14 bg-gray-200 rounded ml-auto" />
          <div className="h-2.5 w-10 bg-gray-100 rounded ml-auto" />
        </div>
      </div>
    ))}
  </div>
);


const ActivityLogs = ({ logs, isLoading }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm">
    <div className="flex justify-between items-center mb-8">
      <h3 className="text-base font-bold text-gray-900">Nhật ký hoạt động gần đây</h3>
      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
        {logs?.length || 0} lần kiểm tra
      </span>
    </div>

    {isLoading && <LogSkeleton />}

    {!isLoading && (!logs || logs.length === 0) && (
      <div className="py-12 text-center text-gray-400 text-sm">
        Chưa có nhật ký hoạt động nào.
      </div>
    )}

    {!isLoading && logs && logs.length > 0 && (
      <div className="space-y-3">
        {logs.map((log) => {
          const isSuccess = log.status >= 200 && log.status < 300;
          return (
            <div
              key={log.id || log._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl transition-all hover:bg-[#E0F2F1]/40 group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'
                }`}>
                  {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-bold text-sm ${isSuccess ? 'text-gray-900' : 'text-rose-600'}`}>
                      HTTP {log.status}
                    </span>
                    <span className="text-xs font-medium text-gray-400">{log.message}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    <Clock size={10} />
                    {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: vi })}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-sm font-bold ${
                  log.responseTime > 1000 ? 'text-rose-500' :
                  log.responseTime > 400 ? 'text-yellow-500' : 'text-gray-700'
                }`}>
                  {log.responseTime}ms
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Phản hồi
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default ActivityLogs;
