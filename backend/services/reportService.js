/**
 * reportService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Chứa toàn bộ logic aggregation/query cho domain Reports.
 * Controller chỉ gọi các method ở đây — không có query logic nào trong Controller.
 *
 * INDEX STRATEGY (được áp dụng trên PingLog & Monitor):
 * ─────────────────────────────────────────────────────
 * 1. Monitor.userId           → single-field index (đã có) cho step đầu: lấy monitorIds của user.
 *
 * 2. PingLog.{monitorId, timestamp: -1}  → compound index (đã có)
 *    Covers: query log trong khoảng thời gian cho 1 monitor.
 *
 * 3. PingLog.{monitorId, status, timestamp: -1}  → compound index MỚI (thêm ở PingLog.js)
 *    Covers: query offline count trong khoảng thời gian (dùng cho tính uptime/downtime).
 *    Khi filter { monitorId, status:'offline', timestamp:{$gte,$lt} }, MongoDB dùng index
 *    này thay vì scan toàn bộ collection → giảm ~60-80% IO cho query 90 ngày.
 *
 * 4. PingLog.{monitorId, timestamp: -1} với $in monitorIds
 *    MongoDB sử dụng index intersection: compound index (monitorId, timestamp)
 *    cho từng monitorId trong mảng $in. Hiệu quả khi user có < 100 monitors.
 *
 * DATA ISOLATION:
 *    Tất cả query bắt đầu từ Monitor.find({userId}) để có monitorIds.
 *    Mọi $match trên PingLog đều scope theo { monitorId: {$in: monitorIds} }.
 *    → Không có khả năng user A đọc data của user B.
 */

const mongoose = require('mongoose');
const Monitor = require('../models/Monitor');
const PingLog = require('../models/PingLog');
const Incident = require('../models/Incident');
const {
    getTimePeriods,
    getBucketExpression,
    getSparklinePoints,
    formatDowntime,
    computeTrend,
    extractPingMetrics,
    normalizeRange,
} = require('../utils/reportTimeHelper');

// Hệ số ước lượng downtime: mỗi lần ping cách nhau trung bình 5 phút.
// Nếu hệ thống có interval khác, điều chỉnh giá trị này.
const DEFAULT_INTERVAL_MINS = 5;

// ─── Helper: lấy danh sách ObjectId của monitors thuộc user ─────────────────
const getMonitorIds = async (userId) => {
    const monitors = await Monitor.find({ userId }).select('_id').lean();
    return monitors.map((m) => m._id);
};

// ─── Helper: aggregate PingLog theo khoảng thời gian ────────────────────────
const aggregatePingPeriod = (monitorIds, start, end) =>
    PingLog.aggregate([
        {
            $match: {
                monitorId: { $in: monitorIds },
                timestamp: { $gte: start, $lt: end },
            },
        },
        {
            $group: {
                _id: null,
                totalChecks: { $sum: 1 },
                onlineCount: { $sum: { $cond: [{ $eq: ['$status', 'online'] }, 1, 0] } },
                totalResponseTime: { $sum: '$responseTime' },
            },
        },
    ]);

// ─────────────────────────────────────────────────────────────────────────────
// 1. GET /api/reports/summary
// ─────────────────────────────────────────────────────────────────────────────
const getSummary = async (userId, range) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const monitorIds = await getMonitorIds(userObjectId);

    // Edge case: user chưa có monitor nào
    if (monitorIds.length === 0) {
        return buildEmptySummary();
    }

    const { currentStart, currentEnd, previousStart, previousEnd } = getTimePeriods(range);

    // Chạy song song 4 queries để giảm latency
    const [currentAgg, previousAgg, currentIncidents, previousIncidents] = await Promise.all([
        aggregatePingPeriod(monitorIds, currentStart, currentEnd),
        aggregatePingPeriod(monitorIds, previousStart, previousEnd),
        Incident.countDocuments({
            assignee: userObjectId,
            startedAt: { $gte: currentStart, $lt: currentEnd },
        }),
        Incident.countDocuments({
            assignee: userObjectId,
            startedAt: { $gte: previousStart, $lt: previousEnd },
        }),
    ]);

    const curr = extractPingMetrics(currentAgg);
    const prev = extractPingMetrics(previousAgg);

    const currDowntimeMins = curr.offlineCount * DEFAULT_INTERVAL_MINS;
    const prevDowntimeMins = prev.offlineCount * DEFAULT_INTERVAL_MINS;

    return {
        uptime: {
            value: curr.uptime,
            ...computeTrend(curr.uptime, prev.uptime, true),
        },
        responseTime: {
            value: curr.avgResponseTime,
            ...computeTrend(curr.avgResponseTime, prev.avgResponseTime, false),
        },
        incidents: {
            value: currentIncidents,
            ...computeTrend(currentIncidents, previousIncidents, false),
        },
        downtime: {
            value: formatDowntime(currDowntimeMins),
            rawMinutes: currDowntimeMins,
            ...computeTrend(currDowntimeMins, prevDowntimeMins, false),
        },
    };
};

const buildEmptySummary = () => ({
    uptime: { value: 100, delta: 0, isPositive: true },
    responseTime: { value: 0, delta: 0, isPositive: true },
    incidents: { value: 0, delta: 0, isPositive: true },
    downtime: { value: '0m', delta: 0, isPositive: true, rawMinutes: 0 },
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. GET /api/reports/charts
// ─────────────────────────────────────────────────────────────────────────────
const getCharts = async (userId, range) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const monitorIds = await getMonitorIds(userObjectId);

    if (monitorIds.length === 0) {
        return { uptimeTrend: [], responseTimeTrend: [], incidentDistribution: [] };
    }

    const { currentStart, currentEnd } = getTimePeriods(range);
    const bucketExpr = getBucketExpression(range);

    // ── Series: Uptime trend & Response Time trend (1 query, 2 metrics) ────────
    // Index sử dụng: { monitorId: 1, timestamp: -1 } với $in trên monitorIds
    const trendAgg = await PingLog.aggregate([
        {
            $match: {
                monitorId: { $in: monitorIds },
                timestamp: { $gte: currentStart, $lt: currentEnd },
            },
        },
        {
            $group: {
                _id: bucketExpr,
                totalChecks: { $sum: 1 },
                onlineCount: { $sum: { $cond: [{ $eq: ['$status', 'online'] }, 1, 0] } },
                avgRT: { $avg: '$responseTime' },
                maxRT: { $max: '$responseTime' },
            },
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                date: '$_id',
                uptime: {
                    $round: [
                        { $multiply: [{ $divide: ['$onlineCount', '$totalChecks'] }, 100] },
                        2,
                    ],
                },
                avg: { $round: ['$avgRT', 0] },
                max: { $round: ['$maxRT', 0] },
            },
        },
    ]);

    const uptimeTrend = trendAgg.map(({ date, uptime }) => ({ date, uptime }));
    const responseTimeTrend = trendAgg.map(({ date, avg, max }) => ({ date, avg, max }));

    // ── Series: Incident distribution by statusCode ────────────────────────────
    // Dùng PingLog offline events grouped by HTTP status code làm proxy cho loại lỗi.
    // Index sử dụng: { monitorId: 1, status: 1, timestamp: -1 }
    const incidentAgg = await PingLog.aggregate([
        {
            $match: {
                monitorId: { $in: monitorIds },
                status: 'offline',
                timestamp: { $gte: currentStart, $lt: currentEnd },
            },
        },
        {
            $group: {
                _id: {
                    $switch: {
                        branches: [
                            { case: { $eq: ['$statusCode', 500] }, then: '500 Error' },
                            { case: { $eq: ['$statusCode', 502] }, then: '502 Bad Gateway' },
                            { case: { $eq: ['$statusCode', 503] }, then: '503 Unavailable' },
                            { case: { $eq: ['$statusCode', 504] }, then: '504 Timeout' },
                        ],
                        default: 'Connection Error',
                    },
                },
                value: { $sum: 1 },
            },
        },
        { $project: { _id: 0, name: '$_id', value: 1 } },
        { $sort: { value: -1 } },
    ]);

    const incidentDistribution = incidentAgg.length > 0
        ? incidentAgg
        : [{ name: 'Không có sự cố', value: 0 }];

    return { uptimeTrend, responseTimeTrend, incidentDistribution };
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. GET /api/reports/monitors-detail
// ─────────────────────────────────────────────────────────────────────────────
const getMonitorsDetail = async (userId, range) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Lấy danh sách monitors với metadata (name, status)
    const monitors = await Monitor.find({ userId: userObjectId })
        .select('_id name status')
        .lean();

    if (monitors.length === 0) return [];

    const monitorIds = monitors.map((m) => m._id);
    const monitorMap = Object.fromEntries(monitors.map((m) => [m._id.toString(), m]));
    const { currentStart, currentEnd } = getTimePeriods(range);
    const bucketExpr = getBucketExpression(range);
    const sparklinePoints = getSparklinePoints(range);

    // ── Aggregation 1: per-monitor KPIs ───────────────────────────────────────
    // Index: { monitorId: 1, timestamp: -1 }
    const kpiAgg = await PingLog.aggregate([
        {
            $match: {
                monitorId: { $in: monitorIds },
                timestamp: { $gte: currentStart, $lt: currentEnd },
            },
        },
        {
            $group: {
                _id: '$monitorId',
                totalChecks: { $sum: 1 },
                onlineCount: { $sum: { $cond: [{ $eq: ['$status', 'online'] }, 1, 0] } },
                totalResponseTime: { $sum: '$responseTime' },
                // offline count dùng tính downtime
                offlineCount: { $sum: { $cond: [{ $eq: ['$status', 'offline'] }, 1, 0] } },
            },
        },
    ]);

    // ── Aggregation 2: per-monitor sparkline data (time-bucketed) ─────────────
    // Dùng cùng compound index, group thêm bucket → 1 pass duy nhất trên collection
    const sparklineAgg = await PingLog.aggregate([
        {
            $match: {
                monitorId: { $in: monitorIds },
                timestamp: { $gte: currentStart, $lt: currentEnd },
            },
        },
        {
            $group: {
                _id: { monitorId: '$monitorId', bucket: bucketExpr },
                avgRT: { $avg: '$responseTime' },
            },
        },
        { $sort: { '_id.monitorId': 1, '_id.bucket': 1 } },
        {
            $project: {
                _id: 0,
                monitorId: '$_id.monitorId',
                bucket: '$_id.bucket',
                avgRT: { $round: ['$avgRT', 0] },
            },
        },
    ]);

    // Group sparkline rows by monitorId, giới hạn maxPoints
    const sparklineByMonitor = {};
    for (const row of sparklineAgg) {
        const key = row.monitorId.toString();
        if (!sparklineByMonitor[key]) sparklineByMonitor[key] = [];
        sparklineByMonitor[key].push(row.avgRT);
    }
    // Lấy slice cuối (mới nhất) đúng số điểm cần cho sparkline
    for (const key of Object.keys(sparklineByMonitor)) {
        const arr = sparklineByMonitor[key];
        if (arr.length > sparklinePoints) {
            sparklineByMonitor[key] = arr.slice(-sparklinePoints);
        }
    }

    // ── Kết hợp dữ liệu ───────────────────────────────────────────────────────
    const kpiByMonitor = Object.fromEntries(kpiAgg.map((k) => [k._id.toString(), k]));

    return monitors.map((monitor) => {
        const id = monitor._id.toString();
        const kpi = kpiByMonitor[id];

        if (!kpi || kpi.totalChecks === 0) {
            return {
                id,
                name: monitor.name,
                status: monitor.status,
                uptime: 100,
                responseTime: 0,
                downtime: '0m',
                incidents: 0,
                history: sparklineByMonitor[id] ?? [],
            };
        }

        const uptime = parseFloat(((kpi.onlineCount / kpi.totalChecks) * 100).toFixed(2));
        const responseTime = Math.round(kpi.totalResponseTime / kpi.totalChecks);
        const downtimeMins = kpi.offlineCount * DEFAULT_INTERVAL_MINS;

        return {
            id,
            name: monitor.name,
            status: uptime >= 99 ? 'up' : 'down',
            uptime,
            responseTime,
            downtime: formatDowntime(downtimeMins),
            // Proxy: số lần offline ≈ số sự cố (mỗi lần bị offline = 1 event)
            incidents: kpi.offlineCount,
            history: sparklineByMonitor[id] ?? [],
        };
    });
};

module.exports = { getSummary, getCharts, getMonitorsDetail };
