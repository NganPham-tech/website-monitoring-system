import React from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ChartCard = ({ title, children, isLoading, half = false }) => (
    <div
        className={`bg-white rounded-xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] border border-white p-6 ${half ? '' : 'w-full'
            }`}
    >
        <h3 className="text-gray-700 text-xl font-bold font-sans mb-4">{title}</h3>
        {isLoading ? (
            <div className="bg-gradient-to-b from-gray-50 to-gray-200 rounded-lg h-48 flex items-center justify-center">
                <Skeleton className="h-5 w-80" />
            </div>
        ) : (
            <div className="bg-gradient-to-b from-gray-50 to-gray-200 rounded-lg p-3">{children}</div>
        )}
    </div>
);

const PIE_COLORS = ['#14B8A6', '#F43F5E', '#F59E0B', '#6366F1', '#10B981'];

const EmptyChart = () => (
    <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        Không có dữ liệu
    </div>
);

const ChartsContainer = ({ data, isLoading }) => {
    const uptimeTrend = data?.uptimeTrend ?? [];
    const responseTimeTrend = data?.responseTimeTrend ?? [];
    const incidentDistribution = data?.incidentDistribution ?? [];

    return (
        <div className="flex flex-col gap-6">
            {/* Row 1 – Full-width Uptime Line Chart */}
            <ChartCard title="Uptime Theo Thời Gian" isLoading={isLoading}>
                {uptimeTrend.length === 0 ? (
                    <EmptyChart />
                ) : (
                    <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={uptimeTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <YAxis
                                domain={[95, 100]}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickFormatter={(v) => `${v}%`}
                            />
                            <Tooltip
                                formatter={(v) => [`${v}%`, 'Uptime']}
                                contentStyle={{ borderRadius: '8px', fontSize: 13 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="uptime"
                                stroke="#14B8A6"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: '#14B8A6' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </ChartCard>

            {/* Row 2 – Two half-width charts */}
            <div className="grid grid-cols-2 gap-6">
                {/* Response Time Bar Chart */}
                <ChartCard title="Response Time" isLoading={isLoading} half>
                    {responseTimeTrend.length === 0 ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={responseTimeTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v) => `${v}ms`} />
                                <Tooltip
                                    formatter={(v, name) => [`${v} ms`, name === 'avg' ? 'Trung bình' : 'Max']}
                                    contentStyle={{ borderRadius: '8px', fontSize: 13 }}
                                />
                                <Legend
                                    formatter={(v) => (v === 'avg' ? 'Trung bình' : 'Max')}
                                    wrapperStyle={{ fontSize: 12 }}
                                />
                                <Bar dataKey="avg" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="max" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>

                {/* Incident Distribution Pie Chart */}
                <ChartCard title="Phân bố Sự cố" isLoading={isLoading} half>
                    {incidentDistribution.length === 0 ? (
                        <EmptyChart />
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={incidentDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {incidentDistribution.map((_, index) => (
                                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(v, name) => [v, name]}
                                    contentStyle={{ borderRadius: '8px', fontSize: 13 }}
                                />
                                <Legend wrapperStyle={{ fontSize: 12 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </ChartCard>
            </div>
        </div>
    );
};

export default ChartsContainer;
