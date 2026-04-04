const mongoose = require('mongoose');

const pingLogSchema = new mongoose.Schema(
  {
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Monitor',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['online', 'offline'],
      required: true,
      index: true,
    },
    responseTime: {
      type: Number, // ms
      required: true,
    },
    statusCode: {
      type: Number,
    },
    message: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compounded index for getting recent logs for a monitor
pingLogSchema.index({ monitorId: 1, timestamp: -1 });

const PingLog = mongoose.model('PingLog', pingLogSchema);
module.exports = PingLog;
