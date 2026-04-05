const alertService = require('../services/alertService');
const { getAlertsQuerySchema } = require('../schemas/alertSchema');

exports.getAlerts = async (req, res) => {
    // Validate request query parameters
    const parseResult = getAlertsQuerySchema.safeParse(req.query);

    if (!parseResult.success) {
        return res.status(400).json({
            success: false,
            message: "Lỗi validation tham số truy vấn.",
            errors: parseResult.error.errors
        });
    }

    const filters = parseResult.data;

    // Extract userId injected by authMiddleware
    const userId = req.user.id;

    try {
        const result = await alertService.getAlertHistory(userId, filters);

        return res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
            stats: result.stats
        });
    } catch (error) {
        console.error("Error in getAlerts controller:", error);
        return res.status(500).json({
            success: false,
            message: "Đã xảy ra lỗi hệ thống khi lấy lịch sử cảnh báo."
        });
    }
};
