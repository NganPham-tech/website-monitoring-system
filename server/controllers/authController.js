const authService = require('../services/authService');
const { loginSchema } = require('../utils/validation');
const { registerSchema } = require('../schemas/authValidations');

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

/**
 * Controller Xử lý Đăng ký
 */
const register = async (req, res) => {
  // Validate bằng Zod (quăng lỗi nếu fail, nhờ Express 5 truyền xuống Error Handler, nhưng zod parse trả về lỗi thô nếu không cẩn thận. Ta dùng safeParse hoặc parse)
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    // Trả về BadRequest cho FrontEnd thân thiện
    return res.status(400).json({
      success: false,
      message: parsed.error.errors.map(e => e.message).join(', ')
    });
  }

  const { name, email, password, company, plan } = parsed.data;

  // Lỗi trùng email sẽ được throw từ Service và bắt bởi Error Handler
  const { user, token } = await authService.registerUser({ name, email, password, company, plan });

  // (Optional) Auto login: Set cookie tương tự login
  setAuthCookie(res, token, false); // Không cần rememberMe lúc đky

  res.status(201).json({
    success: true,
    message: 'Đăng ký tài khoản thành công',
    data: {
      id: user._id,
      email: user.email,
      name: user.name,
      plan: user.plan,
      // Có thể trả thêm token nếu UI cần (mặc dù lưu HttpOnly)
      token
    }
  });
};

module.exports = {
  register,
  login,
  ssoCallback,
  logout
};
