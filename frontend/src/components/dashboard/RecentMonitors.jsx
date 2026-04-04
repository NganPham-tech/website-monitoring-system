import React from 'react';
import { Link } from 'react-router-dom';

const RecentMonitors = ({ monitors, isLoading }) => {
  return (
    <div className="w-full bg-white rounded-[10px] p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="text-gray-700 text-2xl font-bold font-['Inter']">
          Monitors gần đây
        </div>
        <Link 
          to="/add-monitor"
          className="px-7 py-3 bg-teal-500 hover:bg-teal-600 transition-colors rounded-[10px] flex justify-center items-center"
        >
          <span className="text-black text-xl font-bold font-['Inter']">Thêm Monitor</span>
        </Link>
      </div>

      {/* Monitors List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          // Loading states
          [1, 2, 3].map((item) => (
            <div key={item} className="w-full h-20 px-5 py-4 bg-white rounded-[10px] outline outline-1 outline-gray-200 shadow-sm animate-pulse flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  <div className="flex flex-col gap-2">
                     <div className="w-32 h-5 bg-slate-200 rounded"></div>
                     <div className="w-48 h-4 bg-slate-200 rounded"></div>
                  </div>
               </div>
               <div className="flex gap-12">
                  <div className="w-24 h-5 bg-slate-200 rounded"></div>
                  <div className="w-24 h-5 bg-slate-200 rounded"></div>
               </div>
            </div>
          ))
        ) : (!monitors || monitors.length === 0) ? (
          <div className="w-full p-8 text-center text-gray-500 font-['Inter'] border border-gray-200 rounded-[10px] bg-slate-50">
            Chưa có monitor nào. Hãy thêm một monitor mới!
          </div>
        ) : (
          monitors.map((monitor) => {
            const isOnline = monitor.status === 'online';
            return (
              <div 
                key={monitor.id}
                className="w-full px-5 py-4 bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-black/10 hover:outline-teal-500 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-4">
                    <div 
                      className={`w-3 h-3 rounded-md shadow-[0px_0px_10px_0px_] ${
                        isOnline 
                          ? 'bg-green-600 shadow-green-600/50' 
                          : 'bg-red-600 shadow-red-600/50'
                      }`}
                    ></div>
                    <div className="flex flex-col">
                      <div className="text-black text-xl font-bold font-['Inter']">
                        {monitor.name}
                      </div>
                      <div className="text-gray-600 text-lg font-normal font-['Inter']">
                        {monitor.url}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap md:justify-end items-center gap-6 md:gap-12 ml-7 sm:ml-0">
                  <div className="text-black text-lg font-normal font-['Inter']">
                    Uptime: {monitor.uptimePercentage || 0}%
                  </div>
                  <div className="text-black text-lg font-normal font-['Inter']">
                    Response: {monitor.avgResponseTime || 0}ms
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentMonitors;
