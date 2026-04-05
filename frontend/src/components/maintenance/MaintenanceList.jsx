import React from 'react';
import { format } from 'date-fns';

const MaintenanceList = ({ maintenances }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'ongoing':
                return { bg: 'bg-[#0284c7]', text: 'Ongoing' }; // sky-600
            case 'completed':
                return { bg: 'bg-[#16a34a]', text: 'Completed' }; // green-600
            case 'scheduled':
            default:
                return { bg: 'bg-[#facc15]', text: 'Scheduled', textColor: 'text-black' }; // yellow-400
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy, h:mm a");
        } catch {
            return dateString;
        }
    };

    return (
        <div className="mb-12 overflow-x-auto">
            {/* Header Row */}
            <div className="grid grid-cols-5 gap-4 bg-slate-700 text-white rounded-t-[10px] p-6 text-2xl font-medium mb-4">
                <div>Monitor</div>
                <div>Start Time</div>
                <div>End Time</div>
                <div>Status</div>
                <div>Notes</div>
            </div>

            {/* List items */}
            <div className="space-y-4">
                {maintenances?.map((item) => {
                    const statusStyle = getStatusStyle(item.status);

                    return (
                        <div key={item.id} className="grid grid-cols-5 gap-4 bg-slate-700 text-white rounded-[10px] border border-white p-6 items-center text-xl font-normal hover:bg-slate-600 transition-colors">
                            <div className="break-words">{item.title}</div>
                            <div>{formatDate(item.startTime)}</div>
                            <div>{formatDate(item.endTime)}</div>
                            <div>
                                <span className={`${statusStyle.bg} ${statusStyle.textColor || 'text-white'} px-8 py-2 rounded-[10px] inline-block text-center min-w-[140px]`}>
                                    {statusStyle.text}
                                </span>
                            </div>
                            <div className="break-words max-w-[200px]">{item.notes}</div>
                        </div>
                    );
                })}

                {(!maintenances || maintenances.length === 0) && (
                    <div className="bg-slate-700 text-center text-white p-8 rounded-[10px] border border-white text-xl">
                        No scheduled maintenance available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaintenanceList;
