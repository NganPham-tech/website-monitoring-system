const { logger } = require('./logger');

/**
 * MOCK: AlertDispatcher Service
 * Helper internal service that replaces {variables} in configured templates
 * and routes out alerts matching the trigger condition.
 */
class AlertDispatcher {
  
  /**
   * Helper function to parse payload strings with actual variables.
   * @param {string} template - The template string (e.g. "{name} đang gặp sự cố")
   * @param {object} variables - The variables dictionary (e.g. { name: "Web1", status: "502", time: "10:00" })
   * @returns {string} The formatted string.
   */
  static parsePayloadWithVariables(template, variables) {
    if (!template) return '';
    let parsed = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{${key}}`, 'g');
      parsed = parsed.replace(regex, value);
    }
    return parsed;
  }

  /**
   * Dispatches an alert based on user's configuration.
   * @param {object} alertRule - The user's AlertRule configuration object
   * @param {object} incidentData - Mock data of incident { name, url, status, time, triggerType }
   */
  static async pushAlert(alertRule, incidentData) {
    const { triggers, channels, silentMode, customPayload } = alertRule;

    // 1. Verify Trigger
    const triggerType = incidentData.triggerType; // e.g., 'websiteDown', 'slowResponse'
    if (triggerType === 'websiteDown' && !triggers.websiteDown) return;
    if (triggerType === 'slowResponse' && !triggers.slowResponse.enabled) return;
    if (triggerType === 'ssl' && !triggers.ssl.enabled) return;

    // 2. Check Silent Mode
    if (this._isSilentModeActive(silentMode)) {
      logger.info('Alert suppressed due to active Silent Mode config');
      return;
    }

    // 3. Prepare Payload
    const variables = {
      name: incidentData.name || 'Unknown Monitor',
      status: incidentData.status || 'Offline',
      time: incidentData.time || new Date().toLocaleString('vi-VN'),
      url: incidentData.url || ''
    };

    const parsedTitle = this.parsePayloadWithVariables(customPayload.title, variables);
    const parsedBody = this.parsePayloadWithVariables(customPayload.body, variables);

    // 4. Send to available channels (Mock implementations)
    if (channels.email.enabled) {
      logger.info(`[Email Alert] To: ${channels.email.target} | Title: ${parsedTitle}`);
    }
    if (channels.discord.enabled) {
      logger.info(`[Discord Alert] Webhook: ${channels.discord.target} | Sending Payload`);
    }
    if (channels.telegram.enabled) {
      logger.info(`[Telegram Alert] Target: ${channels.telegram.target} | Sending Payload`);
    }
    if (channels.sms.enabled) {
      logger.info(`[SMS Alert] Phone: ${channels.sms.target} | Title: ${parsedTitle}`);
    }
  }

  static _isSilentModeActive(silentMode) {
    if (!silentMode || !silentMode.enabled) return false;
    
    const now = new Date();
    
    // Check day of week
    const currentDayConfigMap = [
      silentMode.days.sun,
      silentMode.days.mon,
      silentMode.days.tue,
      silentMode.days.wed,
      silentMode.days.thu,
      silentMode.days.fri,
      silentMode.days.sat
    ];
    const currentDayAllowed = currentDayConfigMap[now.getDay()];
    
    if (!currentDayAllowed) return false;

    // Check time range (Simple comparison for HH:mm)
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const parseTimeStr = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
    };
    
    const startMins = parseTimeStr(silentMode.startTime);
    const endMins = parseTimeStr(silentMode.endTime);

    // Handle overnight ranges e.g. 22:00 -> 06:00
    if (startMins <= endMins) {
      return currentMinutes >= startMins && currentMinutes < endMins;
    } else {
      return currentMinutes >= startMins || currentMinutes < endMins;
    }
  }
}

module.exports = AlertDispatcher;
