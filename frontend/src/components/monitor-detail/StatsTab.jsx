import React from 'react';
import { TrendingUp, TrendingDown, Repeat, Layers, CheckCircle2, Clock } from 'lucide-react';

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-bold text-gray-800">{value ?? '—'}</span>
  </div>
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
    {[0, 1].map((i) => (
      <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <div className="h-4 w-32 bg-gray-200 rounded mb-6" />
        {[...Array(4)].map((_, j) => (
          <div key={j} className="flex justify-between py-3 border-b border-gray-50">
            <div className="h-3 w-24 bg-gray-100 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

const StatsTab = ({ kpis, monitor, isLoading }) => {
  if (isLoading) return <StatsSkeleton />;

  const curr = kpis ?? {};
  const uptimeVal = curr.uptime?.value;
  const rtVal = curr.responseTime?.value;
  const dtVal = curr.downtime?.value;

  return (
    <div className="space-y-6">
      {/* KPI comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">
            📊 30 ngày gần nhất
          </h4>
          <StatRow label="Uptime" value={uptimeVal != null ? `${uptimeVal}%` : null} />
          <StatRow label="AVG Response Time" value={rtVal != null ? `${rtVal} ms` : null} />
          <StatRow
            label="Tổng Downtime"
            value={dtVal != null ? (dtVal >= 60 ? `${(dtVal / 60).toFixed(1)} giờ` : `${dtVal} phút`) : null}
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-4">
            📈 So sánh xu hướng
          </h4>
          {[
            {
              label: 'Uptime',
              trend: curr.uptime?.trend,
              isGood: curr.uptime?.isUp,
              unit: '%',
            },
            {
              label: 'Response Time',
              trend: curr.responseTime?.trend,
              isGood: curr.responseTime?.isUp === false, // giảm = tốt
              unit: 'ms',
            },
            {
              label: 'Downtime',
              trend: curr.downtime?.trend,
              isGood: curr.downtime?.isUp === false, // giảm = tốt
              unit: 'phút',
            },
          ].map(({ label, trend, isGood, unit }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{label}</span>
              {trend != null ? (
                <span className={`flex items-center gap-1 text-xs font-bold ${isGood ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {isGood ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {trend} {unit}
                </span>
              ) : (
                <span className="text-xs text-gray-400">Không có dữ liệu</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Technical specs */}
      {monitor && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
          <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-5">
            ⚙️ Thông số kỹ thuật
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <Repeat size={18} className="text-teal-500" />, label: 'Retries', value: monitor.retries ?? 3 },
              { icon: <Layers size={18} className="text-blue-500" />, label: 'Protocol', value: (monitor.protocol ?? 'HTTP').toUpperCase() },
              { icon: <CheckCircle2 size={18} className="text-emerald-500" />, label: 'Trạng thái', value: monitor.isActive ? 'Đang chạy' : 'Tạm dừng' },
              { icon: <Clock size={18} className="text-purple-500" />, label: 'Timeout', value: `${(monitor.timeout ?? 30000) / 1000}s` },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                {item.icon}
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">{item.label}</p>
                  <p className="text-sm font-bold text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsTab;
