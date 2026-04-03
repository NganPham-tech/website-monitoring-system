const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email({ message: 'Email không đúng định dạng' }),
  password: z.string().min(1, { message: 'Mật khẩu không được để trống' }),
  rememberMe: z.boolean().optional().default(false),
});

module.exports = {
  loginSchema,
};
