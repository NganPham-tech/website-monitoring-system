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

// ─── INDEX STRATEGY ───────────────────────────────────────────────────────────
//
// 1. { monitorId: 1, timestamp: -1 }  ← index tổng quát
//    Dùng cho: query log gần đây của 1 monitor, monitor detail page.
//    MongoDB sẽ dùng index này khi có $in trên monitorIds + range timestamp.
pingLogSchema.index({ monitorId: 1, timestamp: -1 });

// 2. { monitorId: 1, status: 1, timestamp: -1 }  ← index cho report queries
//    Dùng cho: tính uptime/downtime trong khoảng thời gian dài (7d, 30d, 90d).
//    Khi filter { monitorId: {$in:...}, status: 'offline', timestamp: {$gte,$lt} },
//    MongoDB dùng prefix (monitorId, status) → giảm ~60-80% IO so với full scan.
//    Đặc biệt hiệu quả khi tỷ lệ offline thấp (< 5%) vì index rất selective.
pingLogSchema.index({ monitorId: 1, status: 1, timestamp: -1 });

const PingLog = mongoose.model('PingLog', pingLogSchema);
module.exports = PingLog;
