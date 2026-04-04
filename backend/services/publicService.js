const User = require('../models/User');
const Monitor = require('../models/Monitor');
const PingLog = require('../models/PingLog');
const Newsletter = require('../models/Newsletter');

// --- Memory Cache Mechanism ---
const cache = new Map();
const STATS_CACHE_KEY = 'public_stats';
const TTL_MS = 60 * 60 * 1000; // 1 hour

const getStats = async () => {
  const cachedData = cache.get(STATS_CACHE_KEY);
  if (cachedData && Date.now() < cachedData.expiry) {
    return cachedData.data;
  }

  // Tăng tốc độ truy vấn bằng cách dùng method estimatedDocumentCount của Mongoose thay vì đếm toàn bộ
  const [totalUsers, totalMonitors, pingLogs] = await Promise.all([
    User.estimatedDocumentCount(),
    Monitor.estimatedDocumentCount(),
    PingLog.estimatedDocumentCount()
  ]);

  const data = {
    totalUsers,
    totalMonitors,
    totalPingLogs: pingLogs,
    accuracy: '99.9%', // Static metrics 
    support: '24/7'
  };

  // Assign cho Object Cache mới nhất kèm TTL
  cache.set(STATS_CACHE_KEY, {
    data,
    expiry: Date.now() + TTL_MS
  });

  return data;
};

const subscribeNewsletter = async (email, name, message) => {
  // Check nếu email đã đăng ký
  const existing = await Newsletter.findOne({ email });
  if (existing) {
    // Báo kết quả ảo để user không thăm dò được email thuộc db
    return true; 
  }

  const subscription = new Newsletter({ email, name, message });
  await subscription.save();
  return true;
};

module.exports = {
  getStats,
  subscribeNewsletter
};
