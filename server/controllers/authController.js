const authService = require('../services/authService');
const { loginSchema } = require('../utils/validation');

/**
 * Common function to set cookie
 */
const setAuthCookie = (res, token, rememberMe = true) => {
  const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000; // 7 days or 1 hr
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // prevent CSRF while allowing redirects
    maxAge,
  });
};

/**
 * Controller Đăng nhập truyền thống
 */
const login = async (req, res) => {
  // Validate input
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ 
      success: false, 
      message: parsed.error.errors[0].message 
    });
  }

  const { email, password, rememberMe } = parsed.data;

  try {
    const { user, token } = await authService.loginTraditional(email, password, rememberMe);

    // Set HttpOnly Cookie
    setAuthCookie(res, token, rememberMe);

    res.status(200).json({
      success: true,
      data: {
        user,
        // Dù đã có cookie, vẫn có thể trả token trong response nếu client muốn lưu memory,
        // nhưng theo yêu cầu an toàn, return null hoặc không trả, tuy nhiên do prompt:
        // "Trả về response chứa thông tin user và token (khuyến khích...)", tôi vẫn trả text nhưng
        // thông báo Frontend không cần thiết dùng.
        token 
      }
    });
  } catch (error) {
    if (error.message === 'Email hoặc mật khẩu không chính xác') {
      return res.status(401).json({ success: false, message: error.message });
    }
    throw error; // Quăng lên Global Error Handler
  }
};

/**
 * Controller Xử lý Callback từ SSO
 */
const ssoCallback = async (req, res) => {
  // req.user được Inject từ Passport Strategy (thông qua service tạo phía trên)
  if (!req.user) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }

  try {
    // Generate token cho SSO (mặc định 7 ngày remember)
    const token = await authService.generateToken(req.user._id, true);
    
    // Set Cookie thẳng trên Response
    setAuthCookie(res, token, true);

    // Redirect về Frontend Dashboard
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error('SSO Callback Error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

/**
 * Logout
 */
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Đăng xuất thành công' });
};

module.exports = {
  login,
  ssoCallback,
  logout
};
