import React from 'react';
import { Search } from 'lucide-react';

const StatusHeader = () => {
  return (
    <div className="w-full max-w-[1208px] bg-white p-12 mt-10 shadow-sm rounded-sm flex flex-col items-center justify-center relative overflow-hidden group">
      {/* Decorative pulse background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-3xl text-black font-['Inter'] drop-shadow-sm"><Search className="w-8 h-8"/></span>
        <h1 className="text-4xl font-extrabold text-indigo-900 font-['Inter'] uppercase tracking-widest tracking-[0.2em] animate-fade-in">
          UPTIME MONITOR
        </h1>
      </div>
      
      <div className="w-24 h-1 bg-indigo-600 mb-6 rounded-full"></div>

      <p className="text-3xl font-normal text-gray-700 font-['Inter'] tracking-wide">
        Trang trạng thái hệ thống
      </p>
      
      <div className="mt-8 flex gap-8">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Đang cập nhật trực tiếp (Mỗi 1 phút)
        </div>
      </div>
    </div>
  );
};

export default StatusHeader;
