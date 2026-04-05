import React from 'react';
import { differenceInMinutes, startOfDay } from 'date-fns';

const TimelineGanttChart = ({ maintenances }) => {
    const today = startOfDay(new Date());
    const maxMinutes = 48 * 60; // 48 hours window

    const calculatePosition = (start, end) => {
        const sDate = new Date(start);
        const eDate = new Date(end);

        let startMin = differenceInMinutes(sDate, today);
        let durationMin = differenceInMinutes(eDate, sDate);

        if (startMin < 0) {
            durationMin += startMin;
            startMin = 0;
        }
        if (startMin + durationMin > maxMinutes) {
            durationMin = maxMinutes - startMin;
        }

        if (startMin >= maxMinutes || startMin + durationMin <= 0) return null;

        const left = (startMin / maxMinutes) * 100;
        const width = (durationMin / maxMinutes) * 100;

        return { left: `${Math.max(0, left)}%`, width: `${Math.max(0, width)}%` };
    };

    const hoursMark = [];
    for (let i = 0; i <= 48; i += 4) {
        let label = '';
        const hr = i % 24;
        if (hr === 0) label = '12 AM';
        else if (hr < 12) label = `${hr} AM`;
        else if (hr === 12) label = '12 PM';
        else label = `${hr - 12} PM`;
        hoursMark.push({ percent: (i / 48) * 100, label });
    }

    const blockColors = ['bg-[#facc15]', 'bg-[#0ea5e9]', 'bg-[#64748b]', 'bg-[#22c55e]']; // matches design aesthetics

    return (
        <div className="bg-slate-700 border border-white rounded-[10px] p-6 lg:p-12 overflow-x-auto relative">
            <h2 className="text-white text-3xl font-medium mb-16">Maintenance Timeline</h2>

            <div className="relative mt-8 min-w-[800px] h-[500px]">
                {/* Timeline Grid Boundary */}
                <div className="absolute top-0 left-0 w-full h-[400px] rounded-[5px] border border-purple-500 overflow-hidden flex">
                    <div className="w-1/2 h-full border-r border-white/30 relative">
                        <div className="absolute -top-12 w-full text-center text-white text-3xl">Today</div>
                    </div>
                    <div className="w-1/2 h-full relative">
                        <div className="absolute -top-12 w-full text-center text-white text-3xl">Tomorrow</div>
                    </div>
                </div>

                <div className="absolute top-[400px] left-0 w-full h-8 border-t border-white"></div>
                {/* Time markers */}
                <div className="absolute top-[400px] left-0 w-full h-full">
                    {hoursMark.map((mark, i) => (
                        <div key={i} className="absolute h-[20px] border-l border-white" style={{ left: `${mark.percent}%` }}>
                            <div className="absolute top-6 -translate-x-1/2 text-white text-xl whitespace-nowrap font-medium">{mark.label}</div>
                        </div>
                    ))}
                </div>

                {/* Maintenance Blocks */}
                <div className="absolute top-0 left-0 w-full h-[400px] flex flex-col justify-around py-8">
                    {maintenances?.map((item, index) => {
                        const pos = calculatePosition(item.startTime, item.endTime);
                        if (!pos) return null;
                        const colorClass = blockColors[index % blockColors.length];

                        return (
                            <div key={item.id} className="relative h-20 md:h-28 group w-full">
                                <div
                                    className={`absolute h-full rounded-[20px] shadow-sm flex items-center justify-center cursor-pointer hover:brightness-110 transition-all ${colorClass}`}
                                    style={{ left: pos.left, width: pos.width }}
                                >
                                    <span className={`text-xl md:text-3xl font-medium px-4 truncate ${colorClass === 'bg-[#facc15]' ? 'text-white' : 'text-white'}`}>{item.title}</span>
                                    {/* Tooltip */}
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap text-lg pointer-events-none">
                                        {item.title} <br /> {new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TimelineGanttChart;
