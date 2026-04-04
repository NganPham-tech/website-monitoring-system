import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const filterOptions = [
  { label: '24h', value: '24h' },
  { label: '7 ngày', value: '7d' },
  { label: '30 ngày', value: '30d' },
  { label: '90 ngày', value: '90d' }
];

const ResponseTimeChart = ({ data, activeRange, onRangeChange, isLoading }) => {
  return (
    <div className="w-full bg-white rounded-[10px] p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="text-gray-700 text-2xl font-bold font-['Inter']">
          Response Time ({filterOptions.find(o => o.value === activeRange)?.label || activeRange} qua)
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 lg:gap-4 flex-wrap">
          {filterOptions.map((option) => {
            const isActive = activeRange === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onRangeChange(option.value)}
                className={`px-4 sm:px-6 py-2.5 rounded-[10px] outline outline-1 outline-offset-[-1px] outline-black backdrop-blur-[2px] transition-colors
                  ${isActive ? 'bg-teal-500 text-black border-transparent' : 'bg-white text-black'} 
                  font-['Inter'] text-sm sm:text-base font-normal`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[300px] sm:h-[400px] bg-zinc-50 rounded-[10px] flex justify-center items-center p-2 sm:p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2">
           <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
           <span className="text-gray-500 text-sm font-['Inter']">Đang tải biểu đồ...</span>
          </div>
        ) : (!data || data.length === 0) ? (
          <div className="text-gray-500 text-sm font-['Inter']">Không có dữ liệu</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis 
                dataKey="timestamp" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="responseTime" 
                stroke="#14b8a6" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
                animationDuration={1000}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ResponseTimeChart;
