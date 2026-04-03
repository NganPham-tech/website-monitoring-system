const express = require('express');
const monitorController = require('../controllers/monitorController');
const authMiddleware = require('../middlewares/authMiddleware');
const { rateLimitMonitorList } = require('../middlewares/rateLimiter');

const router = express.Router();

// Apply auth middleware to all monitor routes
router.use(authMiddleware);

// GET /api/monitors - List of monitors with filters & search
router.get('/', rateLimitMonitorList, monitorController.getMonitors);

module.exports = router;
