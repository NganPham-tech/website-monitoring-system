import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Settings, Pause, CheckCircle2, XCircle } from 'lucide-react';

const MonitorCard = ({ monitor }) => {
  const navigate = useNavigate();
  const { id, name, url, frequency, lastCheck, uptime, responseTime, status, protocol } = monitor;

  const isOnline = status === 'Online';

  return (
    <div className="bg-white rounded-3xl border border-gray-50 shadow-sm p-8 mb-6 transition-all duration-300 hover:shadow-md group">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Status Icon & Identity */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          <div className={`p-1 rounded-lg ${isOnline ? 'text-[#00C853]' : 'text-[#FF1744]'}`}>
            {isOnline ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
          </div>
          <div className="min-w-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-1 truncate">{name}</h3>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#00BFA5] text-sm font-medium hover:underline truncate block"
            >
              {url}
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-4 flex-[2]">
          <div className="flex flex-col">
            <span className="text-[#80CBC4] text-[10px] font-bold uppercase tracking-wider mb-1">Uptime</span>
            <span className="text-[#00C853] text-lg font-bold">{uptime}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#80CBC4] text-[10px] font-bold uppercase tracking-wider mb-1">Response Time</span>
            <span className="text-gray-900 text-lg font-bold">{responseTime}ms</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#80CBC4] text-[10px] font-bold uppercase tracking-wider mb-1">Kiểm tra cuối</span>
            <span className="text-gray-900 text-lg font-bold">
              {lastCheck ? formatDistanceToNow(new Date(lastCheck), { addSuffix: true, locale: vi }) : 'Chưa check'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#80CBC4] text-[10px] font-bold uppercase tracking-wider mb-1">Tần suất</span>
            <span className="text-gray-900 text-lg font-bold">{frequency} phút</span>
          </div>
        </div>

        {/* Actions & Protocol Tag */}
        <div className="flex flex-col items-end gap-4 min-w-[180px]">
          <div className="px-4 py-1 bg-[#E0F2F1] text-[#00BFA5] rounded-lg text-xs font-bold border border-[#B2DFDB]">
            {protocol || 'HTTP'}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/monitors/${id}`)}
              className="px-8 py-2 bg-[#00BFA5] text-white rounded-lg font-bold text-sm hover:bg-[#00897B] transition-colors shadow-sm"
            >
              Chi tiết
            </button>
            <button className="p-2 bg-[#E0F2F1] text-gray-400 rounded-lg hover:text-gray-600 transition-colors">
              <Settings size={20} />
            </button>
            <button className="p-2 bg-[#E0F2F1] text-gray-400 rounded-lg hover:text-gray-600 transition-colors">
              <Pause size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MonitorCard;
