/**
 * teamService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Business logic layer cho Team Management & RBAC.
 * Controllers gọi service, service gọi Models — không có logic trực tiếp ở routes.
 *
 * Nguyên tắc Data Isolation: Mọi query đều scope theo organizationId,
 * đảm bảo team A không bao giờ nhìn thấy dữ liệu của team B.
 */

const mongoose = require('mongoose');
const Organization = require('../models/Organization');
const OrganizationMember = require('../models/OrganizationMember');
const Invite = require('../models/Invite');
const Permission = require('../models/Permission');
const User = require('../models/User');

// ─── Default permission matrix seed ──────────────────────────────────────────
/**
 * Quyền mặc định được tạo khi một Organization mới được khởi tạo.
 *   owner  → tất cả true  (failsafe thêm ở middleware, nhưng cũng seed để đủ)
 *   admin  → monitor, reports, team = true; admin = false
 *   member → monitor = true; reports, team, admin = false
 */
const DEFAULT_PERMISSIONS = [
    { role: 'owner', feature: 'monitor', access: true },
    { role: 'owner', feature: 'reports', access: true },
    { role: 'owner', feature: 'team', access: true },
    { role: 'owner', feature: 'admin', access: true },
    { role: 'admin', feature: 'monitor', access: true },
    { role: 'admin', feature: 'reports', access: true },
    { role: 'admin', feature: 'team', access: true },
    { role: 'admin', feature: 'admin', access: false },
    { role: 'member', feature: 'monitor', access: true },
    { role: 'member', feature: 'reports', access: false },
    { role: 'member', feature: 'team', access: false },
    { role: 'member', feature: 'admin', access: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Lấy hoặc tạo Organization cho userId.
 * Nếu user chưa thuộc org nào, tự động tạo org mới và gán họ làm Owner.
 * Đồng thời seed permission matrix mặc định cho org mới.
 *
 * @param   {string} userId  MongoDB ObjectId string của User hiện tại
 * @returns {Organization}   Document Organization (populated)
 */
const getOrCreateOrg = async (userId) => {
    // Tìm membership hiện tại của user
    const existing = await OrganizationMember.findOne({ userId })
        .populate('organizationId')
        .lean();

    if (existing && existing.organizationId) {
        return existing.organizationId;
    }

    // Chưa có org → tạo mới
    const user = await User.findById(userId).lean();
    const orgName =
        user?.company?.trim() ||
        `${user?.firstName || 'My'} Team`;

    const org = await Organization.create({ name: orgName, ownerId: userId });

    // Tạo membership owner
    await OrganizationMember.create({
        organizationId: org._id,
        userId,
        role: 'owner',
    });

    // Seed permission matrix (ordered: false để không dừng nếu có duplicate)
    await Permission.insertMany(
        DEFAULT_PERMISSIONS.map((p) => ({ ...p, organizationId: org._id })),
        { ordered: false }
    );

    return org;
};

// ─── Members ──────────────────────────────────────────────────────────────────

/**
 * Lấy danh sách thành viên của org.
 *
 * @param   {ObjectId} orgId
 * @returns {Array}  Mảng member objects đã được format
 */
const getMembers = async (orgId) => {
    const memberships = await OrganizationMember.find({ organizationId: orgId })
        .populate('userId', 'firstName lastName email isActive createdAt')
        .lean();

    return memberships.map((m) => ({
        id: m.userId._id,
        name: `${m.userId.firstName} ${m.userId.lastName}`.trim(),
        email: m.userId.email,
        role: m.role,
        isActive: m.userId.isActive,
        joinedAt: m.joinedAt,
    }));
};

/**
 * Gửi lời mời thành viên mới vào org.
 * Tạo Invite record với trạng thái 'pending'.
 *
 * @param   {ObjectId} orgId
 * @param   {ObjectId} invitedBy   User ID của người gửi lời mời
 * @param   {string}   email       Email người được mời
 * @param   {string}   role        'admin' | 'member'
 * @returns {Invite}
 */
const inviteMember = async (orgId, invitedBy, email, role) => {
    // Kiểm tra email này đã là thành viên chưa
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
        const alreadyMember = await OrganizationMember.findOne({
            organizationId: orgId,
            userId: existingUser._id,
        }).lean();
        if (alreadyMember) {
            const err = new Error('Người dùng này đã là thành viên của team');
            err.statusCode = 409;
            throw err;
        }
    }

    // Kiểm tra lời mời pending đã tồn tại
    const pendingInvite = await Invite.findOne({
        organizationId: orgId,
        invitedEmail: email,
        status: 'pending',
    }).lean();
    if (pendingInvite) {
        const err = new Error('Đã có lời mời đang chờ chấp nhận cho email này');
        err.statusCode = 409;
        throw err;
    }

    const invite = await Invite.create({
        organizationId: orgId,
        invitedEmail: email,
        invitedBy,
        role,
    });

    return invite;
};

/**
 * Cập nhật vai trò thành viên.
 *
 * @param   {ObjectId} orgId
 * @param   {string}   targetUserId  ID của thành viên cần cập nhật
 * @param   {string}   newRole       'admin' | 'member'
 */
const updateMember = async (orgId, targetUserId, newRole) => {
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
        const err = new Error('ID thành viên không hợp lệ');
        err.statusCode = 400;
        throw err;
    }

    const membership = await OrganizationMember.findOne({
        organizationId: orgId,
        userId: targetUserId,
    });

    if (!membership) {
        const err = new Error('Thành viên không tồn tại trong team này');
        err.statusCode = 404;
        throw err;
    }

    if (membership.role === 'owner') {
        const err = new Error('Không thể thay đổi vai trò của Owner');
        err.statusCode = 403;
        throw err;
    }

    membership.role = newRole;
    await membership.save();
    return membership;
};

/**
 * Xóa thành viên khỏi org.
 *
 * @param   {ObjectId} orgId
 * @param   {string}   targetUserId   ID của thành viên bị xóa
 * @param   {string}   requesterId    ID của người thực hiện hành động (để ngăn tự xóa)
 */
const removeMember = async (orgId, targetUserId, requesterId) => {
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
        const err = new Error('ID thành viên không hợp lệ');
        err.statusCode = 400;
        throw err;
    }

    if (String(targetUserId) === String(requesterId)) {
        const err = new Error('Bạn không thể tự xóa chính mình khỏi team');
        err.statusCode = 400;
        throw err;
    }

    const membership = await OrganizationMember.findOne({
        organizationId: orgId,
        userId: targetUserId,
    });

    if (!membership) {
        const err = new Error('Thành viên không tồn tại trong team này');
        err.statusCode = 404;
        throw err;
    }

    if (membership.role === 'owner') {
        const err = new Error('Không thể xóa Owner khỏi team');
        err.statusCode = 403;
        throw err;
    }

    await membership.deleteOne();
};

// ─── Stats ────────────────────────────────────────────────────────────────────

/**
 * Thống kê nhanh cho org: total members, managers, members, pending invites.
 *
 * @param   {ObjectId} orgId
 * @returns {{ totalMembers, managers, members, pendingInvites }}
 */
const getStats = async (orgId) => {
    const [totalMembers, managers, pendingInvites] = await Promise.all([
        OrganizationMember.countDocuments({ organizationId: orgId }),
        OrganizationMember.countDocuments({
            organizationId: orgId,
            role: { $in: ['owner', 'admin'] },
        }),
        Invite.countDocuments({ organizationId: orgId, status: 'pending' }),
    ]);

    return {
        totalMembers,
        managers,
        members: totalMembers - managers,
        pendingInvites,
    };
};

// ─── Permissions ──────────────────────────────────────────────────────────────

/**
 * Lấy toàn bộ ma trận quyền của org dưới dạng nested object.
 * Format: { owner: { monitor: true, ... }, admin: {...}, member: {...} }
 *
 * @param   {ObjectId} orgId
 * @returns {Object}   Permission matrix
 */
const getPermissions = async (orgId) => {
    const rows = await Permission.find({ organizationId: orgId }).lean();

    const matrix = {};
    for (const row of rows) {
        if (!matrix[row.role]) matrix[row.role] = {};
        matrix[row.role][row.feature] = row.access;
    }
    return matrix;
};

/**
 * Cập nhật ma trận quyền theo batch.
 * Owner permissions không thể thay đổi – bị bỏ qua nếu có trong payload.
 *
 * Payload ví dụ:
 *   { admin: { monitor: true, team: false }, member: { monitor: true } }
 *
 * @param   {ObjectId} orgId
 * @param   {Object}   matrix  { [role]: { [feature]: boolean } }
 */
const updatePermissions = async (orgId, matrix) => {
    const bulkOps = [];

    for (const [role, features] of Object.entries(matrix)) {
        // Owner permissions không được phép sửa
        if (role === 'owner') continue;

        for (const [feature, access] of Object.entries(features)) {
            bulkOps.push({
                updateOne: {
                    filter: { organizationId: orgId, role, feature },
                    update: { $set: { access } },
                    upsert: true,
                },
            });
        }
    }

    if (bulkOps.length === 0) {
        const err = new Error('Không có thay đổi nào được áp dụng (owner permissions không thể sửa)');
        err.statusCode = 400;
        throw err;
    }

    await Permission.bulkWrite(bulkOps);
};

// ─── Exports ──────────────────────────────────────────────────────────────────
module.exports = {
    getOrCreateOrg,
    getMembers,
    inviteMember,
    updateMember,
    removeMember,
    getStats,
    getPermissions,
    updatePermissions,
};
