import React, { memo } from 'react';
import { useServerHealth } from '../../hooks/useAdmin';
import { Loader2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

const MetricBox = ({ label, value, unit, colorClass, dataKey, history }) => {
  return (
    <div className="w-full h-28 bg-zinc-100 rounded-[10px] p-6 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-2 right-2 w-1/3 h-full opacity-30 pointer-events-none">
        {history && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <YAxis domain={[0, 100]} hide />
              <Area type="monotone" dataKey={dataKey} stroke="none" fill={colorClass === 'text-red-500' ? '#ef4444' : colorClass === 'text-yellow-400' ? '#eab308' : '#22c55e'} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="w-48 text-black text-sm font-normal font-inter z-10">{label}</div>
      <div className={`text-xl font-normal font-inter z-10 ${colorClass}`}>
        {value}{unit}
      </div>
    </div>
  );
};

const HealthCharts = () => {
  // Fetch every 5s
  const { data, isLoading } = useServerHealth(5000);

  const getHealthColor = (value, inverse = false) => {
    if (inverse) {
      return value < 99 ? 'text-red-500' : value < 99.9 ? 'text-yellow-400' : 'text-indigo-500';
    }
    return value > 80 ? 'text-red-500' : value > 60 ? 'text-yellow-400' : 'text-green-600';
  };

  return (
    <div className="bg-white rounded-[10px] p-8 w-full shadow-sm min-h-[637px] flex flex-col">
      <h2 className="text-2xl font-semibold font-inter text-black text-center mb-10">Thống kê hệ thống</h2>
      
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : (
        <div className="flex flex-col gap-6 flex-1 px-4">
          <MetricBox 
            label="CPU Usage" 
            value={data?.cpu || 0} 
            unit="%" 
            colorClass={getHealthColor(data?.cpu)}
            dataKey="cpu"
            history={data?.history}
          />
          <MetricBox 
            label="Memory Usage" 
            value={data?.memory || 0} 
            unit="%" 
            colorClass={getHealthColor(data?.memory)}
            dataKey="memory"
            history={data?.history}
          />
          <MetricBox 
            label="Disk Usage" 
            value={data?.disk || 0} 
            unit="%" 
            colorClass={getHealthColor(data?.disk)}
            dataKey="disk"
            history={data?.history}
          />
          <MetricBox 
            label="Uptime" 
            value={data?.uptime || 0} 
            unit="%" 
            colorClass={getHealthColor(data?.uptime, true)}
            dataKey="uptime"
            history={data?.history}
          />
        </div>
      )}
    </div>
  );
};

export default memo(HealthCharts);
