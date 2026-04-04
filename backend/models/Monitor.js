const mongoose = require('mongoose');

const monitorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    protocol: {
      type: String,
      enum: ['http', 'https', 'ping', 'port', 'keyword'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'pending'],
      default: 'pending',
      index: true,
    },
    interval: {
      type: String, // e.g., '30s', '1m', '5m'
      required: true,
      default: '5m',
    },
    timeout: {
      type: Number, // ms
      required: true,
      default: 30000,
    },
    retries: {
      type: Number,
      default: 3,
    },
    httpMethod: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE'],
      default: 'GET',
    },
    portNumber: {
      type: Number,
    },
    searchKeyword: {
      type: String,
    },
    locations: {
      type: [String],
      required: true,
      default: ['asian'],
    },
    alertTriggers: {
      isDown: { type: Boolean, default: true },
      slowResponse: { type: Boolean, default: false },
      slowThreshold: { type: Number }, // ms
      sslExpiry: { type: Boolean, default: false },
      sslDays: { type: Number },
    },
    alertChannels: {
      type: [String],
      required: true,
      default: ['email'],
    },
    lastCheck: {
      type: Date,
    },
    uptime: {
      type: Number,
      default: 100,
    },
    responseTime: {
      type: Number,
      default: 0,
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

// Indexes for faster searching and filtering
monitorSchema.index({ name: 'text', url: 'text' });
monitorSchema.index({ userId: 1, status: 1 });
monitorSchema.index({ userId: 1, protocol: 1 });

const Monitor = mongoose.model('Monitor', monitorSchema);
module.exports = Monitor;
