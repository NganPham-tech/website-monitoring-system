const apiKeyService = require('../services/apiKeyService');
const { z } = require('zod');

exports.createApiKey = async (req, res) => {
  const schema = z.object({
    name: z.string().min(1, 'API Key name is required').max(50),
  });

  const validation = schema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.format() });
  }

  try {
    const result = await apiKeyService.generateApiKey(req.user.id, validation.data.name);
    res.status(201).json({ 
      success: true, 
      data: {
        _id: result.apiKeyRecord._id,
        name: result.apiKeyRecord.name,
        key: result.fullKey, // Only shown once!
        createdAt: result.apiKeyRecord.createdAt
      }
    });
  } catch (error) {
    if (error.message.includes('Maximum of 5 API Keys limit')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    throw error;
  }
};

exports.getApiKeys = async (req, res) => {
  const keys = await apiKeyService.getUserApiKeys(req.user.id);
  res.status(200).json({ success: true, data: keys });
};

exports.deleteApiKey = async (req, res) => {
  const { id } = req.params;
  await apiKeyService.revokeApiKey(id, req.user.id);
  res.status(200).json({ success: true, message: 'API Key revoked successfully' });
};
