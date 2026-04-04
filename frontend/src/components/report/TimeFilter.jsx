import React from 'react';

const RANGES = ['24h', '7D', '30D', '90D'];

const TimeFilter = ({ activeRange, onChange }) => {
    return (
        <div className="flex items-center gap-2">
            {RANGES.map((range) => (
                <button
                    key={range}
                    onClick={() => onChange(range)}
                    className={`w-36 h-11 rounded-md text-xl font-normal transition-all duration-200 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)] border border-slate-200/40 cursor-pointer
            ${activeRange === range
                            ? 'bg-teal-500 text-white border-teal-500'
                            : 'bg-white text-black hover:bg-gray-50'
                        }`}
                >
                    {range}
                </button>
            ))}
        </div>
    );
};

export default TimeFilter;
