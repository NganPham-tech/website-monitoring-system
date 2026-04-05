const Integration = require('../models/Integration');
const { encrypt, decrypt } = require('../utils/encryption');
const mongoose = require('mongoose');

const AVAILABLE_INTEGRATIONS = [
    { type: 'email', name: 'Email' },
    { type: 'telegram', name: 'Telegram' },
    { type: 'discord', name: 'Discord' },
    { type: 'slack', name: 'Slack' },
    { type: 'webhook', name: 'Webhook' },
    { type: 'sms', name: 'SMS' },
];

const maskConfig = (type, config) => {
    if (!config) return null;
    const masked = { ...config };

    if (type === 'email') {
        if (masked.pass) masked.pass = '********';
    } else if (type === 'telegram') {
        if (masked.botToken) masked.botToken = masked.botToken.substring(0, 5) + '...';
    } else if (['discord', 'slack', 'webhook'].includes(type)) {
        if (masked.webhookUrl) masked.webhookUrl = masked.webhookUrl.substring(0, 15) + '...';
    } else if (type === 'sms') {
        if (masked.apiKey) masked.apiKey = '********';
    }
    return masked;
};

exports.getIntegrations = async (userId) => {
    const dbIntegrations = await Integration.find({ userId: new mongoose.Types.ObjectId(userId) });

    return AVAILABLE_INTEGRATIONS.map(def => {
        const found = dbIntegrations.find(db => db.type === def.type);
        if (!found) {
            return { id: null, type: def.type, name: def.name, status: 'disconnected', details: null };
        }

        // Decrypt then mask secrets so frontend can display public parts (like ChatID or Address) but not the Secrets
        let decryptedConfig = {};
        try {
            decryptedConfig = JSON.parse(decrypt(found.configCrypted));
        } catch (e) {
            console.error('Decryption error for integration', found._id);
        }

        return {
            id: found._id,
            type: def.type,
            name: def.name,
            status: 'connected',
            details: maskConfig(def.type, decryptedConfig)
        };
    });
};

exports.testConnection = async (type, configData) => {
    // Demo helper: Trong thực tế sẽ axios post trực tiếp vào Discord webhook hoặc Telegram SendMessage API để check HTTP OK.
    // Nếu sai Webhook/Token -> ném lỗi cản lại ở đây!
    // await axios.post(configData.webhookUrl, { content: "Test from Uptime Monitor" })
    console.log(`Bypass Testing connection for ${type}... Simulated API verified OK!`);
    return true;
};

exports.saveIntegration = async (userId, type, configData) => {
    await this.testConnection(type, configData);

    const def = AVAILABLE_INTEGRATIONS.find(i => i.type === type);
    const jsonString = JSON.stringify(configData);
    const configCrypted = encrypt(jsonString);

    const integration = await Integration.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId), type },
        {
            name: def.name,
            configCrypted,
            status: 'connected'
        },
        { new: true, upsert: true }
    );

    return integration;
};

exports.deleteIntegration = async (id, userId) => {
    const integration = await Integration.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId)
    });

    if (!integration) {
        const error = new Error('Bản ghi kết nối không tồn tại');
        error.status = 404;
        throw error;
    }
    return true;
};
