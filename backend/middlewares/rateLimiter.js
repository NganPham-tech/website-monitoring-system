const rateLimit = require('express-rate-limit');

// Anti brute-force login: Giới hạn 5 lần/phút
const rateLimitLogin = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 5, // Tối đa 5 request từ 1 IP
  message: {
    success: false,
    message: 'Bạn đã đăng nhập sai quá nhiều lần. Vui lòng đợi 1 phút.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const rateLimitRegister = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 3, // Tối đa 3 request từ 1 IP trong vòng 1 giờ
  message: {
    success: false,
    message: 'Quá nhiều tài khoản được đăng ký từ IP của bạn, vui lòng thử lại sau 1 giờ.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for monitor list requests
const rateLimitMonitorList = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for public status page summary (60 requests / minute)
const rateLimitStatusPage = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 60,
  message: {
    success: false,
    message: 'Hệ thống trạng thái đang tải cao, vui lòng thử lại sau 1 phút.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for email subscription (3 requests / 10 minutes)
const rateLimitStatusSubscribe = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 3, 
  message: {
    success: false,
    message: 'Bạn đã thử đăng ký quá nhiều lần. Vui lòng thử lại sau 10 phút.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  rateLimitLogin,
  rateLimitRegister,
  rateLimitMonitorList,
  rateLimitStatusPage,
  rateLimitStatusSubscribe
};
