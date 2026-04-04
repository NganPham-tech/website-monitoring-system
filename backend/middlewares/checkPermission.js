/**
 * checkPermission.js
 * ─────────────────────────────────────────────────────────────────────────────
 * RBAC Middleware Factory.
 *
 * Sử dụng:
 *   checkPermission(feature)
 *     → Kiểm tra Permission table: role của user có access vào feature này không?
 *
 *   checkPermission(feature, ['owner', 'admin'])
 *     → Shortcut role check trực tiếp, không cần tra bảng Permission.
 *       Dùng cho các endpoint write (invite, delete, patch permissions).
 *
 * Side-effects (luôn thực hiện):
 *   req.organization  ← Organization document của user hiện tại
 *   req.membership    ← OrganizationMember document của user (chứa role)
 *
 * Ví dụ trong routes:
 *   // Ai có quyền 'team' mới được xem danh sách thành viên
 *   router.get('/members', checkPermission('team'), getMembers);
 *
 *   // Chỉ owner hoặc admin mới được xóa thành viên
 *   router.delete('/members/:id', checkPermission('team', ['owner', 'admin']), removeMember);
 *
 *   // Chỉ owner mới được sửa permission matrix
 *   router.patch('/permissions', checkPermission('team', ['owner']), updatePermission);
 */

const OrganizationMember = require('../models/OrganizationMember');
const Permission = require('../models/Permission');
const { getOrCreateOrg } = require('../services/teamService');

/**
 * @param {string}   feature        Tên tính năng cần kiểm tra ('monitor' | 'reports' | 'team' | 'admin')
 * @param {string[]} [requiredRoles] Nếu cung cấp, chỉ cho phép các role này (bỏ qua Permission table)
 */
const checkPermission = (feature, requiredRoles = null) => {
    return async (req, res, next) => {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // ── 1. Lấy hoặc khởi tạo Organization của user ──────────────────────────
        const org = await getOrCreateOrg(userId);

        // ── 2. Tìm membership của user trong org ────────────────────────────────
        const membership = await OrganizationMember.findOne({
            organizationId: org._id,
            userId,
        }).lean();

        if (!membership) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không thuộc tổ chức này',
            });
        }

        // ── 3. Gán vào request để controller dùng lại (tránh query lặp) ─────────
        req.organization = org;
        req.membership = membership;

        // ── 4. Owner luôn có toàn quyền (failsafe) ───────────────────────────────
        if (membership.role === 'owner') {
            return next();
        }

        // ── 5. Direct role check (nhanh hơn, không cần tra bảng) ────────────────
        if (requiredRoles && requiredRoles.length > 0) {
            if (!requiredRoles.includes(membership.role)) {
                return res.status(403).json({
                    success: false,
                    message: `Thao tác này yêu cầu vai trò: ${requiredRoles.join(' hoặc ')}. Vai trò hiện tại của bạn là "${membership.role}".`,
                });
            }
            return next();
        }

        // ── 6. Feature-based permission check (tra bảng Permission) ─────────────
        const permission = await Permission.findOne({
            organizationId: org._id,
            role: membership.role,
            feature,
        }).lean();

        if (!permission || !permission.access) {
            return res.status(403).json({
                success: false,
                message: `Vai trò "${membership.role}" không có quyền truy cập tính năng "${feature}". Liên hệ Admin để được cấp quyền.`,
            });
        }

        next();
    };
};

module.exports = checkPermission;
