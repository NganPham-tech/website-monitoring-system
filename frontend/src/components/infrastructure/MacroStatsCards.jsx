import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMacroStats } from '../../services/infraService';

// ─── Card configuration ───────────────────────────────────────────────────────

const CARD_CONFIG = [
    {
        key: 'activeUsers',
        icon: '👥',
        label: 'Users Active (30d)',
        defaultValue: '5,234',
        defaultChange: '+12.5%',
        defaultDirection: 'up',
        defaultSub: '142 đăng ký mới hôm nay',
    },
    {
        key: 'mrr',
        icon: '💰',
        label: 'MRR (Doanh thu)',
        defaultValue: '$12,450',
        defaultChange: '+8.2%',
        defaultDirection: 'up',
        defaultSub: 'Dự kiến tháng: $14,200',
    },
    {
        key: 'monitors',
        icon: '🎯',
        label: 'Monitors Đang chạy',
        defaultValue: '45,120',
        defaultChange: '+5.1%',
        defaultDirection: 'up',
        defaultSub: '~8,500 requests / giây',
    },
    {
        key: 'systemLoad',
        icon: '🔥',
        label: 'System Load (Core)',
        defaultValue: '42%',
        defaultChange: 'Ổn định',
        defaultDirection: 'stable',
        defaultSub: 'RAM: 18GB / 32GB',
    },
];

const directionMeta = (direction) => {
    if (direction === 'up') return { arrow: '↗', color: 'text-green-600' };
    if (direction === 'down') return { arrow: '↘', color: 'text-red-500' };
    return { arrow: '↘', color: 'text-gray-500' };
};

// ─── Single card ──────────────────────────────────────────────────────────────

const MacroStatCard = ({ config, data }) => {
    const value = data?.value ?? config.defaultValue;
    const change = data?.change ?? config.defaultChange;
    const direction = data?.direction ?? config.defaultDirection;
    const sub = data?.sub ?? config.defaultSub;
    const { arrow, color } = directionMeta(direction);

    return (
        <div className="mix-blend-hard-light bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-black/20 overflow-hidden flex-1 min-w-[280px] h-44 p-4 flex flex-col justify-between">
            {/* Title row */}
            <div className="text-xl font-normal font-['Segoe_UI'] text-black leading-snug">
                {config.icon}{' '}
                {config.label}
                <span className={`ml-1 text-base ${color}`}>
                    {arrow} {change}
                </span>
            </div>

            {/* Primary value */}
            <div className="text-2xl font-normal font-['Segoe_UI'] text-black">
                {value}
            </div>

            {/* Sub-label */}
            <div className="text-xl font-normal font-['Segoe_UI'] text-black">
                {sub}
            </div>
        </div>
    );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const MacroStatsCardsSkeleton = () => (
    <div className="flex gap-4 flex-wrap">
        {Array.from({ length: 4 }).map((_, i) => (
            <div
                key={i}
                className="flex-1 min-w-[280px] h-44 bg-white rounded-[20px] animate-pulse shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-black/20"
            />
        ))}
    </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const MacroStatsCards = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['infra-macro-stats'],
        queryFn: getMacroStats,
        refetchInterval: 30_000,
    });

    if (isLoading) return <MacroStatsCardsSkeleton />;

    return (
        <div className="flex gap-4 flex-wrap">
            {CARD_CONFIG.map((config) => (
                <MacroStatCard
                    key={config.key}
                    config={config}
                    data={data?.[config.key]}
                />
            ))}
        </div>
    );
};

export default MacroStatsCards;
