const User = require('../models/User');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const ApiKey = require('../models/ApiKey');

exports.getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password -twoFactorSecret');
  if (!user) throw new Error('User not found');
  return user;
};

exports.updateProfile = async (userId, updateData) => {
  // Disallow certain fields from being updated directly here
  delete updateData.password;
  delete updateData.twoFactorSecret;
  delete updateData.is2FAEnabled;
  delete updateData.email; // Email updates usually require verification
  delete updateData.role;
  delete updateData.plan;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password -twoFactorSecret');

  if (!user) throw new Error('User not found');
  return user;
};

exports.changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new Error('User not found');

  if (!user.password) {
    throw new Error('This account uses an external provider (Google/Github). Please set a password first.');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error('Mật khẩu hiện tại không đúng');

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return true;
};

exports.generate2FA = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const secret = speakeasy.generateSecret({
    name: `UptimeMonitor (${user.email})`,
  });

  // Save secret temporarily until verified
  user.twoFactorSecret = secret.base32;
  await user.save();

  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
  return { qrCode: qrCodeUrl, secret: secret.base32 };
};

exports.verify2FA = async (userId, token) => {
  const user = await User.findById(userId).select('+twoFactorSecret');
  if (!user || !user.twoFactorSecret) throw new Error('User not found or 2FA not initialized');

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token: token,
    window: 1, // Allow 30 seconds before or after
  });

  if (!verified) throw new Error('Mã xác thực không đúng');

  user.is2FAEnabled = true;
  await user.save();
  return true;
};

exports.deleteAccount = async (userId) => {
  // Hard delete user and all associated data
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Cancel any active subscriptions (mock logic: would ideally hook into Stripe/payment provider)
  
  // Delete all associated API Keys
  await ApiKey.deleteMany({ userId });
  
  // Actually delete the user
  await User.findByIdAndDelete(userId);
  
  return true;
};
