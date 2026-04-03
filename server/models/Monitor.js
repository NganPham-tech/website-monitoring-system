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
    protocol: {
      type: String,
      enum: ['http', 'ping', 'port'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'pending'],
      default: 'pending',
      index: true,
    },
    frequency: {
      type: Number,
      required: true,
      min: 1, // minutes
      default: 5,
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
