const IntegrationSetting = require('../models/IntegrationSetting');
const cryptoService = require('../services/cryptoService');
const emailService = require('../services/emailService');
const { logger } = require('../utils/logger');

exports.getIntegrations = async (req, res) => {
  let settings = await IntegrationSetting.findOne();
  if (!settings) {
    settings = await IntegrationSetting.create({});
  }

  // Map to plain object and mask secrets
  const data = settings.toObject();
  
  // Return masked versions for security. 
  // Frontend will keep its value, backend won't update it if it receives exactly '********' back.
  data.keycloakSecret = cryptoService.maskSecret(data.keycloakSecret);
  data.stripeSecret = cryptoService.maskSecret(data.stripeSecret);
  data.stripeWebhook = cryptoService.maskSecret(data.stripeWebhook);
  data.smtpPass = cryptoService.maskSecret(data.smtpPass);
  data.telegramBot = cryptoService.maskSecret(data.telegramBot);

  res.status(200).json(data);
};

exports.updateIntegrations = async (req, res) => {
  const payload = { ...req.body };
  const currentSettings = await IntegrationSetting.findOne() || new IntegrationSetting();

  // Encrypt secrets if they were modified (meaning they don't equal the mask string)
  if (payload.keycloakSecret && payload.keycloakSecret !== '********') {
    payload.keycloakSecret = cryptoService.encrypt(payload.keycloakSecret);
  } else {
    delete payload.keycloakSecret;
  }

  if (payload.stripeSecret && payload.stripeSecret !== '********') {
    payload.stripeSecret = cryptoService.encrypt(payload.stripeSecret);
  } else {
    delete payload.stripeSecret;
  }

  if (payload.stripeWebhook && payload.stripeWebhook !== '********') {
    payload.stripeWebhook = cryptoService.encrypt(payload.stripeWebhook);
  } else {
    delete payload.stripeWebhook;
  }

  if (payload.smtpPass && payload.smtpPass !== '********') {
    payload.smtpPass = cryptoService.encrypt(payload.smtpPass);
  } else {
    delete payload.smtpPass;
  }

  if (payload.telegramBot && payload.telegramBot !== '********') {
    payload.telegramBot = cryptoService.encrypt(payload.telegramBot);
  } else {
    delete payload.telegramBot;
  }

  const updated = await IntegrationSetting.findOneAndUpdate(
    {}, 
    { $set: payload }, 
    { new: true, upsert: true }
  );

  logger.info(`Integrations configuration updated by admin ${req.user.email}`);

  res.status(200).json({ success: true, message: 'Settings saved successfully' });
};

exports.testSmtp = async (req, res) => {
  try {
    const config = req.body; // {host, port, user, pass}
    
    // If the frontend sent masked password, we must retrieve decrypted variant from DB
    if (config.pass === '********') {
      const dbConfig = await IntegrationSetting.findOne();
      if (dbConfig) {
        config.pass = cryptoService.decrypt(dbConfig.smtpPass);
      }
    }

    await emailService.sendTestEmail(req.user.email, config);
    res.status(200).json({ success: true, message: 'Test email delivered successfully' });
  } catch (error) {
    logger.error('SMTP test failed: ' + error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
