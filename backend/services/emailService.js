const nodemailer = require('nodemailer');
const IntegrationSetting = require('../models/IntegrationSetting');
const cryptoService = require('./cryptoService');
const { logger } = require('../utils/logger');

// Creates transient transporter from current DB settings
// Alternatively cache this unless settings change
const createTransporter = async (overrideConfig = null) => {
  let host, port, user, pass;

  if (overrideConfig) {
    host = overrideConfig.host;
    port = overrideConfig.port;
    user = overrideConfig.user;
    pass = overrideConfig.pass;
  } else {
    // Read from DB
    const settings = await IntegrationSetting.findOne() || {};
    host = settings.smtpHost;
    port = settings.smtpPort;
    user = settings.smtpUser;
    pass = cryptoService.decrypt(settings.smtpPass);
  }

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration is missing or incomplete.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: { user, pass }
  });
};

exports.sendTestEmail = async (adminEmail, config) => {
  const transporter = await createTransporter(config);
  
  await transporter.verify(); // Test connection explicitly
  
  await transporter.sendMail({
    from: `"Uptime Admin" <${config?.user || 'admin@uptime.com'}>`, // Fallback for sender
    to: adminEmail,
    subject: '[Uptime Monitor] Kiểm tra cấu hình SMTP',
    text: 'Hệ thống gửi mail SMTP của bạn đã được cấu hình thành công!',
    html: '<b>Hệ thống gửi mail SMTP của bạn đã được cấu hình thành công!</b>'
  });
  return true;
};

exports.sendBulkEmailsAsync = async (userEmails, title, htmlContent) => {
  // We do NOT wait or block for this function to complete fully.
  // It runs in the background.
  try {
    const transporter = await createTransporter();
    
    // Chunking to avoid overloading SMTP server in one single promise.all
    // Typical SaaS sends emails in batches
    const BATCH_SIZE = 50;
    
    // We execute async processing loop without blocking the main event loop return
    (async () => {
      for (let i = 0; i < userEmails.length; i += BATCH_SIZE) {
        const batch = userEmails.slice(i, i + BATCH_SIZE);
        
        const promises = batch.map(email => 
          transporter.sendMail({
            from: `"Uptime Monitor" <noreply@uptime.com>`,
            to: email,
            subject: title,
            html: htmlContent
          }).catch(e => {
            logger.warn(`Failed to send email to ${email}: ${e.message}`);
          })
        );
        
        await Promise.allSettled(promises);
      }
      logger.info(`Bulk email broadcast completed for ${userEmails.length} users.`);
    })();
    
  } catch (error) {
    logger.error('Failed to initialize bulk email sender: ' + error.message);
  }
};
