const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const authMiddleware = require('../middlewares/authMiddleware');

// Tất cả endpoints dưới đây đều yêu cầu Authentication
router.use(authMiddleware);

// GET /api/alerts: Lấy danh sách lịch sử cảnh báo với bộ lọc và phân trang
router.get('/', alertController.getAlerts);

module.exports = router;
