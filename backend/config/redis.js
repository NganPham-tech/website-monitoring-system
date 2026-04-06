// const Redis = require('ioredis');
const { logger } = require('../utils/logger');
const memoryCache = require('../utils/memoryCache');

// Mock Redis Client cho mục đích Demo (Thay thế Redis bằng Memory Cache)
const redisClient = {
  get: async (key) => {
    return memoryCache.get(key);
  },
  setex: async (key, ttlSeconds, value) => {
    // memoryCache dùng phút, setex dùng giây
    memoryCache.set(key, value, ttlSeconds / 60);
    return 'OK';
  },
  on: (event, callback) => {
    if (event === 'connect') {
      setTimeout(() => {
        logger.info('Mock Redis (Memory Cache) initialized');
        callback();
      }, 0);
    }
  }
};

module.exports = redisClient;
