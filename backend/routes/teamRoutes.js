/**
 * teamRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Routes cho Team Management & Permissions API.
 * Mounted tại: /api/team
 *
 * Tất cả routes đều yêu cầu:
 *   1. authMiddleware     → xác thực JWT, gán req.user.id
 *   2. checkPermission    → load org context (req.organization, req.membership)
 *                           + kiểm tra role/feature access
 *
 * ┌──────────────────────────────┬──────────────────────────────────────────────────┐
 * │ Method + Path                │ Quyền yêu cầu                                    │
 * ├──────────────────────────────┼──────────────────────────────────────────────────┤
 * │ GET    /stats                │ feature 'team' = true (theo Permission table)     │
 * │ GET    /members              │ feature 'team' = true                             │
 * │ POST   /invite               │ role = owner | admin                              │
 * │ PUT    /members/:id          │ role = owner | admin                              │
 * │ DELETE /members/:id          │ role = owner | admin                              │
 * │ GET    /permissions          │ feature 'team' = true                             │
 * │ PATCH  /permissions          │ role = owner (chỉ owner mới được đổi RBAC)        │
 * └──────────────────────────────┴──────────────────────────────────────────────────┘
 */

const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const checkPermission = require('../middlewares/checkPermission');
const {
    getMembers,
    inviteMember,
    updateMember,
    removeMember,
    getStats,
    getPermissions,
    updatePermissions,
} = require('../controllers/teamController');

// ── Áp dụng auth cho toàn bộ router ──────────────────────────────────────────
router.use(authMiddleware);

// ── Stats ─────────────────────────────────────────────────────────────────────
/**
 * GET /api/team/stats
 * Trả về: { totalMembers, managers, members, pendingInvites }
 */
router.get('/stats', checkPermission('team'), getStats);

// ── Members ───────────────────────────────────────────────────────────────────
/**
 * GET /api/team/members
 * Trả về danh sách thành viên trong org của user hiện tại.
 */
router.get('/members', checkPermission('team'), getMembers);

/**
 * POST /api/team/invite
 * Body: { email: string, role: 'admin' | 'member' }
 * Tạo lời mời với status 'pending'. Chỉ owner/admin.
 */
router.post('/invite', checkPermission('team', ['owner', 'admin']), inviteMember);

/**
 * PUT /api/team/members/:id
 * Body: { role: 'admin' | 'member' }
 * Cập nhật vai trò thành viên. Chỉ owner/admin. Không thể đổi role của owner.
 */
router.put('/members/:id', checkPermission('team', ['owner', 'admin']), updateMember);

/**
 * DELETE /api/team/members/:id
 * Xóa thành viên khỏi org. Chỉ owner/admin. Không thể xóa owner hay chính mình.
 */
router.delete('/members/:id', checkPermission('team', ['owner', 'admin']), removeMember);

// ── Permissions ───────────────────────────────────────────────────────────────
/**
 * GET /api/team/permissions
 * Trả về ma trận RBAC hiện tại dưới dạng nested object.
 */
router.get('/permissions', checkPermission('team'), getPermissions);

/**
 * PATCH /api/team/permissions
 * Body: { admin?: { monitor?, reports?, team?, admin? }, member?: {...} }
 * Cập nhật ma trận theo batch. Chỉ owner. Owner permissions không thể sửa.
 */
router.patch('/permissions', checkPermission('team', ['owner']), updatePermissions);

module.exports = router;
