/**
 * reportTimeHelper.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Tách toàn bộ logic xử lý thời gian ra khỏi Service/Controller.
 * Dependency duy nhất: date-fns (đã có trong package.json).
 */

const { subHours, subDays } = require('date-fns');

// ─── Config map ───────────────────────────────────────────────────────────────
// bucketUnit: đơn vị bucket dùng để group trong MongoDB $dateToString
// bucketFormat: format string cho $dateToString
// sparklinePoints: số data points tối đa cho sparkline mini-chart
const RANGE_CONFIG = {
    '24h': { hours: 24, bucketUnit: 'hour', bucketFormat: '%Y-%m-%dT%H:00', sparklinePoints: 12 },
    '7d': { days: 7, bucketUnit: 'day', bucketFormat: '%Y-%m-%d', sparklinePoints: 7 },
    '30d': { days: 30, bucketUnit: 'day', bucketFormat: '%Y-%m-%d', sparklinePoints: 15 },
    '90d': { days: 90, bucketUnit: 'day', bucketFormat: '%Y-%m-%d', sparklinePoints: 18 },
};

/**
 * Chuẩn hóa range string (không phân biệt hoa thường).
 * Fallback về '30d' nếu range không hợp lệ.
 */
const normalizeRange = (range) => {
    const key = (range || '30d').toLowerCase();
    return RANGE_CONFIG[key] ? key : '30d';
};

/**
 * Trả về { currentStart, currentEnd, previousStart, previousEnd }
 * cho một range string.
 *
 * Ví dụ range='7d', now=T:
 *   currentPeriod  → [T-7d, T)
 *   previousPeriod → [T-14d, T-7d)
 */
const getTimePeriods = (range) => {
    const key = normalizeRange(range);
    const cfg = RANGE_CONFIG[key];
    const now = new Date();

    const currentStart = cfg.hours ? subHours(now, cfg.hours) : subDays(now, cfg.days);
    const duration = now - currentStart; // ms

    return {
        currentStart,
        currentEnd: now,
        previousStart: new Date(currentStart.getTime() - duration),
        previousEnd: new Date(currentStart),
    };
};

/**
 * Trả về MongoDB $dateToString expression dùng trong $group stage
 * để phân bucket theo giờ hoặc ngày.
 */
const getBucketExpression = (range) => {
    const key = normalizeRange(range);
    return {
        $dateToString: { format: RANGE_CONFIG[key].bucketFormat, date: '$timestamp' },
    };
};

/**
 * Số data points tối đa cho sparkline mini-chart mỗi monitor.
 */
const getSparklinePoints = (range) => RANGE_CONFIG[normalizeRange(range)].sparklinePoints;

/**
 * Chuyển downtime (phút) → chuỗi người đọc: "2h 15m" / "45m" / "0m"
 */
const formatDowntime = (minutes) => {
    if (!minutes || minutes < 1) return '0m';
    const rounded = Math.round(minutes);
    if (rounded < 60) return `${rounded}m`;
    const h = Math.floor(rounded / 60);
    const m = rounded % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

/**
 * Tính delta và isPositive flag.
 *
 * @param {number}  current
 * @param {number}  previous
 * @param {boolean} higherIsBetter  true  = uptime (↑ tốt)
 *                                  false = responseTime, downtime, incidents (↑ xấu)
 */
const computeTrend = (current, previous, higherIsBetter = true) => {
    const delta = parseFloat((current - (previous ?? current)).toFixed(2));
    const isPositive = higherIsBetter ? delta >= 0 : delta <= 0;
    return { delta: Math.abs(delta), isPositive };
};

/**
 * Tính uptime% và avgResponseTime từ kết quả $group aggregate của PingLog.
 * Trả về giá trị mặc định nếu không có log.
 */
const extractPingMetrics = (aggResult) => {
    if (!aggResult || aggResult.length === 0 || aggResult[0].totalChecks === 0) {
        return { uptime: 100, avgResponseTime: 0, offlineCount: 0, totalChecks: 0 };
    }
    const { totalChecks, onlineCount, totalResponseTime } = aggResult[0];
    return {
        uptime: parseFloat(((onlineCount / totalChecks) * 100).toFixed(2)),
        avgResponseTime: Math.round(totalResponseTime / totalChecks),
        offlineCount: totalChecks - onlineCount,
        totalChecks,
    };
};

module.exports = {
    normalizeRange,
    getTimePeriods,
    getBucketExpression,
    getSparklinePoints,
    formatDowntime,
    computeTrend,
    extractPingMetrics,
};
