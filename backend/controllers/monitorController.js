const monitorService = require('../services/monitorService');
const { monitorListSchema, createMonitorSchema } = require('../schemas/monitorValidations');

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

  /**
   * Create a new monitor
   * POST /api/monitors
   */
  createMonitor: async (req, res) => {
    // 1. Validate body using Zod
    const validatedData = createMonitorSchema.parse(req.body);

    // 2. Call service to save to DB
    const monitor = await monitorService.createMonitor(req.user.id, validatedData);

    // 3. Respond
    return res.status(201).json({
      success: true,
      message: 'Monitor đã được tạo thành công và đang bắt đầu giám sát.',
      data: monitor,
    });
  },
};

module.exports = monitorController;
