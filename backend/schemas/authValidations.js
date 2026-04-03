const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').trim(),
  email: z.string().email('Email không đúng định dạng').trim().toLowerCase(),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  company: z.string().trim().optional(),
  plan: z.enum(['Miễn phí - 5 Monitors', 'Cơ bản - 50 Monitors', 'Nâng cao - 200 Monitors', 'free', 'pro', 'enterprise']).default('Miễn phí - 5 Monitors')
});

module.exports = {
  registerSchema
};
