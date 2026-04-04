const mongoose = require('mongoose');

/**
 * PingNode represents a distributed Ping Worker instance.
 * In a real system each worker would periodically update its own record
 * (heartbeat). Here we persist the records so the API has something to query.
 */
const pingNodeSchema = new mongoose.Schema(
    {
        region: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['online', 'offline', 'deploying'],
            default: 'deploying',
            index: true,
        },
        cpuUsage: {
            type: Number, // percentage 0–100
            default: 0,
        },
        avgLatency: {
            type: Number, // milliseconds
            default: 0,
        },
        queueSize: {
            type: Number,
            default: 0,
        },
        lastHeartbeat: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const PingNode = mongoose.model('PingNode', pingNodeSchema);
module.exports = PingNode;
