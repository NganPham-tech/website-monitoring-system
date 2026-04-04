/**
 * Permission.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Lưu trữ ma trận phân quyền RBAC theo từng Organization.
 *
 * Mỗi document = 1 ô trong ma trận: (org, role, feature) → access boolean.
 *
 * Các tính năng được kiểm soát (FEATURES):
 *   monitor  → Quản lý monitors
 *   reports  → Xem báo cáo analytics
 *   team     → Xem/quản lý trang Team
 *   admin    → Truy cập cài đặt admin
 *
 * Quyền mặc định khi tạo org (được seed bởi teamService.getOrCreateOrg):
 *   ┌─────────┬─────────┬─────────┬─────────┬─────────┐
 *   │ Role    │ monitor │ reports │ team    │ admin   │
 *   ├─────────┼─────────┼─────────┼─────────┼─────────┤
 *   │ owner   │ true    │ true    │ true    │ true    │
 *   │ admin   │ true    │ true    │ true    │ false   │
 *   │ member  │ true    │ false   │ false   │ false   │
 *   └─────────┴─────────┴─────────┴─────────┴─────────┘
 *
 * Lưu ý: Owner luôn được phép truy cập tất cả tính năng bởi checkPermission
 * middleware (không cần tra bảng). Các row owner tồn tại để phẳng hoá
 * response của GET /api/team/permissions.
 */

const mongoose = require('mongoose');

/** Danh sách tính năng có thể phân quyền */
const FEATURES = ['monitor', 'reports', 'team', 'admin'];

/** Vai trò có trong ma trận */
const PERMISSION_ROLES = ['owner', 'admin', 'member'];

const permissionSchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },

        role: {
            type: String,
            enum: PERMISSION_ROLES,
            required: true,
        },

        feature: {
            type: String,
            enum: FEATURES,
            required: true,
        },

        access: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Unique constraint: mỗi (org, role, feature) chỉ có 1 record
permissionSchema.index({ organizationId: 1, role: 1, feature: 1 }, { unique: true });

const Permission = mongoose.model('Permission', permissionSchema);

Permission.FEATURES = FEATURES;
Permission.PERMISSION_ROLES = PERMISSION_ROLES;

module.exports = Permission;
