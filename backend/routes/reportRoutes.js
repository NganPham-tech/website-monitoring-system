/**
 * reportRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Tất cả routes thuộc domain Reports đều yêu cầu xác thực (authMiddleware).
 * Được mount tại: /api/reports
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getSummary, getCharts, getMonitorsDetail } = require('../controllers/reportController');

// Áp dụng auth cho toàn bộ router
router.use(authMiddleware);

/**
 * GET /api/reports/summary?range=24h|7d|30d|90d
 * Trả về 4 KPI tổng hợp kèm delta so với kỳ trước.
 */
router.get('/summary', getSummary);

/**
 * GET /api/reports/charts?range=24h|7d|30d|90d
 * Trả về dữ liệu cho 3 biểu đồ: uptime trend, response time, incident distribution.
 */
router.get('/charts', getCharts);

/**
 * GET /api/reports/monitors-detail?range=24h|7d|30d|90d
 * Trả về danh sách monitors với KPI chi tiết và sparkline data.
 */
router.get('/monitors-detail', getMonitorsDetail);

module.exports = router;
