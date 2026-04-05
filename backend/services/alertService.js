const Alert = require('../models/Alert');
const Monitor = require('../models/Monitor');
const mongoose = require('mongoose');
const { startOfDay, endOfDay, parseISO } = require('date-fns');

exports.getAlertHistory = async (userId, filters) => {
    const { page, limit, search, severity, fromDate, toDate } = filters;

    const query = { userId: new mongoose.Types.ObjectId(userId) };

    // 1. Filter by severity
    if (severity) {
        query.severity = severity;
    }

    // 2. Filter by date range
    if (fromDate || toDate) {
        query.createdAt = {};
        if (fromDate) query.createdAt.$gte = startOfDay(parseISO(fromDate));
        if (toDate) query.createdAt.$lte = endOfDay(parseISO(toDate));
    }

    // 3. Search matching by Monitor Name or URL
    if (search) {
        const matchingMonitors = await Monitor.find({
            userId: new mongoose.Types.ObjectId(userId),
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { url: { $regex: search, $options: 'i' } }
            ]
        }).select('_id');

        const monitorIds = matchingMonitors.map(m => m._id);
        // Intersection condition or create new if not exists
        query.monitorId = { $in: monitorIds };
    }

    const skip = (page - 1) * limit;

    // 4. Fetch data with pagination, using lean() and populate
    const [alerts, total, statsAll] = await Promise.all([
        Alert.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('monitorId', 'name url')
            .lean(),
        Alert.countDocuments(query),

        // Aggregation for global stats of current user (ignoring page filters for absolute stats)
        Alert.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: "$severity",
                    count: { $sum: 1 }
                }
            }
        ])
    ]);

    // Aggregate stats parsing
    let criticalCount = 0;
    let warningCount = 0;
    let infoCount = 0;
    let totalStatsCount = 0;

    statsAll.forEach(state => {
        if (state._id === 'critical') criticalCount = state.count;
        if (state._id === 'warning') warningCount = state.count;
        if (state._id === 'info') infoCount = state.count;
        totalStatsCount += state.count;
    });

    return {
        data: alerts.map(alert => ({
            id: alert._id,
            monitorName: alert.monitorId ? alert.monitorId.name : 'Unknown Monitor',
            monitorUrl: alert.monitorId ? alert.monitorId.url : '',
            type: alert.errorType,
            severity: alert.severity,
            message: alert.message,
            timestamp: alert.createdAt,
            channels: alert.channelsSent
        })),
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        },
        stats: {
            total: totalStatsCount,
            critical: criticalCount,
            warning: warningCount,
            info: infoCount
        }
    };
};
