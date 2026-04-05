import React, { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const UptimeSquare = ({ dayData }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // status: 1 for 100%, 2 for partial, 3 for major
  const getBGColor = (status) => {
    switch (status) {
      case 1: return 'bg-green-600';
      case 2: return 'bg-yellow-400';
      case 3: return 'bg-red-500';
      default: return 'bg-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1: return 'Hoạt động';
      case 2: return 'Gián đoạn nhẹ';
      case 3: return 'Downtime nghiêm trọng';
      default: return 'Không có dữ liệu';
    }
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div 
        className={`w-2 h-8 rounded-sm ${getBGColor(dayData.status)} hover:opacity-70 cursor-pointer transition-opacity`}
      ></div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 w-48 bg-black text-white text-xs p-2 rounded shadow-lg">
          <div className="font-bold mb-1">
            {format(new Date(dayData.date), 'dd/MM/yyyy', { locale: vi })}
          </div>
          <div className="flex justify-between">
            <span>Uptime:</span>
            <span>{dayData.uptime}%</span>
          </div>
          <div className="mt-1">
            {getStatusText(dayData.status)}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black"></div>
        </div>
      )}
    </div>
  );
};

export default React.memo(UptimeSquare);
