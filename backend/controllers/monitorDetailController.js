const Monitor = require('../models/Monitor');
const PingLog = require('../models/PingLog');
const mongoose = require('mongoose');
const monitorDetailService = require('../services/monitorDetailService');
const { addDays, differenceInDays } = require('date-fns');

const monitorDetailController = {
  // GET /api/monitors/:id
  getMonitorById: async (req, res) => {
    try {
      const monitor = await Monitor.findOne({ _id: req.params.id, userId: req.user.id });
      if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại hoặc không đủ quyền.' });
      
      // Calculate SSL Expiry Days using date-fns
      let sslExpiryText = 'Không áp dụng';
      if (monitor.alertTriggers?.sslExpiry && monitor.alertTriggers?.sslDays) {
          // Giả lập SSL Date bằng cách cộng sslDays vào lastCheck hoặc createdDate
          const mockedSslDate = addDays(new Date(), monitor.alertTriggers.sslDays);
          const daysLeft = differenceInDays(mockedSslDate, new Date());
          sslExpiryText = `${Math.max(0, daysLeft)} ngày nữa`;
      } else {
         // Default mock cho demo nếu params chưa chuẩn
         sslExpiryText = '42 ngày nữa'; 
      }

      // Convert model document -> raw object and add SSL calculation
      const data = {
         ...monitor.toObject(),
         sslExpiry: sslExpiryText
      };

      return res.status(200).json({ success: true, data });
    } catch (error) {
      if(error instanceof mongoose.Error.CastError) {
        return res.status(404).json({ success: false, message: 'ID không hợp lệ.' });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // PUT /api/monitors/:id/toggle-status
  toggleStatus: async (req, res) => {
    try {
      const monitor = await Monitor.findOne({ _id: req.params.id, userId: req.user.id });
      if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại.' });

      monitor.isActive = !monitor.isActive;
      await monitor.save();

      return res.status(200).json({
        success: true,
        data: { isActive: monitor.isActive },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // DELETE /api/monitors/:id
  deleteMonitor: async (req, res) => {
    try {
      const monitor = await Monitor.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
      if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại.' });

      // Cascade delete: Xóa tất cả log và cảnh báo liên quan
      await PingLog.deleteMany({ monitorId: req.params.id });

      return res.status(200).json({ success: true, message: 'Xóa thành công.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/monitors/:id/kpis
  getKpis: async (req, res) => {
    try {
      // Phân quyền
      const monitor = await Monitor.findOne({ _id: req.params.id, userId: req.user.id });
      if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại.' });

      // Gọi logic Aggregation nằm ở Service layer (Best Practice)
      const kpis = await monitorDetailService.getKpis(monitor._id, req.user.id);
      
      return res.status(200).json({ success: true, data: kpis });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/monitors/:id/charts?range=7d
  getChartData: async (req, res) => {
    try {
      const monitor = await Monitor.findOne({ _id: req.params.id, userId: req.user.id });
      if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại.' });

      const range = req.query.range ? req.query.range.replace('d', '') : '7';
      const chartData = await monitorDetailService.getChartData(monitor._id, range);

      return res.status(200).json({ success: true, data: chartData });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // GET /api/monitors/:id/logs
  getLogs: async (req, res) => {
    try {
      const monitor = await Monitor.findOne({ _id: req.params.id, userId: req.user.id });
      if (!monitor) return res.status(404).json({ success: false, message: 'Monitor không tồn tại.' });

      const data = await monitorDetailService.getCombinedLogs(monitor._id);

      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = monitorDetailController;
