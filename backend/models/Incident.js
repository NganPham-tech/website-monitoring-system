const mongoose = require('mongoose');

const TimelineSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['detected', 'investigating', 'identified', 'fixing', 'resolved', 'note'],
    default: 'note',
  },
});

const NotificationSchema = new mongoose.Schema({
  channel: { type: String, enum: ['Email', 'Telegram', 'SMS', 'Discord'] },
  recipients: { type: Number, default: 0 },
  sentAt: { type: Date, default: Date.now },
});

const ImpactSchema = new mongoose.Schema({
  affectedServices: { type: Number, default: 0 },
  alertsSent: { type: Number, default: 0 },
  usersAffected: { type: String, default: '0' },
});

const IncidentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['ongoing', 'resolved'],
      default: 'ongoing',
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'critical'],
      default: 'info',
    },
    priority: {
      type: String,
      enum: ['P1', 'P2', 'P3'],
      default: 'P3',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
    rootCause: {
      type: String,
    },
    affectedService: {
      type: String,
      required: true,
    },
    incidentType: {
      type: String,
      default: 'Unknown Issue',
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    impact: {
      type: ImpactSchema,
      default: () => ({}),
    },
    notifications: [NotificationSchema],
    timeline: [TimelineSchema],
  },
  {
    timestamps: true,
  }
);

// Virtual field for computing downtime
IncidentSchema.virtual('downtimeMinutes').get(function () {
  const end = this.resolvedAt ? new Date(this.resolvedAt) : new Date();
  const start = new Date(this.startedAt);
  return Math.round((end - start) / 60000);
});

// Virtual for formatted downtime string
IncidentSchema.virtual('impact.downtimeFormatted').get(function () {
  const mins = this.downtimeMinutes;
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return remMins > 0 ? `${hours}h ${remMins}m` : `${hours}h`;
  }
  return `${mins}m`;
});

// Ensure virtuals are included in JSON
IncidentSchema.set('toJSON', { virtuals: true });
IncidentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Incident', IncidentSchema);
