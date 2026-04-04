import React from 'react';

// Skeleton shimmer block
const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

/**
 * @param {string}  icon           - Emoji icon string
 * @param {string}  label          - Card label
 * @param {string}  value          - Formatted display value (e.g. "99.8%", "245 ms")
 * @param {string}  valueClassName - Tailwind text color class for the value
 * @param {number}  delta          - Raw numeric delta (positive = went up, negative = went down)
 * @param {string}  deltaLabel     - Unit label for delta (e.g. "%", " ms", " sự cố")
 * @param {boolean} higherIsBetter - True for uptime; false for response time / downtime / incidents
 * @param {boolean} isLoading      - Show skeleton while fetching
 */
const StatCard = ({
    icon,
    label,
    value,
    valueClassName = 'text-gray-800',
    delta,
    deltaLabel = '',
    higherIsBetter = true,
    isLoading = false,
}) => {
    const hasTrend = delta !== undefined && delta !== null;
    const isUp = delta > 0;
    const isImprovement = higherIsBetter ? isUp : !isUp;
    const trendColor = isImprovement ? 'text-green-600' : 'text-red-500';
    const arrow = isUp ? '↑' : '↓';

    return (
        <div className="bg-white rounded-xl shadow-[0px_4px_16px_0px_rgba(0,0,0,0.25)] border border-white w-64 h-32 flex flex-col justify-between px-3 py-3 flex-shrink-0">
            {isLoading ? (
                <>
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-8 w-24 mt-2" />
                    <Skeleton className="h-3 w-40 mt-2" />
                </>
            ) : (
                <>
                    <p className="text-slate-500 text-sm font-normal font-sans">
                        {icon} {label}
                    </p>
                    <p className={`text-3xl font-normal font-['Inter'] ${valueClassName}`}>{value}</p>
                    {hasTrend && (
                        <p className={`text-sm font-normal font-sans ${trendColor}`}>
                            {arrow} {Math.abs(delta)}
                            {deltaLabel} so với kỳ trước
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default StatCard;
