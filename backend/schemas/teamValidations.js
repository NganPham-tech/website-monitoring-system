/**
 * teamValidations.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Zod schemas cho toàn bộ input validation của Team & Permission APIs.
 * Ném ZodError khi parse thất bại → bắt bởi express-async-errors → errorHandler
 * trả về HTTP 400 với message mô tả lỗi rõ ràng.
 */

const { z } = require('zod');

// ─── Invite member ─────────────────────────────────────────────────────────────
/**
 * POST /api/team/invite
 * Body: { email, role }
 */
const inviteMemberSchema = z.object({
    email: z
        .string({ required_error: 'Email là bắt buộc' })
        .trim()
        .toLowerCase()
        .email('Địa chỉ email không đúng định dạng'),

    role: z.enum(['admin', 'member'], {
        message: "Vai trò phải là 'admin' hoặc 'member'",
    }),
});

// ─── Update member role ────────────────────────────────────────────────────────
/**
 * PUT /api/team/members/:id
 * Body: { role }
 */
const updateMemberSchema = z.object({
    role: z.enum(['admin', 'member'], {
        message: "Vai trò phải là 'admin' hoặc 'member'",
    }),
});

// ─── Update permissions matrix ────────────────────────────────────────────────
/**
 * PATCH /api/team/permissions
 * Body: { admin?: {monitor, reports, team, admin}, member?: {...} }
 *
 * Frontend gửi toàn bộ ma trận (lược bỏ owner vì không thể thay đổi).
 * Mỗi key là role, value là object feature → boolean.
 */
const featureMapSchema = z
    .object({
        monitor: z.boolean({ invalid_type_error: 'Giá trị quyền phải là boolean' }).optional(),
        reports: z.boolean({ invalid_type_error: 'Giá trị quyền phải là boolean' }).optional(),
        team: z.boolean({ invalid_type_error: 'Giá trị quyền phải là boolean' }).optional(),
        admin: z.boolean({ invalid_type_error: 'Giá trị quyền phải là boolean' }).optional(),
    })
    .strict();

const updatePermissionsSchema = z
    .object({
        admin: featureMapSchema.optional(),
        member: featureMapSchema.optional(),
    })
    .strict()
    .refine(
        (data) => Object.keys(data).length > 0,
        'Payload không được rỗng. Cần cung cấp ít nhất 1 role để cập nhật.'
    );

module.exports = {
    inviteMemberSchema,
    updateMemberSchema,
    updatePermissionsSchema,
};
