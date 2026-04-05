const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema(
    {
        monitorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Monitor',
            required: true,
            index: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        errorType: {
            type: String,
            required: true
        },
        severity: {
            type: String,
            enum: ['critical', 'warning', 'info'],
            required: true
        },
        message: {
            type: String,
            required: true
        },
        channelsSent: {
            type: [String],
            default: []
        },
        createdAt: {
            type: Date,
            default: Date.now,
            index: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Alert', AlertSchema);
