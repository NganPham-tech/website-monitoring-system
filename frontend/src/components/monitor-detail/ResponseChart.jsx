import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// ─── Chart Skeleton ───────────────────────────────────────────────────────────
const ChartSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-[300px] w-full bg-gradient-to-b from-gray-100 to-gray-50 rounded-2xl" />
  </div>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl min-w-[100px]">
      <p className="text-gray-400 mb-1">Ngày {label}</p>
      <p className="font-bold text-[#00BFA5]">⏱ {payload[0]?.value} ms</p>
    </div>
  );
};

const RANGES = [
  { id: '7d', label: '7 ngày' },
  { id: '30d', label: '30 ngày' },
  { id: '90d', label: '90 ngày' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const ResponseChart = ({ data = [], range, onRangeChange, isLoading }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm">
    {/* Header */}
    <div className="flex justify-between items-center mb-8">
      <div>
        <h3 className="text-base font-bold text-gray-900">Thời gian phản hồi (ms)</h3>
        <p className="text-xs text-gray-400 mt-0.5">Biểu đồ response time theo ngày</p>
      </div>
      <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
        {RANGES.map((r) => (
          <button
            key={r.id}
            onClick={() => onRangeChange(r.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              range === r.id
                ? 'bg-white text-[#00BFA5] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>

    {/* Chart area */}
    {isLoading ? (
      <ChartSkeleton />
    ) : data.length === 0 ? (
      <div className="h-[300px] flex flex-col items-center justify-center gap-3 text-gray-400">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-3xl">📊</div>
        <p className="text-sm font-medium">Chưa có dữ liệu</p>
      </div>
    ) : (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00BFA5" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#00BFA5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 'bold' }}
              tickFormatter={(v) => `${v}ms`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00BFA5"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorValue)"
              dot={false}
              activeDot={{ r: 5, fill: '#00897B', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);

export default ResponseChart;
