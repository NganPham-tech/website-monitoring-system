const alertRuleService = require('../services/alertRuleService');
const { updateAlertRuleSchema } = require('../schemas/alertRuleSchema');
const { ZodError } = require('zod');
const { logger } = require('../utils/logger');

const alertRuleController = {
  
  getSettings: async (req, res) => {
    try {
      const userId = req.user.id;
      const settings = await alertRuleService.getAlertSetting(userId);
      return res.status(200).json(settings);
    } catch (error) {
      logger.error('Error fetching alert rules:', error);
      return res.status(500).json({ message: 'Lỗi server khi lấy cấu hình cảnh báo' });
    }
  },

  updateSettings: async (req, res) => {
    const userId = req.user.id;
    const payload = req.body;

    try {
      // 1. Zod Validation
      const validatedData = updateAlertRuleSchema.parse({ body: payload });

      // 2. Perform DB Update
      const updatedSettings = await alertRuleService.updateAlertSetting(userId, validatedData.body);

      return res.status(200).json(updatedSettings);

    } catch (error) {
      if (error instanceof ZodError) {
        // Handle Zod Validation Errors strictly
        const errorMessages = error.errors.map(err => `${err.path.join('.').replace('body.', '')}: ${err.message}`);
        logger.warn(`Alert Rule Validation Error for user ${userId}:`, error.errors);
        return res.status(400).json({ 
            message: 'Dữ liệu không hợp lệ', 
            details: errorMessages 
        });
      }

      logger.error('Error updating alert rules:', error);
      return res.status(500).json({ message: 'Lỗi server khi lưu cấu hình' });
    }
  }

};

module.exports = alertRuleController;
