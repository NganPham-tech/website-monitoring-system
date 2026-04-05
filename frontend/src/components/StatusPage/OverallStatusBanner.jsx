import React from 'react';

const OverallStatusBanner = ({ status }) => {
  // status: 'operational' | 'partial_outage' | 'major_outage'
  
  const getBannerConfig = () => {
    switch (status) {
      case 'operational':
        return {
          bgColor: 'bg-lime-300',
          textColor: 'text-black',
          icon: '✓',
          text: 'Tất cả hệ thống hoạt động bình thường'
        };
      case 'partial_outage':
        return {
          bgColor: 'bg-yellow-400',
          textColor: 'text-black',
          icon: '!',
          text: 'Hệ thống đang gặp sự cố một phần'
        };
      case 'major_outage':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          icon: '✕',
          text: 'Hệ thống đang ngừng hoạt động'
        };
      default:
        return {
          bgColor: 'bg-stone-300',
          textColor: 'text-black',
          icon: '?',
          text: 'Đang tải trạng thái...'
        };
    }
  };

  const config = getBannerConfig();

  return (
    <div className="w-full max-w-[1208px] bg-white p-12 flex flex-col items-center justify-center shadow-sm mb-10">
      <div className={`w-28 h-28 ${config.bgColor} rounded-full flex items-center justify-center mb-6`}>
        <span className={`text-5xl font-normal ${config.textColor}`}>{config.icon}</span>
      </div>
      <div className="text-xl font-normal text-black text-center">
        {config.text}
      </div>
    </div>
  );
};

export default OverallStatusBanner;
