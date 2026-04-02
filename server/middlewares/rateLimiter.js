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

module.exports = {
  rateLimitLogin,
  rateLimitRegister
};
