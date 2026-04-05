const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    startTime: {
        type: Date,
        required: true,
        index: true
    },
    endTime: {
        type: Date,
        required: true,
        index: true
    },
    monitors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Monitor'
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Tính toán trạng thái động khi query
MaintenanceSchema.virtual('status').get(function () {
    const now = Date.now();
    if (now < this.startTime) return 'scheduled';
    if (now >= this.startTime && now <= this.endTime) return 'ongoing';
    return 'completed';
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
