const crypto = require('crypto');

// Nên thay bằng process.env.ENCRYPTION_KEY (chuỗi ngẫu nhiên dài chính xác 32 chars)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_integration_secret_key__';
const IV_LENGTH = 16;

exports.encrypt = (text) => {
    if (!text) return text;
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

exports.decrypt = (text) => {
    if (!text) return text;
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
