import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const IncidentTimelineItem = ({ incident }) => {
  // incident: { id, title, description, status, createdAt, color }
  // status: 'investigating' | 'resolved' | 'identified' | 'monitoring'
  
  const getSidebarColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-600';
      case 'investigating': return 'bg-red-500';
      case 'identified': return 'bg-yellow-500';
      case 'monitoring': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'resolved': return 'Đã khắc phục';
      case 'investigating': return 'Đang điều tra';
      case 'identified': return 'Đã xác nhận';
      case 'monitoring': return 'Đang theo dõi';
      default: return 'Gặp sự cố';
    }
  };

  return (
    <div className="flex mb-8 items-start relative">
      <div className={`w-1.5 self-stretch ${getSidebarColor(incident.status)} rounded-sm mr-4`}></div>
      <div className="flex-1 bg-gray-50 border border-gray-100 p-6 rounded-sm shadow-sm transition-all hover:shadow-md cursor-pointer">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xl font-normal text-black font-['Inter']">{incident.title}</h4>
          <span className="text-xs text-gray-400 font-['Inter']">
            {format(new Date(incident.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
          </span>
        </div>
        <div className="text-gray-600 font-['Inter'] mb-3">
            <span className="font-bold mr-2">{getStatusText(incident.status)}:</span>
            {incident.description}
        </div>
      </div>
    </div>
  );
};

const IncidentTimeline = ({ incidents }) => {
  // Sort by date descending
  const sortedIncidents = [...incidents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="w-full max-w-[1208px] bg-white p-12 mt-10 shadow-sm rounded-sm">
      <h3 className="text-xs font-normal text-black font-['Inter'] uppercase mb-10 tracking-widest border-b pb-4">
        SỰ CỐ GẦN ĐÂY
      </h3>
      
      {sortedIncidents.length > 0 ? (
        sortedIncidents.map((incident) => (
          <IncidentTimelineItem key={incident.id} incident={incident} />
        ))
      ) : (
        <div className="text-gray-400 text-sm italic font-['Inter'] text-center py-10">
          Không có sự cố nào được ghi nhận trong 14 ngày qua.
        </div>
      )}
    </div>
  );
};

export default IncidentTimeline;
