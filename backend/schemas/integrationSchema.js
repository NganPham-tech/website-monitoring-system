const { z } = require('zod');

exports.saveIntegrationSchema = z.object({
    type: z.enum(['email', 'telegram', 'discord', 'slack', 'webhook', 'sms'], {
        errorMap: () => ({ message: "Loại dịch vụ không hợp lệ!" })
    }),
    configData: z.object({}).passthrough()
});
