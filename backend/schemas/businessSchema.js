const { z } = require('zod');

exports.updatePlanSchema = z.object({
  name: z.string().min(1, 'Tên gói không được để trống'),
  price: z.number().min(0, 'Giá không được âm'),
  limits: z.object({
    maxMonitors: z.number().int().min(1),
    maxTeamMembers: z.number().int().min(1),
    checkInterval: z.number().int().min(10)
  })
});
