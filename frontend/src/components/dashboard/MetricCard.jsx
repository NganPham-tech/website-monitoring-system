import React from 'react';

const MetricCard = ({ title, value, valueColorClass, bgColorClass, icon, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-80 h-44 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm animate-pulse">
        <div className="w-12 h-12 bg-slate-200 rounded-[10px]"></div>
        <div className="flex flex-col gap-2">
          <div className="w-20 h-8 bg-slate-200 rounded"></div>
          <div className="w-32 h-4 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-44 bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm">
      <div className={`w-12 h-12 ${bgColorClass} rounded-[10px] flex justify-center items-center`}>
        {icon}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className={`text-3xl font-bold font-['Inter'] ${valueColorClass}`}>
          {value}
        </div>
        <div className="text-black text-base font-normal font-['Inter']">
          {title}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
