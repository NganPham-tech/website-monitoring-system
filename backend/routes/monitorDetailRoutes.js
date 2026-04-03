const express = require('express');
const monitorDetailController = require('../controllers/monitorDetailController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

// All routes require authentication
router.use(authMiddleware);

// GET /api/monitors/:id
router.get('/', monitorDetailController.getMonitorById);

// PUT /api/monitors/:id/toggle-status
router.put('/toggle-status', monitorDetailController.toggleStatus);

// DELETE /api/monitors/:id
router.delete('/', monitorDetailController.deleteMonitor);

// GET /api/monitors/:id/kpis
router.get('/kpis', monitorDetailController.getKpis);

// GET /api/monitors/:id/chart?days=7|30|90
router.get('/chart', monitorDetailController.getChartData);

// GET /api/monitors/:id/logs
router.get('/logs', monitorDetailController.getActivityLogs);

// GET /api/monitors/:id/alerts
router.get('/alerts', monitorDetailController.getAlerts);

module.exports = router;
