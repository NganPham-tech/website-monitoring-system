const Monitor = require('../models/Monitor');
const PingLog = require('../models/PingLog');

const monitorService = {
  /**
   * Get monitors list for a user with filters and pagination
   */
  getMonitors: async (userId, query) => {
    const { search, status, protocol, page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const filter = { userId };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (protocol && protocol !== 'all') {
      filter.protocol = protocol;
    }

    const monitors = await Monitor.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const enhancedMonitors = await Promise.all(
      monitors.map(async (monitor) => {
        const latestLog = await PingLog.findOne({ monitorId: monitor._id })
          .sort({ timestamp: -1 })
          .lean();

        return {
          ...monitor,
          lastCheckedAt: latestLog ? latestLog.timestamp : null,
          currentResponseTime: latestLog ? latestLog.responseTime : monitor.responseTime,
          currentUptime: monitor.uptime,
        };
      })
    );

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
   * Create a new monitor
   * @param {string} userId - ID of the owner
   * @param {Object} monitorData - Validated monitor data
   */
  createMonitor: async (userId, monitorData) => {
    const monitor = new Monitor({
      ...monitorData,
      userId,
      status: 'pending', // Initial status
    });

    await monitor.save();

    // Publish event to Workers (Mock logic for Redis/Kafka/RabbitMQ)
    console.log(`[Event Service] Publishing 'monitor.created' event for ID: ${monitor._id}`);
    /*
    await redis.publish('monitor_checks', JSON.stringify({
      action: 'START_MONITORING',
      monitorId: monitor._id,
      url: monitor.url,
      protocol: monitor.protocol,
      interval: monitor.interval,
      locations: monitor.locations
    }));
    */

    return monitor;
  },

  getRecentPingInfo: async (monitorId) => {
    return PingLog.findOne({ monitorId }).sort({ timestamp: -1 }).lean();
  }
};

module.exports = monitorService;
