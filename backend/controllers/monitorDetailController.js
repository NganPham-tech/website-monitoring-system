const Monitor = require('../models/Monitor');
const PingLog = require('../models/PingLog');

const monitorDetailController = {
  /**
   * GET /api/monitors/:id
   * Get single monitor details
   */
  getMonitorById: async (req, res) => {
    const monitor = await Monitor.findOne({ _id: req.params.id, userId: req.user.id });
    if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại.' });
    return res.status(200).json({ success: true, data: monitor });
  },

  /**
   * PUT /api/monitors/:id/toggle-status
   * Toggle isActive (pause / resume monitoring)
   */
  toggleStatus: async (req, res) => {
    const monitor = await Monitor.findOne({ _id: req.params.id, userId: req.user.id });
    if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại.' });

    monitor.isActive = !monitor.isActive;
    await monitor.save();

    return res.status(200).json({
      success: true,
      message: monitor.isActive ? 'Monitor đã được tiếp tục.' : 'Monitor đã được tạm dừng.',
      data: { isActive: monitor.isActive },
    });
  },

  /**
   * DELETE /api/monitors/:id
   * Delete a monitor and all its logs
   */
  deleteMonitor: async (req, res) => {
    const monitor = await Monitor.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại.' });

    // Cascade delete ping logs
    await PingLog.deleteMany({ monitorId: req.params.id });

    return res.status(200).json({ success: true, message: 'Monitor đã được xóa thành công.' });
  },

  /**
   * GET /api/monitors/:id/kpis
   * Compute KPIs for last 30 days vs prev 30 days
   */
  getKpis: async (req, res) => {
    const monitorId = req.params.id;

    // Verify ownership
    const monitor = await Monitor.findOne({ _id: monitorId, userId: req.user.id });
    if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại.' });

    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now - 60 * 24 * 60 * 60 * 1000);

    // Current period logs
    const currentLogs = await PingLog.find({
      monitorId,
      timestamp: { $gte: thirtyDaysAgo },
    }).lean();

    // Previous period logs (for trend comparison)
    const prevLogs = await PingLog.find({
      monitorId,
      timestamp: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    }).lean();

    const calcKpis = (logs) => {
      if (logs.length === 0) return { uptime: 100, avgResponseTime: 0, downtime: 0 };
      const onlineCount = logs.filter((l) => l.status === 'online').length;
      const uptime = parseFloat(((onlineCount / logs.length) * 100).toFixed(2));
      const avgResponseTime = Math.round(logs.reduce((sum, l) => sum + l.responseTime, 0) / logs.length);
      const offlineCount = logs.length - onlineCount;
      // Downtime in minutes (assume each log = 1 check interval)
      const downtimeMinutes = offlineCount * 5; // assume 5-min interval
      return { uptime, avgResponseTime, downtime: downtimeMinutes };
    };

    const current = calcKpis(currentLogs);
    const previous = calcKpis(prevLogs);

    return res.status(200).json({
      success: true,
      data: {
        current,
        previous,
        totalChecks: currentLogs.length,
      },
    });
  },

  /**
   * GET /api/monitors/:id/chart?days=7|30|90
   * Response time chart data
   */
  getChartData: async (req, res) => {
    const monitorId = req.params.id;
    const days = parseInt(req.query.days) || 7;

    const monitor = await Monitor.findOne({ _id: monitorId, userId: req.user.id });
    if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại.' });

    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Aggregate: group by day, compute avg response time
    const chartData = await PingLog.aggregate([
      { $match: { monitorId: monitor._id, timestamp: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          avgResponseTime: { $avg: '$responseTime' },
          checks: { $sum: 1 },
          online: { $sum: { $cond: [{ $eq: ['$status', 'online'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          avgResponseTime: { $round: ['$avgResponseTime', 0] },
          uptime: {
            $round: [{ $multiply: [{ $divide: ['$online', '$checks'] }, 100] }, 2],
          },
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({ success: true, data: chartData });
  },

  /**
   * GET /api/monitors/:id/logs?limit=20
   * Recent ping activity logs
   */
  getActivityLogs: async (req, res) => {
    const monitorId = req.params.id;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);

    const monitor = await Monitor.findOne({ _id: monitorId, userId: req.user.id });
    if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại.' });

    const logs = await PingLog.find({ monitorId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({ success: true, data: logs });
  },

  /**
   * GET /api/monitors/:id/alerts?limit=10
   * Recent alert events (offline incidents)
   */
  getAlerts: async (req, res) => {
    const monitorId = req.params.id;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const monitor = await Monitor.findOne({ _id: monitorId, userId: req.user.id });
    if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại.' });

    const alerts = await PingLog.find({ monitorId, status: 'offline' })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({ success: true, data: alerts });
  },
};

module.exports = monitorDetailController;
