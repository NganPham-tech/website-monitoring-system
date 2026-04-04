import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TimeFilter from '../components/report/TimeFilter';
import StatCard from '../components/report/StatCard';
import ChartsContainer from '../components/report/ChartsContainer';
import ReportDataTable from '../components/report/ReportDataTable';
import { getSummary, getCharts, getMonitorsDetail } from '../services/reportService';

const STAT_CONFIGS = [
    {
        key: 'uptime',
        icon: '📊',
        label: 'Uptime trung bình',
        valueClassName: 'text-green-600',
        deltaLabel: '%',
        higherIsBetter: true,
        format: (v) => `${v}%`,
    },
    {
        key: 'responseTime',
        icon: '📊',
        label: 'thời gian phản hồi',
        valueClassName: 'text-red-500',
        deltaLabel: ' ms',
        higherIsBetter: false,
        format: (v) => `${v} ms`,
    },
    {
        key: 'incidents',
        icon: '📊',
        label: 'tổng sự cố',
        valueClassName: 'text-sky-400',
        deltaLabel: ' sự cố',
        higherIsBetter: false,
        format: (v) => `${v}`,
    },
    {
        key: 'downtime',
        icon: '📊',
        label: 'tổng downtime',
        valueClassName: 'text-red-500',
        deltaLabel: ' phút',
        higherIsBetter: false,
        format: (v) => (typeof v === 'string' ? v : `${v} phút`),
    },
];

const AnalyticsReport = () => {
    const [range, setRange] = useState('30D');

    const {
        data: summary,
        isLoading: loadingSummary,
    } = useQuery({
        queryKey: ['report-summary', range],
        queryFn: () => getSummary(range),
        staleTime: 60_000,
    });

    const {
        data: charts,
        isLoading: loadingCharts,
    } = useQuery({
        queryKey: ['report-charts', range],
        queryFn: () => getCharts(range),
        staleTime: 60_000,
    });

    const {
        data: monitors,
        isLoading: loadingMonitors,
    } = useQuery({
        queryKey: ['report-monitors-detail', range],
        queryFn: () => getMonitorsDetail(range),
        staleTime: 60_000,
    });

    return (
        <div className="min-h-screen bg-slate-100/20 px-8 py-6 flex flex-col gap-6">

            {/* ── Header: Title + Time Filter ──────────────────────────────── */}
            <div className="flex items-center justify-between">
                <h1 className="text-gray-700 text-3xl font-bold font-sans">Báo cáo & Analytics</h1>
                <TimeFilter activeRange={range} onChange={setRange} />
            </div>

            {/* ── Stat Cards Row ────────────────────────────────────────────── */}
            <div className="flex gap-6 flex-wrap">
                {STAT_CONFIGS.map((cfg) => {
                    const metric = summary?.[cfg.key];
                    return (
                        <StatCard
                            key={cfg.key}
                            icon={cfg.icon}
                            label={cfg.label}
                            value={metric ? cfg.format(metric.value) : '—'}
                            valueClassName={cfg.valueClassName}
                            delta={metric?.delta}
                            deltaLabel={cfg.deltaLabel}
                            higherIsBetter={cfg.higherIsBetter}
                            isLoading={loadingSummary}
                        />
                    );
                })}
            </div>

            {/* ── Charts ───────────────────────────────────────────────────── */}
            <ChartsContainer data={charts} isLoading={loadingCharts} />

            {/* ── Data Table ───────────────────────────────────────────────── */}
            <ReportDataTable data={monitors ?? []} isLoading={loadingMonitors} />

        </div>
    );
};

export default AnalyticsReport;
