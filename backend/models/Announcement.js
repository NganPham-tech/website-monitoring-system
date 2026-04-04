const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true, // Stores raw HTML
  },
  target: {
    type: String,
    enum: ['all', 'pro_ent', 'free'],
    default: 'all',
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'critical'],
    default: 'info',
  },
  sendEmail: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
