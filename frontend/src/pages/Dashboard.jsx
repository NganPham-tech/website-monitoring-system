import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/dashboard/MetricCard';
import ResponseTimeChart from '../components/dashboard/ResponseTimeChart';
import RecentMonitors from '../components/dashboard/RecentMonitors';
import * as dashboardService from '../services/dashboardService';

const Dashboard = () => {
  const { user } = useAuth();
  const [chartRange, setChartRange] = useState('24h');

  // Query Metrics
  const { data: metricsData, isLoading: metricsLoading, isError: metricsError } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: dashboardService.getDashboardMetrics,
    staleTime: 60000,
  });

  // Query Chart Data
  const { data: chartDataResponse, isLoading: chartLoading, isError: chartError } = useQuery({
    queryKey: ['dashboardChart', chartRange],
    queryFn: () => dashboardService.getResponseTimeChart(chartRange),
    staleTime: 60000,
  });

  // Query Recent Monitors
  const { data: recentMonitorsData, isLoading: recentMonitorsLoading, isError: recentMonitorsError } = useQuery({
    queryKey: ['dashboardRecentMonitors'],
    queryFn: dashboardService.getRecentMonitors,
    staleTime: 60000,
  });

  return (
    <div className="w-full flex flex-col justify-start items-start gap-8">
      {/* Header */}
      <div className="w-full bg-white rounded-2xl px-6 lg:px-9 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div className="text-gray-700 text-3xl font-bold font-['Inter']">Dashboard</div>
        <div className="text-black text-base font-bold font-['Inter']">
          Xin chào, {user?.name || user?.username || 'User'}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard 
          title="Monitors gặp sự cố" 
          value={metricsData?.downMonitors ?? 0}
          valueColorClass="text-black"
          bgColorClass="bg-rose-200"
          isLoading={metricsLoading}
          icon={
            <div className="w-6 h-6 relative overflow-hidden flex justify-center items-center">
              <div className="w-3.5 h-3.5 bg-red-500 rounded-sm"></div>
            </div>
          }
        />
        <MetricCard 
          title="Thời gian phản hồi TB" 
          value={`${metricsData?.avgResponseTime ?? 0}ms`}
          valueColorClass="text-black"
          bgColorClass="bg-amber-100"
          isLoading={metricsLoading}
          icon={
            <div className="w-6 h-6 relative overflow-hidden flex justify-center items-center">
              <div className="w-4 h-5 bg-black rounded-sm"></div>
            </div>
          }
        />
        <MetricCard 
          title="Monitors hoạt động" 
          value={metricsData?.upMonitors ?? 0}
          valueColorClass="text-gray-700"
          bgColorClass="bg-emerald-100"
          isLoading={metricsLoading}
          icon={
            <div className="w-6 h-6 relative overflow-hidden flex justify-center items-center">
              <div className="w-4 h-3 bg-green-600 rounded-sm"></div>
            </div>
          }
        />
        <MetricCard 
          title="Uptime trung bình" 
          value={`${metricsData?.uptimePercentage ?? 0}%`}
          valueColorClass="text-black"
          bgColorClass="bg-teal-100"
          isLoading={metricsLoading}
          icon={
            <div className="w-6 h-6 relative overflow-hidden flex justify-center items-center">
              <div className="w-5 h-5 bg-black rounded-sm"></div>
            </div>
          }
        />
      </div>

      {/* API Errors for Metrics */}
      {metricsError && (
        <div className="w-full p-4 bg-red-50 text-red-600 border border-red-200 rounded-[10px]">
          Lỗi: Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.
        </div>
      )}

      {/* Chart Row */}
      <ResponseTimeChart 
        data={chartDataResponse?.data || chartDataResponse || []} 
        activeRange={chartRange} 
        onRangeChange={setChartRange} 
        isLoading={chartLoading} 
      />
      {chartError && (
        <div className="w-full mt-[-1.5rem] p-4 bg-red-50 text-red-600 border border-red-200 rounded-[10px]">
          Lỗi: Không thể tải dữ liệu biểu đồ.
        </div>
      )}

      {/* Recent Monitors Row */}
      <RecentMonitors 
        monitors={recentMonitorsData?.monitors || recentMonitorsData || []} 
        isLoading={recentMonitorsLoading} 
      />
      {recentMonitorsError && (
        <div className="w-full mt-[-1.5rem] p-4 bg-red-50 text-red-600 border border-red-200 rounded-[10px]">
          Lỗi: Không thể tải danh sách monitors gần đây.
        </div>
      )}
    </div>
  );
};

export default Dashboard;
