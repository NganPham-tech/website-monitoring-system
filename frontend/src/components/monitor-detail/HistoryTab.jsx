import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle2, XCircle } from 'lucide-react';

const HistorySkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50 animate-pulse">
    <div className="h-5 w-36 bg-gray-200 rounded mb-6" />
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50">
          <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0" />
          <div className="flex-1 grid grid-cols-4 gap-4">
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-100 rounded" />
            <div className="h-3 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const HistoryTab = ({ logs, isLoading }) => {
  if (isLoading) return <HistorySkeleton />;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-base font-bold text-gray-800">Lịch sử kiểm tra</h4>
        <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">
          {logs?.length || 0} bản ghi
        </span>
      </div>

      {(!logs || logs.length === 0) && (
        <div className="py-16 text-center text-gray-400 text-sm">
          Chưa có lịch sử kiểm tra nào.
        </div>
      )}

      {logs && logs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="text-left pb-3 pr-4">Trạng thái</th>
                <th className="text-left pb-3 pr-4">HTTP Code</th>
                <th className="text-right pb-3 pr-4">Response Time</th>
                <th className="text-right pb-3">Thời điểm</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isOk = (log.status || log.statusCode || 200) < 400;
                const code = log.status || log.statusCode;
                const rt = log.responseTime;
                return (
                  <tr
                    key={log.id || log._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${isOk ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {isOk ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {isOk ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-mono font-bold ${
                        code >= 200 && code < 300 ? 'text-emerald-600' :
                        code >= 400 ? 'text-rose-500' : 'text-gray-500'
                      }`}>
                        {code ?? '—'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className={`text-xs font-bold ${
                        rt <= 400 ? 'text-emerald-600' : rt <= 1000 ? 'text-yellow-500' : 'text-rose-500'
                      }`}>
                        {rt != null ? `${rt} ms` : '—'}
                      </span>
                    </td>
                    <td className="py-3 text-right text-xs text-gray-400">
                      {log.timestamp
                        ? formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, locale: vi })
                        : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
