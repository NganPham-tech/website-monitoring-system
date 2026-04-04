const { z } = require('zod');

const monitorListSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['online', 'offline', 'pending', 'all']).default('all'),
  protocol: z.enum(['http', 'https', 'ping', 'port', 'keyword', 'all']).default('all'),
  page: z.preprocess((val) => parseInt(val, 10), z.number().min(1).default(1)),
  limit: z.preprocess((val) => parseInt(val, 10), z.number().min(1).max(100).default(12)),
});

const createMonitorSchema = z.object({
  name: z.string().min(2, 'Tên Monitor phải có ít nhất 2 ký tự').trim(),
  url: z.string().min(1, 'URL/IP là bắt buộc').refine((val) => {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    const ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return urlPattern.test(val) || ipPattern.test(val);
  }, 'Định dạng URL hoặc IP không hợp lệ'),
  description: z.string().optional(),
  protocol: z.enum(['http', 'https', 'ping', 'port', 'keyword']),
  interval: z.string().refine((val) => {
    // Basic interval validation: e.g., '30s', '1m', '5m'
    const match = val.match(/^(\d+)(s|m|h)$/);
    if (!match) return false;
    const [_, num, unit] = match;
    const seconds = unit === 's' ? parseInt(num) : unit === 'm' ? parseInt(num) * 60 : parseInt(num) * 3600;
    return seconds >= 30; // Min 30s
  }, 'Tần suất tối thiểu là 30 giây'),
  timeout: z.number().min(1000, 'Timeout tối thiểu 1000ms').default(30000),
  retries: z.number().min(0).max(10).default(3),
  httpMethod: z.enum(['GET', 'POST', 'PUT', 'DELETE']).default('GET'),
  portNumber: z.number().optional(),
  searchKeyword: z.string().optional(),
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
  if (data.protocol === 'port' && !data.portNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Trường portNumber là bắt buộc khi chọn giao thức port',
      path: ['portNumber'],
    });
  }
  if (data.protocol === 'keyword' && !data.searchKeyword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Trường searchKeyword là bắt buộc khi chọn giao thức keyword',
      path: ['searchKeyword'],
    });
  }
});

module.exports = {
  monitorListSchema,
  createMonitorSchema,
};
