const Maintenance = require('../models/Maintenance');
const { startOfDay } = require('date-fns');
const mongoose = require('mongoose');

exports.getMaintenances = async (userId, filters) => {
    const { range, status } = filters;
    const query = { userId: new mongoose.Types.ObjectId(userId) };

    // Upcoming range cho Gantt Chart Timeline (Lấy hôm nay và tương lai)
    if (range === 'upcoming') {
        const today = startOfDay(new Date());
        query.endTime = { $gte: today };
    }

    const maintenances = await Maintenance.find(query)
        .populate('monitors', 'name url')
        .sort({ startTime: 1 });

    // Do 'status' là virtual field nên nếu client filter status, ta lọc sau query (Do số lượng event không quá lớn)
    let result = maintenances;
    if (status) {
        result = maintenances.filter(m => m.status === status);
    }

    return result;
};

exports.createMaintenance = async (userId, data) => {
    const newMaintenance = new Maintenance({
        ...data,
        userId: new mongoose.Types.ObjectId(userId)
    });

    await newMaintenance.save();
    return await newMaintenance.populate('monitors', 'name url');
};

exports.updateMaintenance = async (id, userId, data) => {
    const maintenance = await Maintenance.findOne({
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId)
    });

    if (!maintenance) {
        const error = new Error('Không tìm thấy bản ghi bảo trì');
        error.status = 404;
        throw error;
    }

    // Khóa cập nhật nếu status không phải "Scheduled"
    if (maintenance.status !== 'scheduled') {
        const error = new Error('Chỉ có thể cập nhật các kế hoạch đang ở trạng thái Cầm chờ (Scheduled)');
        error.status = 400;
        throw error;
    }

    Object.assign(maintenance, data);
    await maintenance.save();
    return await maintenance.populate('monitors', 'name url');
};

exports.deleteMaintenance = async (id, userId) => {
    const maintenance = await Maintenance.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId)
    });

    if (!maintenance) {
        const error = new Error('Không tìm thấy bản ghi cần xóa');
        error.status = 404;
        throw error;
    }
    return true;
};

/**
 * ----------------------------------------------------
 * CORE BUSINESS RULE: Chặn False Alerts
 * ----------------------------------------------------
 * @param {string} monitorId - ID của Monitor được cấu hình.
 * @returns {boolean} - true nếu đang trong chu kỳ bảo trì.
 * Engine (Ping Engine / Alert System) sẽ phụ thuộc hàm này:
 * const isMaint = await checkIfMonitorInMaintenance(monitor._id);
 * if (isMaint) return; // Bỏ qua việc Gửi Alert Email/SMS !!!
 */
exports.checkIfMonitorInMaintenance = async (monitorId) => {
    const now = new Date();

    // Trạng thái 'Ongoing' được đánh giá bằng thời gian thực ở Data Store:
    // (startTime <= NOW <= endTime)
    const activeMaintenance = await Maintenance.findOne({
        monitors: new mongoose.Types.ObjectId(monitorId),
        startTime: { $lte: now },
        endTime: { $gte: now }
    }).select('_id');

    return !!activeMaintenance;
};
