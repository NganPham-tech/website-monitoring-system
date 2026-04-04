import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const TYPE_CONFIG = {
  detected: { color: 'bg-red-500', icon: '🚨' },
  investigating: { color: 'bg-amber-500', icon: '🔍' },
  identified: { color: 'bg-purple-500', icon: '💡' },
  fixing: { color: 'bg-blue-500', icon: '🛠️' },
  resolved: { color: 'bg-emerald-500', icon: '✅' },
  note: { color: 'bg-slate-400', icon: '📝' },
};

const SkeletonTimelineItem = () => (
  <div className="relative flex gap-6 mt-6 first:mt-0 animate-pulse">
    <div className="w-32 flex-shrink-0 text-right space-y-2">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 ml-auto"></div>
    </div>
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-gray-200 z-10 border-4 border-white"></div>
      <div className="w-0.5 h-full bg-gray-100 absolute top-10 bottom-[-24px] left-[150px] transform -translate-x-1/2"></div>
    </div>
    <div className="flex-1 bg-gray-50 rounded-xl p-5 mb-6 h-28 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

const TimelineItem = ({ item, isLast }) => {
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.note;
  const time = new Date(item.timestamp);
  
  return (
    <div className="relative flex gap-4 md:gap-6 mt-6 first:mt-0 group">
      {/* Time column (Left) */}
      <div className="w-24 md:w-32 flex-shrink-0 text-right pt-2">
        <div className="text-slate-800 font-bold text-sm">
          {format(time, 'HH:mm', { locale: vi })}
        </div>
        <div className="text-slate-400 text-xs mt-0.5">
          {format(time, 'dd/MM/yyyy')}
        </div>
      </div>

      {/* Node & Line (Middle) */}
      <div className="flex flex-col items-center flex-shrink-0 relative">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm ${config.color} text-white`}>
          <span className="text-sm">{config.icon}</span>
        </div>
        {!isLast && (
          <div className="w-0.5 bg-slate-100 absolute top-10 -bottom-6 left-1/2 transform -translate-x-1/2 group-last:hidden"></div>
        )}
      </div>

      {/* Content (Right) */}
      <div className="flex-1 bg-slate-50 hover:bg-slate-100 transition-colors duration-200 rounded-xl p-4 md:p-5 mb-6 border border-slate-100 shadow-sm">
        <h4 className="text-slate-800 font-bold text-base mb-2">{item.title}</h4>
        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
          {item.description}
        </p>
      </div>
    </div>
  );
};

const IncidentTimeline = ({ timeline, isLoading }) => {
  return (
    <div className="w-full bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
      <h2 className="text-gray-800 text-xl font-bold font-['Inter'] mb-8">
        Timeline sự cố
      </h2>
      
      <div className="relative">
        {isLoading ? (
          <>
            <SkeletonTimelineItem />
            <SkeletonTimelineItem />
            <SkeletonTimelineItem />
          </>
        ) : timeline && timeline.length > 0 ? (
          timeline.map((item, index) => (
            <TimelineItem 
              key={item.id} 
              item={item} 
              isLast={index === timeline.length - 1} 
            />
          ))
        ) : (
          <div className="text-center py-10 text-slate-500 italic">
            Chưa có ghi chú timeline nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentTimeline;
