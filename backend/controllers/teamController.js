/**
 * teamController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Controller mỏng (thin controller) theo nguyên tắc MVC:
 *   - Parse & validate input (Zod)
 *   - Gọi teamService
 *   - Format response
 *   - Không chứa business logic
 *
 * express-async-errors đã được require ở app.js → không cần try/catch.
 * ZodError → errorHandler trả về 400. Service errors → statusCode tương ứng.
 *
 * req.organization và req.membership được gán sẵn bởi checkPermission middleware.
 */

const teamService = require('../services/teamService');
const {
  inviteMemberSchema,
  updateMemberSchema,
  updatePermissionsSchema,
} = require('../schemas/teamValidations');

// ─── GET /api/team/members ────────────────────────────────────────────────────
/**
 * Trả về danh sách thành viên trong cùng Organization với user hiện tại.
 * Data isolation: Chỉ trả kết quả trong org đã được xác định bởi checkPermission.
 */
const getMembers = async (req, res) => {
  const members = await teamService.getMembers(req.organization._id);
  res.status(200).json({ success: true, data: members });
};

// ─── POST /api/team/invite ────────────────────────────────────────────────────
/**
 * Tạo một Invite record mới với status 'pending'.
 * Rule: email đã là thành viên hoặc đã có pending invite → 409 Conflict.
 */
const inviteMember = async (req, res) => {
  const { email, role } = inviteMemberSchema.parse(req.body);

  const invite = await teamService.inviteMember(
    req.organization._id,
    req.user.id,
    email,
    role
  );

  res.status(201).json({
    success: true,
    message: 'Đã gửi lời mời thành công',
    data: {
      id: invite._id,
      invitedEmail: invite.invitedEmail,
      role: invite.role,
      status: invite.status,
      expiresAt: invite.expiresAt,
    },
  });
};

// ─── PUT /api/team/members/:id ────────────────────────────────────────────────
/**
 * Cập nhật vai trò của một thành viên.
 * Không cho phép hạ cấp Owner.
 */
const updateMember = async (req, res) => {
  const { role } = updateMemberSchema.parse(req.body);

  await teamService.updateMember(
    req.organization._id,
    req.params.id,
    role
  );

  res.status(200).json({
    success: true,
    message: 'Đã cập nhật vai trò thành viên',
  });
};

// ─── DELETE /api/team/members/:id ─────────────────────────────────────────────
/**
 * Xóa thành viên khỏi org.
 * Không cho phép xóa Owner, hoặc tự xóa chính mình.
 */
const removeMember = async (req, res) => {
  await teamService.removeMember(
    req.organization._id,
    req.params.id,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: 'Đã xóa thành viên khỏi team',
  });
};

// ─── GET /api/team/stats ──────────────────────────────────────────────────────
/**
 * Trả về số liệu thống kê của team:
 *   totalMembers, managers, members, pendingInvites
 */
const getStats = async (req, res) => {
  const stats = await teamService.getStats(req.organization._id);
  res.status(200).json({ success: true, data: stats });
};

// ─── GET /api/team/permissions ────────────────────────────────────────────────
/**
 * Trả về ma trận phân quyền hiện tại của org.
 * Format: { owner: { monitor: true, ... }, admin: {...}, member: {...} }
 */
const getPermissions = async (req, res) => {
  const matrix = await teamService.getPermissions(req.organization._id);
  res.status(200).json({ success: true, data: matrix });
};

// ─── PATCH /api/team/permissions ──────────────────────────────────────────────
/**
 * Cập nhật ma trận quyền theo batch.
 * Chỉ Owner mới được gọi (enforced tại routes bởi checkPermission).
 * Owner permissions không thể thay đổi (bị bỏ qua trong service).
 *
 * Body ví dụ:
 *   { "admin": { "reports": false }, "member": { "monitor": true, "team": true } }
 */
const updatePermissions = async (req, res) => {
  const matrix = updatePermissionsSchema.parse(req.body);

  await teamService.updatePermissions(req.organization._id, matrix);

  res.status(200).json({
    success: true,
    message: 'Đã cập nhật ma trận phân quyền',
  });
};

module.exports = {
  getMembers,
  inviteMember,
  updateMember,
  removeMember,
  getStats,
  getPermissions,
  updatePermissions,
};
