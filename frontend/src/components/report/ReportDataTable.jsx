import React from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const SkeletonRow = () => (
    <tr className="border-t border-gray-100">
        {Array.from({ length: 6 }).map((_, i) => (
            <td key={i} className="px-4 py-5">
                <Skeleton className="h-5 w-full" />
            </td>
        ))}
    </tr>
);

const UptimeBadge = ({ status, uptime }) => {
    const isUp = status === 'up';
    return (
        <span
            className={`inline-block w-44 text-center text-white text-sm font-semibold py-1 rounded-[49px] ${isUp ? 'bg-green-600' : 'bg-red-500'
                }`}
        >
            {uptime}%
        </span>
    );
};

const Sparkline = ({ history = [] }) => {
    const data = history.map((v, i) => ({ i, v }));
    return (
        <ResponsiveContainer width={120} height={40}>
            <LineChart data={data}>
                <Line
                    type="monotone"
                    dataKey="v"
                    stroke="#14B8A6"
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                />
                <Tooltip
                    formatter={(v) => [`${v} ms`]}
                    contentStyle={{ fontSize: 11, borderRadius: '6px', padding: '2px 6px' }}
                    itemStyle={{ color: '#374151' }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

const COLS = [
    { key: 'name', label: 'Monitor', className: 'text-left' },
    { key: 'uptime', label: 'Uptime', className: 'text-center' },
    { key: 'responseTime', label: 'Response Time TB', className: 'text-center' },
    { key: 'history', label: 'Trend', className: 'text-center' },
    { key: 'downtime', label: 'Downtime', className: 'text-center' },
    { key: 'incidents', label: 'Sự cố', className: 'text-center' },
];

const ReportDataTable = ({ data = [], isLoading }) => {
    return (
        <div className="bg-white rounded-xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] border border-white overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    {/* Header */}
                    <thead>
                        <tr className="bg-white border-b border-gray-100">
                            {COLS.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-4 py-5 text-black text-xl font-bold font-sans whitespace-nowrap ${col.className}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-16 text-gray-400 text-base">
                                    Không có dữ liệu cho kỳ này.
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr
                                    key={row.id ?? idx}
                                    className="border-t border-gray-100 hover:bg-slate-50 transition-colors"
                                >
                                    {/* Monitor name */}
                                    <td className="px-4 py-5 text-black text-xl font-bold font-sans whitespace-nowrap">
                                        {row.name}
                                    </td>

                                    {/* Uptime badge */}
                                    <td className="px-4 py-5 text-center">
                                        <UptimeBadge status={row.status} uptime={row.uptime} />
                                    </td>

                                    {/* Response Time */}
                                    <td className="px-4 py-5 text-center text-black text-xl font-bold font-sans">
                                        {row.responseTime} ms
                                    </td>

                                    {/* Sparkline */}
                                    <td className="px-4 py-5 text-center">
                                        <div className="flex justify-center">
                                            <Sparkline history={row.history} />
                                        </div>
                                    </td>

                                    {/* Downtime */}
                                    <td className="px-4 py-5 text-center text-black text-xl font-bold font-sans">
                                        {row.downtime}
                                    </td>

                                    {/* Incidents */}
                                    <td className="px-4 py-5 text-center text-black text-xl font-bold font-sans">
                                        {row.incidents}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportDataTable;
