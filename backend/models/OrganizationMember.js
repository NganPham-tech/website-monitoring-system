/**
 * OrganizationMember.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Bảng nối (junction table) giữa User và Organization.
 * Lưu trữ vai trò (role) của từng thành viên trong tổ chức.
 *
 * Vai trò (role) trong team — tách biệt hoàn toàn với system role của User:
 *   owner  → Người tạo org, toàn quyền, không thể bị xóa
 *   admin  → Quản lý thành viên và một số cấu hình, do Owner chỉ định
 *   member → Thành viên thông thường, quyền hạn theo Permission matrix
 *
 * Index unique (organizationId + userId) đảm bảo mỗi user chỉ có 1 vai trò
 * trong mỗi tổ chức.
 */

const mongoose = require('mongoose');

/** Danh sách vai trò hợp lệ trong team (export để tái sử dụng) */
const TEAM_ROLES = ['owner', 'admin', 'member'];

const organizationMemberSchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        role: {
            type: String,
            enum: TEAM_ROLES,
            default: 'member',
        },

        /** Thời điểm chính thức gia nhập (khi invite được chấp nhận, hoặc ngay lập tức với owner) */
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        // Không dùng timestamps mongoose vì đã có joinedAt
        timestamps: false,
    }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Đảm bảo mỗi user chỉ có 1 membership trong 1 org
organizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

// Tối ưu query lookup theo userId (tìm org của user)
organizationMemberSchema.index({ userId: 1 });

const OrganizationMember = mongoose.model('OrganizationMember', organizationMemberSchema);

OrganizationMember.TEAM_ROLES = TEAM_ROLES;

module.exports = OrganizationMember;
