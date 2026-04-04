const Announcement = require('../models/Announcement');
const User = require('../models/User');
const emailService = require('../services/emailService');
const { logger } = require('../utils/logger');

exports.getAnnouncements = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const announcements = await Announcement.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json(announcements); // Direct array return matching React query setup
};

exports.createAnnouncement = async (req, res) => {
  const { title, content, target, type, sendEmail } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and Content are required.' });
  }

  // 1. Save to DB immediately
  const announcement = await Announcement.create({
    title,
    content,
    target,
    type,
    sendEmail
  });

  logger.info(`Admin ${req.user.email} created new announcement: ${title}`);

  // 2. Async dispatch email logic if flag is checked
  if (sendEmail) {
    let query = {};
    if (target === 'pro_ent') {
      query.plan = { $in: ['Cơ bản - 50 Monitors', 'Nâng cao - 200 Monitors'] };
    } else if (target === 'free') {
      query.plan = 'Miễn phí - 5 Monitors';
    }
    // if target === 'all', query stays {}

    // Exclude users who don't want notifications if you want to respect preferences,
    // assuming system announcements go to everyone or depending on a sub setting.
    // We'll collect the emails.
    const users = await User.find(query).select('email isActive').lean();
    const activeEmails = users.filter(u => u.isActive).map(u => u.email);

    if (activeEmails.length > 0) {
      // Fire and forget (executed in detached background loop) inside emailService
      emailService.sendBulkEmailsAsync(activeEmails, title, content);
    }
  }

  // 3. Return HTTP immediately without blocking for the emails to finish
  res.status(201).json({ success: true, data: announcement });
};
