const { z } = require('zod');

exports.getAlertsQuerySchema = z.object({
    page: z.string()
        .optional()
        .transform(v => parseInt(v, 10))
        .refine(v => !isNaN(v) && v > 0, { message: "Page must be a positive number" })
        .default('1'),
    limit: z.string()
        .optional()
        .transform(v => parseInt(v, 10))
        .refine(v => !isNaN(v) && v > 0 && v <= 100, { message: "Limit must be a number between 1 and 100" })
        .default('10'),
    search: z.string().optional(),
    severity: z.enum(['critical', 'warning', 'info']).optional(),
    fromDate: z.string()
        .optional()
        .refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid fromDate" }),
    toDate: z.string()
        .optional()
        .refine(val => !val || !isNaN(Date.parse(val)), { message: "Invalid toDate" })
});
