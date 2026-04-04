/**
 * Invite.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Lưu trữ lời mời tham gia team đang chờ xử lý.
 *
 * Vòng đời của một lời mời:
 *   pending → accepted  (người được mời chấp nhận)
 *   pending → rejected  (người được mời từ chối)
 *   pending → expired   (hết hạn sau 7 ngày, do job cron cập nhật hoặc kiểm tra khi accept)
 *
 * token: chuỗi random 32 bytes hex dùng cho accept-invite link (không cần auth).
 * expiresAt: thời hạn lời mời – mặc định 7 ngày kể từ lúc tạo.
 */

const mongoose = require('mongoose');
const crypto = require('crypto');

const INVITE_STATUSES = ['pending', 'accepted', 'rejected', 'expired'];

const inviteSchema = new mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },

        /** Email của người được mời (không nhất thiết phải có tài khoản sẵn) */
        invitedEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },

        /** User gửi lời mời */
        invitedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        /** Vai trò sẽ được gán khi lời mời được chấp nhận */
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member',
        },

        /** Token bảo mật cho accept-link (không yêu cầu auth) */
        token: {
            type: String,
            unique: true,
            default: () => crypto.randomBytes(32).toString('hex'),
        },

        status: {
            type: String,
            enum: INVITE_STATUSES,
            default: 'pending',
        },

        /** Hết hạn sau 7 ngày */
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    },
    {
        timestamps: true,
    }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Hỗ trợ kiểm tra duplicate invite nhanh
inviteSchema.index({ organizationId: 1, invitedEmail: 1, status: 1 });
// TTL index: tự động xóa document đã hết hạn qua đêm
inviteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Invite', inviteSchema);
