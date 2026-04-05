const Monitor = require('../models/Monitor');
const PingLog = require('../models/PingLog');
const Incident = require('../models/Incident');
const Subscriber = require('../models/Subscriber');
const { startOfDay, subDays, endOfDay, format } = require('date-fns');

const statusPageService = {
  getSummary: async () => {
    // 1. Get all public monitors
    const monitors = await Monitor.find({ isPublic: true, isActive: true })
      .select('name url status uptime responseTime')
      .lean();

    if (monitors.length === 0) {
      return {
        systemStatus: 'operational',
        services: [],
        incidents: []
      };
    }

    const monitorIds = monitors.map(m => m._id);
    const sixtyDaysAgo = startOfDay(subDays(new Date(), 60));

    // 2. Aggregate Uptime Grid for last 60 days
    // This is a heavy operation, hence logic caching is vital.
    const uptimeData = await PingLog.aggregate([
      {
        $match: {
          monitorId: { $in: monitorIds },
          timestamp: { $gte: sixtyDaysAgo }
        }
      },
      {
        $project: {
          monitorId: 1,
          status: 1,
          date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }
        }
      },
      {
        $group: {
          _id: { monitorId: "$monitorId", date: "$date" },
          total: { $sum: 1 },
          online: { $sum: { $cond: [{ $eq: ["$status", "online"] }, 1, 0] } }
        }
      },
      {
          $project: {
            uptimePercentage: { 
                $round: [{ $multiply: [{ $divide: ["$online", "$total"] }, 100] }, 2] 
            }
          }
      }
    ]);

    // 3. Map aggregates back to services with full grid 
    const services = monitors.map(monitor => {
      const monitorUptime = uptimeData.filter(u => u._id.monitorId.toString() === monitor._id.toString());
      
      const grid = [];
      for (let i = 59; i >= 0; i--) {
        const dateObj = subDays(new Date(), i);
        const dateStr = format(dateObj, 'yyyy-MM-dd');
        const dayStat = monitorUptime.find(u => u._id.date === dateStr);
        
        let status = 1; // Operational (Green)
        let uptime = dayStat ? dayStat.uptimePercentage : 100;

        if (dayStat) {
            if (uptime < 90) status = 3; // Major Outage (Red)
            else if (uptime < 100) status = 2; // Partial Outage (Yellow)
        }

        grid.push({
          date: dateStr,
          uptime,
          status
        });
      }

      return {
        id: monitor._id,
        name: monitor.name,
        status: monitor.status === 'online' ? 'operational' : 'major_outage',
        avgUptime: monitor.uptime || 100,
        uptimeData: grid
      };
    });

    // 4. Determine overall status
    const hasMajorOutage = services.some(s => s.status === 'major_outage');
    const hasPartialOutage = services.some(s => s.uptimeData[s.uptimeData.length - 1].status !== 1);
    const systemStatus = hasMajorOutage 
      ? 'major_outage' 
      : (hasPartialOutage ? 'partial_outage' : 'operational');

    // 5. Recent incidents last 14 days
    const fourteenDaysAgo = subDays(new Date(), 14);
    const recentIncidents = await Incident.find({
        startedAt: { $gte: fourteenDaysAgo }
    })
    .sort({ startedAt: -1 })
    .select('title status severity startedAt resolvedAt timeline' )
    .lean();

    return {
      systemStatus,
      services,
      incidents: recentIncidents.map(inc => ({
          id: inc._id,
          title: inc.title,
          description: inc.timeline && inc.timeline.length > 0 ? inc.timeline[0].description : 'Đang điều tra...',
          status: inc.status === 'resolved' ? 'resolved' : 'investigating',
          createdAt: inc.startedAt
      }))
    };
  },

  subscribe: async (email) => {
    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.status === 'active') {
        throw new Error('Email này đã được đăng ký');
      }
      // Re-activate if was unsubscribed
      existing.status = 'active';
      await existing.save();
      return { message: 'Đăng ký nhận thông báo thành công' };
    }

    await Subscriber.create({ email, status: 'active' });
    return { message: 'Đăng ký nhận thông báo thành công' };
  }
};

module.exports = statusPageService;
