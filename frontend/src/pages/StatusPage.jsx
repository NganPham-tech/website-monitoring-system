import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import statusPageService from '../api/statusPageService';
import StatusHeader from '../components/StatusPage/StatusHeader';
import OverallStatusBanner from '../components/StatusPage/OverallStatusBanner';
import ServiceUptimeItem from '../components/StatusPage/ServiceUptimeItem';
import IncidentTimeline from '../components/StatusPage/IncidentTimeline';
import SubscribeForm from '../components/StatusPage/SubscribeForm';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

const StatusPage = () => {
  // Use React Query with 1-minute polling as requested
  const { 
    data, 
    isLoading, 
    isError, 
    refetch,
    isRefetching 
  } = useQuery({
    queryKey: ['statusPageSummary'],
    queryFn: statusPageService.getSummary,
    refetchInterval: 60000, // 1 minute polling
    staleTime: 30000,
    retry: 3,
  });

  // Example mock data in case API returns empty or for dev
  const mockSummary = {
    systemStatus: 'operational',
    services: [
      {
        id: '1',
        name: 'Webside chính',
        status: 'operational',
        avgUptime: '100',
        uptimeData: Array.from({ length: 60 }, (_, i) => ({
          date: new Date(Date.now() - (59 - i) * 24 * 60 * 60 * 1000).toISOString(),
          uptime: 100,
          status: 1
        }))
      },
      {
        id: '2',
        name: 'API Server',
        status: 'operational',
        avgUptime: '99.9',
        uptimeData: Array.from({ length: 60 }, (_, i) => ({
          date: new Date(Date.now() - (59 - i) * 24 * 60 * 60 * 1000).toISOString(),
          uptime: (i === 15 || i === 45) ? 95 : 100,
          status: (i === 15 || i === 45) ? 2 : 1
        }))
      },
      {
        id: '3',
        name: 'Blog Webside',
        status: 'partial_outage',
        avgUptime: '98.5',
        uptimeData: Array.from({ length: 60 }, (_, i) => ({
          date: new Date(Date.now() - (59 - i) * 24 * 60 * 60 * 1000).toISOString(),
          uptime: (i > 55) ? 0 : 100,
          status: (i > 55) ? 3 : 1
        }))
      },
      {
        id: '4',
        name: 'Database Server',
        status: 'operational',
        avgUptime: '100',
        uptimeData: Array.from({ length: 60 }, (_, i) => ({
          date: new Date(Date.now() - (59 - i) * 24 * 60 * 60 * 1000).toISOString(),
          uptime: 100,
          status: 1
        }))
      },
    ],
    incidents: [
      {
        id: '101',
        title: 'Blog Webside không thể truy cập',
        description: 'Chúng tôi đang điều tra sự cố khiến Blog Webside không thể truy cập. Đội ngũ kỹ thuật đã được triển khai để khắc phục.',
        status: 'investigating',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '102',
        title: 'Webside chính phản hồi bình thường',
        description: 'Webside chính đã hoạt động bình thường trở lại sau 15 phút gián đoạn nhẹ. Chúng tôi tiếp tục theo dõi hiệu suất hệ thống.',
        status: 'resolved',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: '103',
        title: 'API Server phản hồi chậm',
        description: 'Đã khắc phục hoàn toàn vấn đề khiến API phản hồi chậm do tải cao đột biến từ một số truy vấn phức tạp.',
        status: 'resolved',
        createdAt: new Date(Date.now() - 259200000).toISOString()
      }
    ]
  };

  const currentData = data || mockSummary;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-gray-500 font-['Inter']">Đang tải trạng thái hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-50 pb-24 flex flex-col items-center">
      {/* Real-time Indicator Overlay */}
      {isRefetching && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-indigo-100 shadow-sm transition-all duration-300">
           <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
           <span className="text-[10px] text-indigo-900 font-medium">ĐANG CẬP NHẬT...</span>
        </div>
      )}

      {/* Main Sections */}
      <StatusHeader />
      
      <OverallStatusBanner status={currentData.systemStatus} />

      <section className="w-full max-w-[1208px]">
        <h2 className="text-xl font-normal text-black font-['Inter'] mb-6 pl-4 border-l-4 border-indigo-600">
          Trạng thái dịch vụ
        </h2>
        {currentData.services.map((service) => (
          <ServiceUptimeItem key={service.id} service={service} />
        ))}
      </section>

      <IncidentTimeline incidents={currentData.incidents} />

      <SubscribeForm />

      <footer className="mt-20 text-gray-400 text-xs font-['Inter'] flex flex-col items-center gap-2">
        <p>&copy; {new Date().getFullYear()} Uptime Monitor. Mọi quyền được bảo lưu.</p>
        <div className="flex gap-4">
            <a href="#" className="hover:text-indigo-600">Giới thiệu</a>
            <a href="#" className="hover:text-indigo-600">Hỗ trợ</a>
            <a href="#" className="hover:text-indigo-600">Twitter</a>
        </div>
      </footer>
    </div>
  );
};

export default StatusPage;
