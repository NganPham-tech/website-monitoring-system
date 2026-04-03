const Monitor = require('../models/Monitor');
const PingLog = require('../models/PingLog');

const monitorService = {
  /**
   * Get monitors list for a user with filters and pagination
   * @param {string} userId - ID of the user
   * @param {Object} query - Query parameters (search, status, protocol, page, limit)
   */
  getMonitors: async (userId, query) => {
    const { search, status, protocol, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const filter = { userId };

    // Search filter (regex search on name or url)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Protocol filter
    if (protocol && protocol !== 'all') {
      filter.protocol = protocol;
    }

    // Execute query with pagination
    const monitors = await Monitor.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Enhance monitors with the latest ping log data
    const enhancedMonitors = await Promise.all(
      monitors.map(async (monitor) => {
        const latestLog = await PingLog.findOne({ monitorId: monitor._id })
          .sort({ timestamp: -1 })
          .lean();

        return {
          ...monitor,
          lastCheckedAt: latestLog ? latestLog.timestamp : null,
          currentResponseTime: latestLog ? latestLog.responseTime : monitor.responseTime,
          currentUptime: monitor.uptime, // In real scenario, calculate from logs
        };
      })
    );

    // Get total count for pagination metadata
    const total = await Monitor.countDocuments(filter);

    return {
      monitors: enhancedMonitors,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * (Future improvement) Join or populate with recent logs
   * This logic can be expanded as needed
   */
  getRecentPingInfo: async (monitorId) => {
    return PingLog.findOne({ monitorId }).sort({ timestamp: -1 }).lean();
  }
};

module.exports = monitorService;
