import { z } from 'zod';

export const addMonitorSchema = z.object({
  name: z.string().min(2, 'Tên Monitor phải có ít nhất 2 ký tự').trim(),
  url: z.string().min(1, 'URL/IP là bắt buộc').refine((val) => {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return urlPattern.test(val) || ipPattern.test(val);
  }, 'Định dạng URL hoặc IP không hợp lệ'),
  description: z.string().optional(),
  protocol: z.enum(['HTTP(S)', 'Ping', 'Port', 'Keyword']),
  port: z.string().optional().refine((val, ctx) => {
    // If protocol is Port, this is required
    return true; // Logic handled in superRefine if needed or simple check
  }),
  keyword: z.string().optional(),
  interval: z.string().default('5m'),
  timeout: z.number().min(1000, 'Timeout tối thiểu 1000ms').default(30000),
  retries: z.number().min(0).max(10).default(3),
  httpMethod: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET'),
  locations: z.array(z.string()).min(1, 'Chọn ít nhất 1 khu vực máy chủ'),
  alertTriggers: z.object({
    isDown: z.boolean().default(true),
    slowResponse: z.boolean().default(false),
    slowThreshold: z.number().optional(),
    sslExpiry: z.boolean().default(false),
    sslDays: z.number().optional(),
  }),
  alertChannels: z.array(z.string()).min(1, 'Chọn ít nhất 1 kênh nhận cảnh báo'),
}).superRefine((data, ctx) => {
  if (data.protocol === 'Port' && !data.port) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng nhập số cổng (Port)',
      path: ['port'],
    });
  }
  if (data.protocol === 'Keyword' && !data.keyword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng nhập từ khóa cần tìm kiếm',
      path: ['keyword'],
    });
  }
  if (data.alertTriggers.slowResponse && !data.alertTriggers.slowThreshold) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng nhập ngưỡng thời gian (ms)',
      path: ['alertTriggers', 'slowThreshold'],
    });
  }
  if (data.alertTriggers.sslExpiry && !data.alertTriggers.sslDays) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Vui lòng nhập số ngày cảnh báo trước',
      path: ['alertTriggers', 'sslDays'],
    });
  }
});
