import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Globe, Clock, Activity, BarChart, ExternalLink, ChevronRight } from 'lucide-react';

const MonitorCard = ({ monitor }) => {
  const navigate = useNavigate();
  const { id, name, url, frequency, lastCheck, uptime, responseTime, status } = monitor;

  // Status mapping
  const statusStyles = {
    Online: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      beacon: 'bg-emerald-500',
    },
    Offline: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      beacon: 'bg-rose-500',
    },
    Warning: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      beacon: 'bg-amber-500',
    }
  };

  const style = statusStyles[status] || statusStyles.Warning;

  return (
    <div className={`group bg-white rounded-3xl border-[3px] ${style.border} p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden`}>
      {/* Beacon background effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${style.bg} rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 blur-2xl group-hover:scale-125 transition-transform`}></div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Status Beacon & Title */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className={`w-4 h-4 rounded-full ${style.beacon}`}></div>
              <div className={`absolute inset-0 w-4 h-4 rounded-full ${style.beacon} animate-ping`}></div>
            </div>
            <span className={`text-sm font-bold uppercase tracking-wider ${style.text}`}>
              {status}
            </span>
          </div>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-gray-400 hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={18} />
          </a>
        </div>

        {/* Website Name & URL */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {name}
          </h3>
          <div className="flex items-center gap-2 text-gray-500">
            <Globe size={14} />
            <span className="text-sm font-medium truncate max-w-[200px]">{url}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 flex-1">
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Activity size={14} />
              <span className="text-xs font-bold uppercase tracking-tighter">Uptime</span>
            </div>
            <div className="text-lg font-bold text-gray-800">{uptime}%</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <BarChart size={14} />
              <span className="text-xs font-bold uppercase tracking-tighter">Response</span>
            </div>
            <div className="text-lg font-bold text-gray-800">{responseTime}ms</div>
          </div>
        </div>

        {/* Footer: Meta Info & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gray-400">
              <Clock size={12} />
              <span className="text-xs font-medium">
                Mỗi {frequency}p • {lastCheck ? formatDistanceToNow(new Date(lastCheck), { addSuffix: true, locale: vi }) : 'Chưa check'}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => navigate(`/monitors/${id}`)}
            className={`flex items-center gap-1 py-2 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${style.text} ${style.bg} hover:brightness-95`}
          >
            Chi tiết
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonitorCard;
