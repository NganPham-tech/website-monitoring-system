/**
 * Organization.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Đại diện cho một Team/Workspace. Mỗi Organization nhóm nhiều User lại với nhau
 * và là đơn vị cô lập dữ liệu (data isolation boundary) trong hệ thống.
 *
 * Quan hệ:
 *   Organization  1 ←→ N  OrganizationMember  (bảng nối với User + role)
 *   Organization  1 ←→ N  Invite              (lời mời đang chờ)
 *   Organization  1 ←→ N  Permission          (ma trận phân quyền RBAC)
 */

const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
    {
        /** Tên hiển thị của team/tổ chức */
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },

        /** User là người tạo và sở hữu tổ chức này */
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

module.exports = mongoose.model('Organization', organizationSchema);
