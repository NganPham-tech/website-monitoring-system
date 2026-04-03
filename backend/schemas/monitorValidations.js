const { z } = require('zod');

const monitorListSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['online', 'offline', 'pending', 'all']).default('all'),
  protocol: z.enum(['http', 'ping', 'port', 'all']).default('all'),
  page: z.preprocess((val) => parseInt(val, 10), z.number().min(1).default(1)),
  limit: z.preprocess((val) => parseInt(val, 10), z.number().min(1).max(100).default(12)),
});

module.exports = {
  monitorListSchema,
};
