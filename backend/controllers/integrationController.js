const integrationService = require('../services/integrationService');
const { saveIntegrationSchema } = require('../schemas/integrationSchema');

exports.getAll = async (req, res) => {
    try {
        const integrations = await integrationService.getIntegrations(req.user.id);
        res.status(200).json({ success: true, data: integrations });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.save = async (req, res) => {
    const validate = saveIntegrationSchema.safeParse(req.body);
    if (!validate.success) {
        return res.status(400).json({
            success: false,
            message: validate.error.errors[0]?.message || 'Lỗi dữ liệu cấu hình tích hợp'
        });
    }

    try {
        await integrationService.saveIntegration(req.user.id, validate.data.type, validate.data.configData);
        res.status(201).json({ success: true, message: 'Kết nối thành công!' });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        await integrationService.deleteIntegration(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: 'Đã ngắt kết nối an toàn!' });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
