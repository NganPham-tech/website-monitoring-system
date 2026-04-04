/**
 * reportController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Controller mỏng cho domain Reports.
 * Mọi logic business/query đều ở reportService.js.
 *
 * express-async-errors đã được require ở app.js → không cần try/catch ở đây.
 * Lỗi từ service sẽ được bắt tự động và chuyển sang errorHandler middleware.
 */

const reportService = require('../services/reportService');
const { normalizeRange } = require('../utils/reportTimeHelper');

// ─── GET /api/reports/summary?range=30d ──────────────────────────────────────
/**
 * Trả về 4 KPI tổng hợp (uptime, responseTime, incidents, downtime)
 * kèm chiều hướng so với kỳ trước.
 */
const getSummary = async (req, res) => {
    const range = normalizeRange(req.query.range);
    const data = await reportService.getSummary(req.user.id, range);
    res.status(200).json({ success: true, data });
};

// ─── GET /api/reports/charts?range=30d ───────────────────────────────────────
/**
 * Trả về 3 chuỗi dữ liệu cho biểu đồ:
 *   - uptimeTrend     : mảng { date, uptime }
 *   - responseTimeTrend: mảng { date, avg, max }
 *   - incidentDistribution: mảng { name, value }
 */
const getCharts = async (req, res) => {
    const range = normalizeRange(req.query.range);
    const data = await reportService.getCharts(req.user.id, range);
    res.status(200).json({ success: true, data });
};

// ─── GET /api/reports/monitors-detail?range=30d ──────────────────────────────
/**
 * Trả về mảng các monitors với KPI chi tiết:
 *   [{ id, name, status, uptime, responseTime, downtime, incidents, history }]
 */
const getMonitorsDetail = async (req, res) => {
    const range = normalizeRange(req.query.range);
    const data = await reportService.getMonitorsDetail(req.user.id, range);
    res.status(200).json({ success: true, data });
};

module.exports = { getSummary, getCharts, getMonitorsDetail };
