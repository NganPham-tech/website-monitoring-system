const maintenanceService = require('../services/maintenanceService');
const { createMaintenanceSchema, updateMaintenanceSchema } = require('../schemas/maintenanceSchema');

exports.getAll = async (req, res) => {
    try {
        const maintenances = await maintenanceService.getMaintenances(req.user.id, req.query);
        res.status(200).json({ success: true, data: maintenances });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.create = async (req, res) => {
    const validate = createMaintenanceSchema.safeParse(req.body);
    if (!validate.success) {
        return res.status(400).json({
            success: false,
            message: validate.error.errors[0]?.message || 'Lỗi dữ liệu đầu vào'
        });
    }

    try {
        const data = await maintenanceService.createMaintenance(req.user.id, validate.data);
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.update = async (req, res) => {
    const validate = updateMaintenanceSchema.safeParse(req.body);
    if (!validate.success) {
        return res.status(400).json({
            success: false,
            message: validate.error.errors[0]?.message || 'Lỗi dữ liệu đầu vào'
        });
    }

    try {
        const data = await maintenanceService.updateMaintenance(req.params.id, req.user.id, validate.data);
        res.status(200).json({ success: true, data });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        await maintenanceService.deleteMaintenance(req.params.id, req.user.id);
        res.status(200).json({ success: true, message: 'Xóa kế hoạch bảo trì thành công' });
    } catch (err) {
        res.status(err.status || 500).json({ success: false, message: err.message });
    }
};
