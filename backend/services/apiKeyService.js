const crypto = require('crypto');
const ApiKey = require('../models/ApiKey');

/**
 * Creates a new API Key for a user
 * @param {String} userId - ID of the user
 * @param {String} name - Name/Label of the API Key
 * @returns {Object} { apiKeyRecord, fullKey }
 */
exports.generateApiKey = async (userId, name) => {
  // Generate random token
  const rawKey = crypto.randomBytes(32).toString('hex');
  // Hash for storage
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

  const apiKeyRecord = await ApiKey.create({
    userId,
    name,
    keyHash,
  });

  return { apiKeyRecord, fullKey: `uptm_${rawKey}` };
};

/**
 * Retrieves all API keys for a user
 * @param {String} userId
 * @returns {Array} List of API keys without the hash
 */
exports.getUserApiKeys = async (userId) => {
  const keys = await ApiKey.find({ userId }).sort({ createdAt: -1 });
  // We don't return keyHash to client
  return keys.map((key) => ({
    _id: key._id,
    name: key.name,
    createdAt: key.createdAt,
    lastUsedAt: key.lastUsedAt,
    // Provide a masked version just in case, though frontend handles its own masking if passed
    key: `uptm_••••••••••••••••${key.keyHash.substring(0, 6)}`,
  }));
};

/**
 * Revokes/Deletes an API Key
 * @param {String} keyId
 * @param {String} userId
 */
exports.revokeApiKey = async (keyId, userId) => {
  const deleted = await ApiKey.findOneAndDelete({ _id: keyId, userId });
  if (!deleted) {
    throw new Error('API Key not found or unauthorized');
  }
  return true;
};
