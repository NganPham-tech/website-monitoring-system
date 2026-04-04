const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    planKey: {
      type: String,
      required: true,
      unique: true, // ví dụ: free, pro, enterprise
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stripePriceId: {
      type: String,
      default: null, // Lưu Price ID của giao diện Stripe để đồng bộ checkout về sau
    },
    limits: {
      maxMonitors: { type: Number, required: true },
      maxTeamMembers: { type: Number, required: true },
      checkInterval: { type: Number, required: true }, // giây
    },
    isPopular: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
