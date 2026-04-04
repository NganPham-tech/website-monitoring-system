const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    timezone: {
      type: String,
      default: 'Asia/Ho_Chi_Minh',
    },
    preferences: {
      emailAlerts: { type: Boolean, default: true },
      telegramAlerts: { type: Boolean, default: false },
      weeklyReport: { type: Boolean, default: true },
      monthlyReport: { type: Boolean, default: false },
      maintenanceAlerts: { type: Boolean, default: true },
    },
    is2FAEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Passwords are not required for OAuth users
      select: false, // Don't return password by default in queries
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local',
    },
    providerId: {
      type: String,
      default: null,
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    plan: {
      type: String,
      enum: ['Miễn phí - 5 Monitors', 'Cơ bản - 50 Monitors', 'Nâng cao - 200 Monitors', 'free', 'pro', 'enterprise'],
      default: 'Miễn phí - 5 Monitors',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
