const mongoose = require('mongoose');

const TriggerSchema = new mongoose.Schema({
  websiteDown: { type: Boolean, default: true },
  slowResponse: {
    enabled: { type: Boolean, default: false },
    threshold: { type: Number, default: 500, min: 100 }
  },
  ssl: {
    enabled: { type: Boolean, default: false },
    daysBefore: { type: Number, default: 7, min: 1 }
  }
}, { _id: false });

const ChannelSchema = new mongoose.Schema({
  email: {
    enabled: { type: Boolean, default: false },
    target: { type: String, default: '' }
  },
  discord: {
    enabled: { type: Boolean, default: false },
    target: { type: String, default: '' }
  },
  telegram: {
    enabled: { type: Boolean, default: false },
    target: { type: String, default: '' }
  },
  sms: {
    enabled: { type: Boolean, default: false },
    target: { type: String, default: '' }
  }
}, { _id: false });

const SilentModeDaysSchema = new mongoose.Schema({
  mon: { type: Boolean, default: false },
  tue: { type: Boolean, default: false },
  wed: { type: Boolean, default: false },
  thu: { type: Boolean, default: false },
  fri: { type: Boolean, default: false },
  sat: { type: Boolean, default: false },
  sun: { type: Boolean, default: false }
}, { _id: false });

const SilentModeSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  startTime: { type: String, default: '22:00' }, // Format HH:mm
  endTime: { type: String, default: '06:00' },   // Format HH:mm
  days: {
    type: SilentModeDaysSchema,
    default: () => ({})
  }
}, { _id: false });

const CustomPayloadSchema = new mongoose.Schema({
  title: { type: String, default: '{name} đang gặp sự cố' },
  body: { type: String, default: 'Website {url} không thể truy cập.\nStatus: {status}\nThời gian: {time}\n\nVui lòng kiểm tra ngay!' }
}, { _id: false });

const AlertRuleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
    unique: true // Each user has exactly one primary alert setting
  },
  triggers: {
    type: TriggerSchema,
    default: () => ({})
  },
  channels: {
    type: ChannelSchema,
    default: () => ({})
  },
  silentMode: {
    type: SilentModeSchema,
    default: () => ({})
  },
  customPayload: {
    type: CustomPayloadSchema,
    default: () => ({})
  }
}, { timestamps: true });

module.exports = mongoose.model('AlertRule', AlertRuleSchema);
