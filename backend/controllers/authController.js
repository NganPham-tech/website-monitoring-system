const authService = require('../services/authService');

const authController = {
  /**
   * Đăng ký người dùng mới
   */
  register: async (req, res) => {
    const { user, token } = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: { user, token },
    });
  },

  /**
   * Đăng nhập truyền thống
   */
  login: async (req, res) => {
    const { email, password, rememberMe } = req.body;
    const { user, token } = await authService.loginTraditional(email, password, rememberMe);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: { user, token },
    });
  },

  /**
   * Đăng xuất (Client side xóa token, server side có thể blacklist token nếu cần)
   */
  logout: async (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công',
    });
  },

  /**
   * Callback xử lý sau khi Passport xác thực SSO thành công
   */
  ssoCallback: async (req, res) => {
    // Passport đã đính kèm user vào req.user sau khi gọi handleSSOLogin trong strategy
    const user = req.user;
    const token = authService.generateToken(user._id, true);

    // Redirect về frontend kèm token (hoặc set cookie)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?token=${token}`);
  },
};

module.exports = authController;
