const mongoose = require('mongoose');

const IntegrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['email', 'telegram', 'discord', 'slack', 'webhook', 'sms'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    configCrypted: {
        type: String,
        required: true // JSON.stringify() sau khi encrypt
    },
    status: {
        type: String,
        default: 'connected'
    }
}, { timestamps: true });

// Mỗi người dùng chỉ có tối đa 1 config cho mỗi loại integration
IntegrationSchema.index({ userId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Integration', IntegrationSchema);
