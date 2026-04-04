const mongoose = require('mongoose');
const Monitor = require('../models/Monitor');
const PingLog = require('../models/PingLog');
const cache = require('../utils/memoryCache');

class DashboardService {
  /**
   * Retrieves quick metrics for a user
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getMetrics(userId) {
    const cacheKey = `dashboard:metrics:${userId}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return cachedData;

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Perform an aggregation over Monitor collection to get counts and averages
    const result = await Monitor.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalMonitors: { $sum: 1 },
          downMonitors: {
            $sum: { $cond: [{ $in: ['$status', ['offline', 'down']] }, 1, 0] }
          },
          activeMonitors: {
            $sum: { $cond: [{ $in: ['$status', ['online', 'up']] }, 1, 0] }
          },
          totalResponseTime: { $sum: '$responseTime' },
          totalUptime: { $sum: '$uptime' }
        }
      }
    ]);

    let metrics;
    if (result.length > 0) {
      const stats = result[0];
      const validMonitorsCount = stats.totalMonitors || 1; // avoid division by zero
      metrics = {
        downMonitors: stats.downMonitors,
        activeMonitors: stats.activeMonitors,
        avgResponseTime: Math.round(stats.totalResponseTime / validMonitorsCount),
        uptimePercentage: Number((stats.totalUptime / validMonitorsCount).toFixed(2))
      };
    } else {
      metrics = { downMonitors: 0, activeMonitors: 0, avgResponseTime: 0, uptimePercentage: 0 };
    }

    cache.set(cacheKey, metrics, 5); // Cache for 5 minutes
    return metrics;
  }

  /**
   * Retrieves data grouped for charting
   * @param {string} userId
   * @param {string} range '24h', '7d', '30d', '90d'
   */
  async getChartData(userId, range) {
    const cacheKey = `dashboard:chart:${userId}:${range}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) return cachedData;

    // Determine the start date and the group path formatting
    let startDate = new Date();
    let dateFormat = '%Y-%m-%d'; 

    switch (range) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        dateFormat = '%Y-%m-%d %H:00'; // Group by hour
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setHours(startDate.getHours() - 24);
        dateFormat = '%Y-%m-%d %H:00';
    }

    // 1. Get all monitors for user
    const userMonitors = await Monitor.find({ userId }).select('_id').lean();
    const monitorIds = userMonitors.map(m => m._id);

    if (monitorIds.length === 0) {
      return [];
    }

    // 2. Aggregate PingLogs
    const chartData = await PingLog.aggregate([
      {
        $match: {
          monitorId: { $in: monitorIds },
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$timestamp' } },
          avgResponseTime: { $avg: '$responseTime' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          timestamp: '$_id',
          responseTime: { $round: ['$avgResponseTime', 0] }
        }
      }
    ]);

    cache.set(cacheKey, chartData, 5); // Cache for 5 minutes
    return chartData;
  }

  /**
   * Retrieves a list of recent monitors
   * @param {string} userId 
   */
  async getRecentMonitors(userId) {
    const monitors = await Monitor.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name url status uptime responseTime protocol createdAt')
      .lean();

    // Map to normalized names for frontend
    return monitors.map(col => ({
      id: col._id,
      name: col.name,
      url: col.url,
      status: col.status,
      uptimePercentage: col.uptime || 0,
      avgResponseTime: col.responseTime || 0
    }));
  }
}

module.exports = new DashboardService();
