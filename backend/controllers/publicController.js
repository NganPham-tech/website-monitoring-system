const publicService = require('../services/publicService');

const getPublicStats = async (req, res) => {
  const stats = await publicService.getStats();
  // Đóng gói data
  res.status(200).json({
    success: true,
    ...stats
  });
};

const registerNewsletter = async (req, res) => {
  const { email, name, message } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Email không hợp lệ' });
  }

  await publicService.subscribeNewsletter(email, name, message);

  res.status(200).json({
    success: true,
    message: 'Đăng ký thành công'
  });
};

module.exports = {
  getPublicStats,
  registerNewsletter
};
