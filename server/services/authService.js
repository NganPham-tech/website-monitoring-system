const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Tạo JWT token
 */
const generateToken = (userId, rememberMe) => {
  const expiresIn = rememberMe ? '7d' : '1h';
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Xử lý đăng nhập truyền thống
 */
const loginTraditional = async (email, password, rememberMe) => {
  // 1. Check user exists (cần select password vì default là false)
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || user.authProvider !== 'local') {
    throw new Error('Email hoặc mật khẩu không chính xác');
  }

  // 2. So sánh mật khẩu
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Email hoặc mật khẩu không chính xác');
  }

  // 3. Tạo token
  const token = generateToken(user._id, rememberMe);

  // 4. Return info user (ẩn password)
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

/**
 * Xử lý logic đăng nhập SSO (Passport callback)
 */
const handleSSOLogin = async (profile, provider) => {
  let email = null;
  
  if (profile.emails && profile.emails.length > 0) {
    email = profile.emails[0].value;
  }

  if (!email) {
    throw new Error(`Tài khoản ${provider} không chia sẻ email public. Kí danh thất bại.`);
  }

  // Tìm user theo email
  let user = await User.findOne({ email });

  if (user) {
    // Nếu user đã tồn tại nhưng đky qua provider khác hoặc local,
    // tùy rule hệ thống có thể cho phép merge hoặc báo lỗi.
    // Ở đây ta đơn giản cập nhật lại provider info nếu nó giống.
    // Hoặc nếu đang đăng nhập local mà thử gg -> báo lỗi.
    // Để linh hoạt, tôi cho phép merge (hoặc gán providerId).
    if (!user.providerId) {
      user.providerId = profile.id;
      user.authProvider = provider;
      await user.save();
    }
  } else {
    // Tạo user mới
    user = await User.create({
      name: profile.displayName || email.split('@')[0],
      email: email,
      authProvider: provider,
      providerId: profile.id,
    });
  }

  // SSO đăng nhập thường không có "rememberMe", mặc định 7 ngày hoặc 1 ngày tùy logic
  const token = generateToken(user._id, true);

  return { user, token };
};

/**
 * Xử lý Đăng ký tài khoản
 */
const registerUser = async ({ name, email, password, company, plan }) => {
  // 1. Kiểm tra lặp email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email này đã được sử dụng');
    error.statusCode = 409;
    throw error;
  }

  // 2. Mã hoá mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Tạo User
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    company: company || '',
    plan: plan || 'Miễn phí - 5 Monitors',
    authProvider: 'local'
  });

  // 4. Lược bỏ password trước khi trả về
  const userResponse = newUser.toObject();
  delete userResponse.password;

  // (Optional theo yêu cầu: Autologin) Thêm token luôn.
  const token = generateToken(userResponse._id, false);

  return { user: userResponse, token };
};

module.exports = {
  registerUser,
  loginTraditional,
  handleSSOLogin,
  generateToken,
};
