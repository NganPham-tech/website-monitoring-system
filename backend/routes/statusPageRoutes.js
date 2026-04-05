const express = require('express');
const router = express.Router();
const statusPageController = require('../controllers/statusPageController');
const { rateLimitStatusPage, rateLimitStatusSubscribe } = require('../middlewares/rateLimiter');

// GET /api/status-page/summary
// Public aggregated status of all services
router.get('/summary', rateLimitStatusPage, statusPageController.getSummary);

// POST /api/status-page/subscribe
// Subscribe to system notifications via email
router.post('/subscribe', rateLimitStatusSubscribe, statusPageController.subscribe);

module.exports = router;
