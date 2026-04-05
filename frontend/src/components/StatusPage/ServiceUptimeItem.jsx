import React from 'react';
import UptimeSquare from './UptimeSquare';

const ServiceUptimeItem = ({ service }) => {
  // service: { name, status, uptimeData: [ { date, uptime, status } ] }
  
  const getOverallStatusText = (status) => {
    switch (status) {
      case 'operational': return 'Hoạt động';
      case 'partial_outage': return 'Gặp sự cố';
      case 'major_outage': return 'Ngừng hoạt động';
      default: return 'Không xác định';
    }
  };

  const getOverallStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'text-green-600';
      case 'partial_outage': return 'text-yellow-500';
      case 'major_outage': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="mb-10 w-full max-w-[1208px] bg-white p-6 shadow-sm border border-gray-100 rounded-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-normal text-black font-['Inter']">{service.name}</h3>
        <span className={`text-xs font-normal font-['Inter'] ${getOverallStatusColor(service.status)}`}>
          {getOverallStatusText(service.status)}
        </span>
      </div>
      
      <div className="flex flex-wrap gap-[2px] items-center">
        {service.uptimeData.map((day, idx) => (
          <UptimeSquare key={idx} dayData={day} />
        ))}
      </div>
      
      <div className="flex justify-between mt-4 border-t pt-4 text-xs text-gray-400 font-['Inter']">
        <span>60 ngày trước</span>
        <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-600 rounded-sm"></div> 100% Uptime
            </span>
            <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-sm"></div> Gián đoạn
            </span>
            <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-sm"></div> Downtime
            </span>
            <span>Tỷ lệ {service.avgUptime || '100'}%</span>
        </div>
        <span>Hôm nay</span>
      </div>
    </div>
  );
};

export default React.memo(ServiceUptimeItem);
