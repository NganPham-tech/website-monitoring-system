const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

// Áp dụng middleware xác thực cho TẤT CẢ routes dưới đây
router.use(authMiddleware);

// GET /api/dashboard/metrics
router.get('/metrics', dashboardController.getMetrics);

// GET /api/dashboard/chart
router.get('/chart', dashboardController.getChartData);

// GET /api/dashboard/recent-monitors
router.get('/recent-monitors', dashboardController.getRecentMonitors);

module.exports = router;
