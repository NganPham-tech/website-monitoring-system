const monitorService = require('../services/monitorService');
const { monitorListSchema } = require('../schemas/monitorValidations');

const monitorController = {
  /**
   * Get monitors list for current user
   * GET /api/monitors
   */
  getMonitors: async (req, res) => {
    // Validate query parameters using Zod
    const validatedQuery = monitorListSchema.parse(req.query);

    // Fetch data from service
    const { monitors, pagination } = await monitorService.getMonitors(req.user.id, validatedQuery);

    // Respond with standardized JSON structure
    return res.status(200).json({
      success: true,
      data: monitors,
      pagination: {
        total: pagination.total,
        page: pagination.page,
        limit: pagination.limit,
        pages: pagination.pages,
      },
    });
  },
};

module.exports = monitorController;
