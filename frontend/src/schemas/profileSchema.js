import { z } from 'zod';

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'Họ không được để trống'),
  lastName: z.string().min(1, 'Tên không được để trống'),
  email: z.string().min(1, 'Email không được để trống').email('Email không đúng định dạng'),
  company: z.string().optional(),
  phone: z.string().optional(),
  timezone: z.string().min(1, 'Vui lòng chọn múi giờ'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
  newPassword: z.string()
    .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
    .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
    .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số'),
  confirmNewPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Xác nhận mật khẩu không khớp',
  path: ['confirmNewPassword'],
});

export const deleteAccountSchema = z.object({
  confirmation: z.string().refine((val) => val === 'CONFIRM', {
    message: 'Vui lòng nhập chính xác "CONFIRM" để xác nhận',
  }),
});
