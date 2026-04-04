const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { getPublicStats, registerNewsletter } = require('../controllers/publicController');

// Rate limiter cho endpoint Stats (100 Request / phút mỗi IP)
const statsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 100,
  message: { success: false, message: 'Too many requests for stats. Please try again later.' }
});

// Rate limiter khắt khe cho endpoint Ghi danh (3 Request / 15 phút mỗi IP)
const newsletterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 3,
  message: { success: false, message: 'Bạn thao tác quá nhanh! Vui lòng thử lại sau 15 phút.' }
});

router.get('/stats', statsLimiter, getPublicStats);
router.post('/newsletter', newsletterLimiter, registerNewsletter);

module.exports = router;
