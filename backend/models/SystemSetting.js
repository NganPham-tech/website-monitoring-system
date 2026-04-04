const mongoose = require('mongoose');

const systemSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global_config',
    },
    defaultCheckInterval: {
      type: Number,
      default: 5, // minutes
    },
    maxMonitorsPerUser: {
      type: Number,
      default: 50,
    },
    alertRetentionDays: {
      type: Number,
      default: 30,
    },
    databaseBackupSync: {
      type: Number,
      default: 24, // hours
    },
    apiRateLimit: {
      type: Number,
      default: 100, // requests per hour
    },
  },
  { timestamps: true }
);

const SystemSetting = mongoose.model('SystemSetting', systemSettingSchema);
module.exports = SystemSetting;
