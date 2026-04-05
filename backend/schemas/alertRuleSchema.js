const { z } = require('zod');

// Helper schema for time format (HH:mm)
const timeFormatSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
  message: 'Thời gian không hợp lệ, yêu cầu định dạng HH:mm (Ví dụ: 22:00)'
});

const triggerSchema = z.object({
  websiteDown: z.boolean(),
  slowResponse: z.object({
    enabled: z.boolean(),
    threshold: z.number().min(100, 'Ngưỡng thời gian chờ tối thiểu là 100ms').max(30000, 'Ngưỡng thời gian chờ tối đa là 30000ms')
  }),
  ssl: z.object({
    enabled: z.boolean(),
    daysBefore: z.number().int().min(1, 'Thời gian báo trước tối thiểu là 1 ngày').max(90, 'Thời gian báo trước tối đa là 90 ngày')
  })
});

const channelIntegrationSchema = z.object({
  enabled: z.boolean(),
  target: z.string().optional()
});

const channelsSchema = z.object({
  email: z.object({
    enabled: z.boolean(),
    target: z.string().email('Email không đúng định dạng').or(z.literal(''))
  }),
  discord: channelIntegrationSchema,
  telegram: channelIntegrationSchema,
  sms: channelIntegrationSchema
});

const silentModeDaysSchema = z.object({
  mon: z.boolean(),
  tue: z.boolean(),
  wed: z.boolean(),
  thu: z.boolean(),
  fri: z.boolean(),
  sat: z.boolean(),
  sun: z.boolean()
});

const silentModeSchema = z.object({
  enabled: z.boolean(),
  startTime: timeFormatSchema,
  endTime: timeFormatSchema,
  days: silentModeDaysSchema
});

const customPayloadSchema = z.object({
  title: z.string().max(200, 'Tiêu đề quá dài (tối đa 200 ký tự)'),
  body: z.string().max(2000, 'Nội dung quá dài (tối đa 2000 ký tự)')
});

const updateAlertRuleSchema = z.object({
  body: z.object({
    triggers: triggerSchema,
    channels: channelsSchema,
    silentMode: silentModeSchema,
    customPayload: customPayloadSchema
  })
});

module.exports = {
  updateAlertRuleSchema
};
