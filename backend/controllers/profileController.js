const profileService = require('../services/profileService');
const { updateProfileSchema, changePasswordSchema, verify2FASchema } = require('../schemas/profileValidation');

exports.getProfile = async (req, res) => {
  const profile = await profileService.getProfile(req.user.id);
  res.status(200).json({ success: true, data: profile });
};

exports.updateProfile = async (req, res) => {
  // Validate request body
  const validation = updateProfileSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.format() });
  }

  const updatedProfile = await profileService.updateProfile(req.user.id, validation.data);
  res.status(200).json({ success: true, data: updatedProfile });
};

exports.changePassword = async (req, res) => {
  const validation = changePasswordSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.format() });
  }

  await profileService.changePassword(req.user.id, validation.data);
  res.status(200).json({ success: true, message: 'Password changed successfully' });
};

exports.generate2FA = async (req, res) => {
  const result = await profileService.generate2FA(req.user.id);
  res.status(200).json({ success: true, data: result });
};

exports.verify2FA = async (req, res) => {
  const validation = verify2FASchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.format() });
  }

  await profileService.verify2FA(req.user.id, validation.data.code);
  res.status(200).json({ success: true, message: '2FA enabled successfully' });
};

exports.deleteAccount = async (req, res) => {
  const { confirmation } = req.body;
  if (confirmation !== 'CONFIRM') {
    return res.status(400).json({ success: false, message: 'Invalid confirmation string' });
  }

  await profileService.deleteAccount(req.user.id);
  
  // Clear Auth cookie/session if any
  res.clearCookie('jwt');
  res.status(200).json({ success: true, message: 'Account deleted successfully' });
};

exports.getBillingInfo = async (req, res) => {
  const profile = await profileService.getProfile(req.user.id);
  
  // Mock billing info derived from user plan
  const planInfoMap = {
    'Miễn phí - 5 Monitors': { name: 'Free Plan', monitors: 5, interval: '5m', teamMembers: 1 },
    'Cơ bản - 50 Monitors': { name: 'Basic Plan', monitors: 50, interval: '1m', teamMembers: 3 },
    'Nâng cao - 200 Monitors': { name: 'Pro Plan', monitors: 200, interval: '30s', teamMembers: 10 }
  };
  
  const billingInfo = planInfoMap[profile.plan] || planInfoMap['Miễn phí - 5 Monitors'];
  res.status(200).json({ success: true, data: billingInfo });
};

exports.getNotificationSettings = async (req, res) => {
  const profile = await profileService.getProfile(req.user.id);
  res.status(200).json({ success: true, data: profile.preferences });
};

exports.updateNotificationSettings = async (req, res) => {
  const validation = updateProfileSchema.shape.preferences.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.format() });
  }
  
  const updatedProfile = await profileService.updateProfile(req.user.id, { preferences: validation.data });
  res.status(200).json({ success: true, data: updatedProfile.preferences });
};
