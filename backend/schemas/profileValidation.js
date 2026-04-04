const { z } = require('zod');

exports.updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  timezone: z.string().optional(),
  preferences: z.object({
    emailAlerts: z.boolean().optional(),
    telegramAlerts: z.boolean().optional(),
    weeklyReport: z.boolean().optional(),
    monthlyReport: z.boolean().optional(),
    maintenanceAlerts: z.boolean().optional(),
  }).optional(),
  avatar: z.string().optional(),
});

exports.changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Must contain at least 1 number'),
});

exports.verify2FASchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits').regex(/^\d+$/, 'Code must be digits only'),
});
