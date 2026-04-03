const express = require('express');
const router = express.Router({ mergeParams: true });
const monitorDetailController = require('../controllers/monitorDetailController');
const authMiddleware = require('../middlewares/authMiddleware');

// Áp dụng middleware xác thực cho tất cả endpoint trong file này
router.use(authMiddleware);

// GET /api/monitors/:id - Lấy thông tin chung & cấu hình
router.get('/', monitorDetailController.getMonitorById);

// PUT /api/monitors/:id/toggle-status - Tạm dừng/Tiếp tục monitor
router.put('/toggle-status', monitorDetailController.toggleStatus);

// DELETE /api/monitors/:id - Xóa monitor
router.delete('/', monitorDetailController.deleteMonitor);

// GET /api/monitors/:id/kpis - Lấy 3 chỉ số KPIs & xu hướng
router.get('/kpis', monitorDetailController.getKpis);

// GET /api/monitors/:id/charts - Lấy dữ liệu vẽ biểu đồ theo range (VD: ?range=7d)
router.get('/charts', monitorDetailController.getChartData);

// GET /api/monitors/:id/logs - Lấy nhật ký (activities & alerts)
router.get('/logs', monitorDetailController.getLogs);

module.exports = router;
