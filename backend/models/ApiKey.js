const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    keyHash: {
      type: String,
      required: true,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a single user from having more than 5 keys natively via pre-save hook
apiKeySchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.models.ApiKey.countDocuments({ userId: this.userId });
    if (count >= 5) {
      throw new Error('Maximum of 5 API Keys allowed per user');
    }
  }
  next();
});

const ApiKey = mongoose.model('ApiKey', apiKeySchema);
module.exports = ApiKey;
