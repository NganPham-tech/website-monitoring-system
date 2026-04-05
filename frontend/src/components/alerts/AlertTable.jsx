import React from 'react';
import { Link } from 'react-router-dom';

const SeverityIcon = ({ severity }) => {
    if (severity === 'critical') {
        return (
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-600 border border-black flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xl">!</span>
                </div>
            </div>
        );
    }
    if (severity === 'warning') {
        return (
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center relative shadow-sm">
                    {/* the html has specific colors for warning too, wait, HTML uses #F8D7DA and #DC3545 for error maybe? Let's use red-600 here. Oh wait, warning is amber */}
                    <span className="text-white font-bold text-xl">!</span>
                </div>
            </div>
        );
    }
    if (severity === 'success') {
        return (
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-[#98F47E] flex items-center justify-center shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#28A745] border border-black flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
            </div>
        );
    }
    // info
    return (
        <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-[#D1ECF1] flex items-center justify-center shrink-0">
            <div className="w-12 h-12 rounded-full bg-[#66C5EA] border border-black flex items-center justify-center shadow-sm">
                <span className="text-white text-2xl font-serif italic">i</span>
            </div>
        </div>
    );
};

const AlertTable = ({ isLoading, alerts }) => {
    if (isLoading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-white border border-gray-300 rounded-xl p-6 h-[200px]">
                        <div className="flex gap-6 h-full items-center">
                            <div className="w-28 h-28 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-4">
                                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="flex gap-2">
                                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!alerts || alerts.length === 0) {
        return (
            <div className="bg-white border border-gray-300 rounded-xl p-16 text-center shadow-sm">
                <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
                    </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Không có cảnh báo</h3>
                <p className="text-gray-500">Không tìm thấy cảnh báo nào phù hợp với bộ lọc hiện tại.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {alerts.map((alert) => (
                <div key={alert.id} className="bg-white rounded-xl border border-gray-300 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-1 items-center gap-6">
                        <SeverityIcon severity={alert.severity} />
                        <div className="flex flex-col gap-1">
                            <h3 className="text-gray-900 text-xl font-medium">{alert.type}</h3>
                            <p className="text-[#0F6EC0] font-medium">{alert.monitorName}</p>
                            <p className="text-gray-500 text-base mt-2">{alert.message}</p>
                            <div className="flex flex-wrap gap-3 mt-3">
                                {alert.channels.map(channel => (
                                    <span key={channel} className="bg-blue-100 text-gray-800 px-4 py-1 rounded-lg text-sm font-medium border border-white">
                                        {channel}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-6 md:gap-14">
                        {/* formatted timestamp roughly like '15 phút', '1 giờ trước'. Since we use mock iso, let's just make a simple timeAgo or raw display */}
                        <span className="text-gray-400 font-medium whitespace-nowrap">
                            {new Date(alert.timestamp).toLocaleString('vi-VN', { timeStyle: 'short', dateStyle: 'short' })}
                        </span>
                        <Link
                            to={`/incidents/${alert.id}`}
                            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 rounded-lg px-6 py-2 text-sm font-medium transition-colors"
                        >
                            Chi tiết
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AlertTable;
