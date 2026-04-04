import React from 'react';
import { TrendingUp, TrendingDown, Activity, Clock, AlertTriangle } from 'lucide-react';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const KpiSkeleton = () => (
  <div className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
      <div className="w-16 h-5 bg-gray-100 rounded-full" />
    </div>
    <div className="h-3 w-24 bg-gray-100 rounded mb-3" />
    <div className="h-9 w-32 bg-gray-200 rounded" />
  </div>
);

// ─── KpiCards ─────────────────────────────────────────────────────────────────
const KpiCards = ({ kpis, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KpiSkeleton /><KpiSkeleton /><KpiSkeleton />
      </div>
    );
  }

  const cards = [
    {
      label: 'Uptime (30 ngày)',
      value: kpis?.uptime?.value != null ? `${kpis.uptime.value}%` : '—',
      trend: kpis?.uptime?.trend != null ? `${kpis.uptime.trend}%` : null,
      isUp: kpis?.uptime?.isUp,
      icon: Activity,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
    {
      label: 'AVG Response Time',
      value: kpis?.responseTime?.value != null ? `${kpis.responseTime.value}ms` : '—',
      trend: kpis?.responseTime?.trend != null ? `${kpis.responseTime.trend}ms` : null,
      isUp: kpis?.responseTime?.isUp != null ? !kpis.responseTime.isUp : null, // giảm = tốt
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Tổng Downtime',
      value: kpis?.downtime?.value != null ? `${kpis.downtime.value} phút` : '—',
      trend: kpis?.downtime?.trend != null ? `${kpis.downtime.trend} phút` : null,
      isUp: kpis?.downtime?.isUp != null ? !kpis.downtime.isUp : null, // giảm = tốt
      icon: AlertTriangle,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm transition-all hover:shadow-md group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${card.bg} ${card.color} transition-transform group-hover:scale-110 duration-200`}>
              <card.icon size={24} />
            </div>
            {card.trend != null && (
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                card.isUp ? 'text-emerald-600 bg-emerald-50' : 'text-rose-500 bg-rose-50'
              }`}>
                {card.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {card.trend}
              </div>
            )}
          </div>
          <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
            {card.label}
          </div>
          <div className="text-3xl font-bold text-gray-900">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

export default KpiCards;
