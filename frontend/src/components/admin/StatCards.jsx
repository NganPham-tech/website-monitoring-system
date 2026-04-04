import React, { memo } from 'react';
import { Activity, Users, AlertCircle, Database } from 'lucide-react';
import { useAdminStats } from '../../hooks/useAdmin';

const StatSkeleton = () => (
  <div className="w-full h-48 bg-white rounded-xl shadow border border-black p-6 animate-pulse flex flex-col justify-between">
    <div className="w-12 h-12 bg-indigo-100 border border-black rounded" />
    <div className="space-y-4">
      <div className="h-10 bg-gray-200 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-3/4" />
    </div>
  </div>
);

const StatCards = () => {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {[1, 2, 3, 4].map((i) => <StatSkeleton key={i} />)}
      </div>
    );
  }

  const { totalMonitors = 0, totalUsers = 0, alerts30d = 0, dbSize = '0GB' } = stats || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
      {/* Total Monitors */}
      <div className="relative w-full h-48 bg-white rounded-xl shadow-md border border-black p-8 flex flex-col justify-end">
        <div className="absolute top-8 left-8 w-12 h-12 bg-indigo-100 border border-black flex items-center justify-center">
          <Activity className="w-6 h-6 text-black" />
        </div>
        <div>
          <h3 className="text-4xl font-semibold font-inter text-black mb-2">{totalMonitors}</h3>
          <p className="text-xl font-semibold font-inter text-slate-700">Tổng monitors</p>
        </div>
      </div>

      {/* Total Users */}
      <div className="relative w-full h-48 bg-white rounded-xl shadow-md border border-black p-8 flex flex-col justify-end">
        <div className="absolute top-8 left-8 w-12 h-12 bg-indigo-100 border border-black flex items-center justify-center">
          <Users className="w-6 h-6 text-black" />
        </div>
        <div>
          <h3 className="text-4xl font-semibold font-inter text-black mb-2">{totalUsers}</h3>
          <p className="text-xl font-semibold font-inter text-slate-700">Tổng người dùng</p>
        </div>
      </div>

      {/* Alerts 30 Days */}
      <div className="relative w-full h-48 bg-white rounded-xl shadow-md border border-black p-8 flex flex-col justify-end">
        <div className="absolute top-8 left-8 w-12 h-12 bg-indigo-100 border border-black flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-black" />
        </div>
        <div>
          <h3 className="text-4xl font-semibold font-inter text-black mb-2">{alerts30d}</h3>
          <p className="text-xl font-semibold font-inter text-slate-700">Cảnh báo (30 ngày)</p>
        </div>
      </div>

      {/* DB Size */}
      <div className="relative w-full h-48 bg-white rounded-xl shadow-md border border-black p-8 flex flex-col justify-end">
        <div className="absolute top-8 left-8 w-12 h-12 bg-indigo-100 border border-black flex items-center justify-center">
          <Database className="w-6 h-6 text-black" />
        </div>
        <div>
          <h3 className="text-4xl font-semibold font-inter text-black mb-2">{dbSize}</h3>
          <p className="text-xl font-semibold font-inter text-slate-700">Database size</p>
        </div>
      </div>
    </div>
  );
};

export default memo(StatCards);
