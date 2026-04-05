const Redis = require('ioredis');
const { logger } = require('../utils/logger');

// This is a simple wrapper, in production you'd use environment variables 
// from your .env file like REDIS_URL
const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on('connect', () => {
  logger.info('Redis connection established');
});

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

module.exports = redisClient;
