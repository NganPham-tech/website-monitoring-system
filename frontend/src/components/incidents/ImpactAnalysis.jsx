import React from 'react';

const ImpactCard = ({ title, value, icon, valueColorClass = 'text-red-500' }) => (
  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 flex flex-col justify-center items-center gap-3 transition-transform hover:scale-[1.02] duration-300">
    <div className={`text-3xl font-bold font-['Inter'] ${valueColorClass}`}>
      {value}
    </div>
    <div className="text-center text-slate-700 text-sm font-medium font-['Inter']">
      {title}
    </div>
  </div>
);

const SkeletonImpactCard = () => (
  <div className="bg-gray-100 rounded-2xl p-6 flex flex-col justify-center items-center gap-4 animate-pulse h-32">
    <div className="h-8 w-16 bg-gray-200 rounded"></div>
    <div className="h-4 w-28 bg-gray-200 rounded"></div>
  </div>
);

const ImpactAnalysis = ({ impact, isLoading }) => {
  return (
    <div className="w-full bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
      <h2 className="text-gray-800 text-xl font-bold font-['Inter']">
        Tác động của sự cố
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {isLoading ? (
          <>
            <SkeletonImpactCard />
            <SkeletonImpactCard />
            <SkeletonImpactCard />
            <SkeletonImpactCard />
          </>
        ) : (
          <>
            <ImpactCard 
              title="Dịch vụ bị ảnh hưởng" 
              value={impact?.affectedServices ?? 0} 
            />
            <ImpactCard 
              title="Downtime" 
              value={impact?.downtimeFormatted ?? '0m'} 
            />
            <ImpactCard 
              title="Cảnh báo đã gửi" 
              value={impact?.alertsSent ?? 0} 
            />
            <ImpactCard 
              title="Người dùng bị ảnh hưởng" 
              value={impact?.usersAffected ?? '0'} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ImpactAnalysis;
