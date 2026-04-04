import React from 'react';

/**
 * TeamStatCard
 * White card hiển thị 1 chỉ số nhân sự (số to + nhãn phía dưới).
 * Khớp với thiết kế: bg-white rounded-xl shadow, số text-4xl, nhãn text-xl.
 */
const TeamStatCard = ({ value, label, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] border border-white w-64 h-32 flex flex-col justify-center items-center gap-2 animate-pulse">
                <div className="h-10 w-12 bg-gray-200 rounded" />
                <div className="h-5 w-28 bg-gray-200 rounded" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] border border-white w-64 h-32 flex flex-col justify-center items-center gap-1">
            <span className="text-4xl font-bold text-black font-['Segoe_UI']">{value}</span>
            <span className="text-xl font-bold text-black font-['Segoe_UI'] text-center leading-tight px-2">
                {label}
            </span>
        </div>
    );
};

export default TeamStatCard;
