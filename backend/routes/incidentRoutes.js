const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const authMiddleware = require('../middlewares/authMiddleware');

// ==========================================
// THƯ MỤC CHỨA MIDDLEWARE REQUIRE_AUTH
// Tất cả các API incident phải đi qua authMiddleware
// ==========================================
router.use(authMiddleware);

// GET: Lấy chi tiết Sự cố
router.get('/:id', incidentController.getIncident);

// PUT: Đánh dấu giải quyết Sự cố
router.put('/:id/resolve', incidentController.resolveIncident);

// POST: Thêm ghi chú vào Timeline
router.post('/:id/timeline', incidentController.addTimeline);

// PUT: Gán người xử lý
router.put('/:id/assign', incidentController.assignIncident);

module.exports = router;
