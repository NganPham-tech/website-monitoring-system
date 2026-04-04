import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Info, Bell } from 'lucide-react';

// Generates 90 days of squares (mostly green, occasional red)
const generateGridDays = (serviceName) => {
  return Array.from({ length: 90 }).map((_, i) => {
    // Just mock some random downtime for realism
    const isOutage = Math.random() > 0.95 && serviceName !== 'Blog Website';
    return {
      date: new Date(Date.now() - (90 - i) * 86400000).toLocaleDateString('vi-VN'),
      status: isOutage ? 'down' : 'up',
      uptime: isOutage ? '98.5%' : '100%'
    };
  });
};

const services = [
  { id: 1, name: 'API Server', uptimeStr: '99.98%', grid: generateGridDays('API Server') },
  { id: 2, name: 'Database Server', uptimeStr: '99.99%', grid: generateGridDays('Database Server') },
  { id: 3, name: 'Blog Website', uptimeStr: '100.00%', grid: generateGridDays('Blog Website') },
  { id: 4, name: 'Background Workers', uptimeStr: '99.95%', grid: generateGridDays('Background Workers') }
];

const incidents = [
  {
    id: 1,
    date: '15 Tháng 03, 2026',
    title: 'Đã khắc phục vấn đề khiến API phản hồi chậm',
    status: 'resolved',
    updates: [
      { time: '14:30', text: 'Hệ thống đã hoạt động ổn định trở lại. Chúng tôi sẽ tiếp tục theo dõi chặt chẽ.' },
      { time: '13:15', text: 'Chúng tôi đang điều tra nguyên nhân gây ra tình trạng thắt nút cổ chai ở hệ thống Load Balancer Châu Á.' }
    ]
  },
  {
    id: 2,
    date: '02 Tháng 03, 2026',
    title: 'Bảo trì Database Cluster định kỳ',
    status: 'completed',
    updates: [
      { time: '04:00', text: 'Quá trình nâng cấp phiên bản và tối ưu hoá Index đã hoàn tất.' },
      { time: '02:00', text: 'Bắt đầu quá trình bảo trì. Một số dịch vụ có thể gián đoạn nhẹ.' }
    ]
  }
];

const StatusPage = () => {
  const [showSubscribe, setShowSubscribe] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-inter py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded flex items-center justify-center text-white text-xl font-bold border-2 border-teal-600 shadow-sm">
              U
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Uptime Status</h1>
          </div>
          <button 
            onClick={() => setShowSubscribe(true)}
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-md font-semibold transition border border-indigo-200 shadow-sm"
          >
            <Bell className="w-4 h-4" /> NHẬN THÔNG BÁO CẬP NHẬT
          </button>
        </div>

        {/* Global Banner */}
        <div className="bg-emerald-500 rounded-lg p-6 shadow-md mb-10 flex items-center gap-4 text-white">
          <CheckCircle className="w-10 h-10 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold">Tất cả hệ thống hoạt động bình thường</h2>
            <p className="opacity-90 mt-1">Cập nhật lần cuối: 2 phút trước</p>
          </div>
        </div>

        {/* Uptime Grid Modules */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-10">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Uptime theo Dịch vụ (90 Ngày)</h3>
          
          <div className="space-y-8">
            {services.map(svc => (
              <div key={svc.id}>
                <div className="flex justify-between items-end mb-3">
                  <span className="font-semibold text-slate-700 text-lg">{svc.name}</span>
                  <span className="text-sm font-bold text-teal-600">{svc.uptimeStr} Uptime</span>
                </div>
                {/* 90-day Grid Blocks */}
                <div className="flex gap-[2px] h-10">
                  {svc.grid.map((day, idx) => (
                    <div 
                      key={idx} 
                      title={`${day.date} - ${day.uptime}`}
                      className={`flex-1 rounded-sm cursor-pointer hover:opacity-75 transition ${day.status === 'down' ? 'bg-red-400' : 'bg-emerald-400'}`}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                  <span>90 ngày trước</span>
                  <span>100% Uptime</span>
                  <span>Hôm nay</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Nhật ký Sự cố gần đây</h3>
          <div className="space-y-8">
            {incidents.map(inc => (
              <div key={inc.id} className="relative pl-8">
                {/* Timeline Line */}
                <div className="absolute left-[11px] top-8 bottom-[-32px] w-0.5 bg-slate-200 last:hidden"></div>
                
                {/* Timeline Dot */}
                <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-4 border-slate-50 ${inc.status === 'resolved' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>

                <div className="mb-1 text-slate-500 font-semibold">{inc.date}</div>
                <h4 className="text-xl font-bold text-slate-800 mb-4">{inc.title}</h4>
                
                <div className="space-y-4">
                  {inc.updates.map((upd, idx) => (
                    <div key={idx} className="bg-white rounded-md p-4 shadow-sm border border-slate-100 flex gap-4">
                      <div className="text-slate-400 font-medium whitespace-nowrap pt-0.5">{upd.time}</div>
                      <div className="text-slate-700 leading-relaxed">{upd.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscribe Modal */}
      {showSubscribe && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in-scale">
            <button 
              onClick={() => setShowSubscribe(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Nhận thông báo cập nhật</h3>
            <p className="text-slate-500 mb-6 text-sm">Nhập email của bạn để tự động nhận thông báo ngay khi có sự cố hạ tầng xảy ra.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); alert("Đăng ký thành công!"); setShowSubscribe(false); }}>
              <input 
                type="email" 
                required 
                placeholder="email@example.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg mb-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
              >
                Đăng Ký
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPage;
