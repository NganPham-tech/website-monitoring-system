const mongoose = require('mongoose');

const integrationSettingSchema = new mongoose.Schema({
  keycloakUrl: { type: String, default: '' },
  keycloakRealm: { type: String, default: '' },
  keycloakClientId: { type: String, default: '' },
  keycloakSecret: { type: String, default: '' }, // Encrypted

  stripePublishable: { type: String, default: '' },
  stripeSecret: { type: String, default: '' },   // Encrypted
  stripeWebhook: { type: String, default: '' },  // Encrypted

  smtpHost: { type: String, default: '' },
  smtpPort: { type: Number, default: 587 },
  smtpUser: { type: String, default: '' },
  smtpPass: { type: String, default: '' },       // Encrypted

  telegramBot: { type: String, default: '' },    // Encrypted
  telegramChatId: { type: String, default: '' }
}, { timestamps: true });

const IntegrationSetting = mongoose.model('IntegrationSetting', integrationSettingSchema);
module.exports = IntegrationSetting;
