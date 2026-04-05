const statusPageService = require('../services/statusPageService');
const redisClient = require('../config/redis');
const { logger } = require('../utils/logger');

const statusPageController = {
  getSummary: async (req, res) => {
    const CACHE_KEY = 'status-page-summary';
    const CACHE_TTL = 60; // 60 seconds

    try {
      // 1. Try fetching from Redis Cache
      const cachedData = await redisClient.get(CACHE_KEY);
      if (cachedData) {
        return res.status(200).json(JSON.parse(cachedData));
      }

      // 2. Cache miss, fetch fresh data from Service
      const summary = await statusPageService.getSummary();

      // 3. Store in Redis asynchronously
      await redisClient.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(summary));

      return res.status(200).json(summary);
    } catch (error) {
      logger.error('Error fetching public status page summary:', error);
      
      // Fallback: if Redis is down, we still try to get fresh data
      try {
          const freshData = await statusPageService.getSummary();
          return res.status(200).json(freshData);
      } catch (innerError) {
          return res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  },

  subscribe: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Vui lòng nhập email' });
    }

    try {
      const result = await statusPageService.subscribe(email);
      return res.status(201).json(result);
    } catch (error) {
      if (error.message === 'Email này đã được đăng ký') {
        return res.status(409).json({ message: error.message });
      }
      logger.error('Error during status page subscription:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = statusPageController;
