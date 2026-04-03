const Monitor = require('../models/Monitor');
const PingLog = require('../models/PingLog');
const { subDays, startOfDay, endOfDay, format, differenceInDays } = require('date-fns');

const monitorDetailService = {

  getKpis: async (monitorId, userId) => {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    // Dùng Aggregate để tính KPIs cho 30 ngày hiện tại
    const currentKpis = await PingLog.aggregate([
      { 
        $match: { 
          monitorId, 
          timestamp: { $gte: thirtyDaysAgo, $lt: now } 
        } 
      },
      {
        $group: {
          _id: null,
          totalChecks: { $sum: 1 },
          onlineCount: { 
            $sum: { $cond: [{ $eq: ['$status', 'online'] }, 1, 0] } 
          },
          totalResponseTime: { $sum: '$responseTime' }
        }
      }
    ]);

    // Aggregate cho 30 ngày trước đó
    const previousKpis = await PingLog.aggregate([
      { 
        $match: { 
          monitorId, 
          timestamp: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } 
        } 
      },
      {
        $group: {
          _id: null,
          totalChecks: { $sum: 1 },
          onlineCount: { 
            $sum: { $cond: [{ $eq: ['$status', 'online'] }, 1, 0] } 
          },
          totalResponseTime: { $sum: '$responseTime' }
        }
      }
    ]);

    const calculateMetrics = (data) => {
      if (!data || data.length === 0 || data[0].totalChecks === 0) {
        return { uptime: 100, avgResponseTime: 0, downtime: 0 };
      }
      const { totalChecks, onlineCount, totalResponseTime } = data[0];
      const offlineCount = totalChecks - onlineCount;
      // Uptime %
      const uptime = parseFloat(((onlineCount / totalChecks) * 100).toFixed(2));
      // AVG Response Time (ms)
      const avgResponseTime = Math.round(totalResponseTime / totalChecks);
      // Giả sử mỗi lần check cách nhau 5 phút (có thể theo cấu hình interval)
      const downtimeMinutes = offlineCount * 5; 
      
      return { uptime, avgResponseTime, downtime: downtimeMinutes };
    };

    const current = calculateMetrics(currentKpis);
    const previous = calculateMetrics(previousKpis);

    // Tính toán Trend
    return {
      uptime: {
        value: current.uptime,
        trend: parseFloat((current.uptime - previous.uptime).toFixed(2)),
        isUp: current.uptime >= previous.uptime
      },
      responseTime: {
        value: current.avgResponseTime,
        trend: Math.abs(current.avgResponseTime - previous.avgResponseTime),
        isUp: current.avgResponseTime <= previous.avgResponseTime // Thấp hơn là tốt
      },
      downtime: {
        value: current.downtime, // minutes
        trend: Math.abs(current.downtime - previous.downtime),
        isUp: current.downtime <= previous.downtime // Ít downtime hơn là tốt
      }
    };
  },

  getChartData: async (monitorId, daysRange) => {
    const days = parseInt(daysRange) || 7;
    const since = startOfDay(subDays(new Date(), days));

    // Nhóm dữ liệu theo ngày và tính trung bình response time
    const chartData = await PingLog.aggregate([
      { 
        $match: { 
          monitorId, 
          timestamp: { $gte: since } 
        } 
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          avgResponseTime: { $avg: '$responseTime' }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          avgResponseTime: { $round: ['$avgResponseTime', 0] },
          _id: 0
        }
      }
    ]);

    return chartData;
  },

  getCombinedLogs: async (monitorId) => {
    const [activities, alerts] = await Promise.all([
      PingLog.find({ monitorId })
        .sort({ timestamp: -1 })
        .limit(20)
        .lean(),
        
      PingLog.find({ monitorId, status: 'offline' }) // Cảnh báo khi offline
        .sort({ timestamp: -1 })
        .limit(10)
        .lean()
    ]);
    
    return { activities, alerts };
  }
};

module.exports = monitorDetailService;
