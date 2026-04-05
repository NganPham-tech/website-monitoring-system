const { z } = require('zod');

const baseSchema = z.object({
    title: z.string().min(1, "Vui lòng nhập tên bảo trì"),
    notes: z.string().optional(),
    startTime: z.string().refine(val => !isNaN(Date.parse(val)), "Định dạng thời gian không hợp lệ"),
    endTime: z.string().refine(val => !isNaN(Date.parse(val)), "Định dạng thời gian không hợp lệ"),
    monitors: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 monitor chịu ảnh hưởng")
});

exports.createMaintenanceSchema = baseSchema.refine(data => {
    return new Date(data.endTime) > new Date(data.startTime);
}, {
    message: "Thời gian kết thúc phải lớn hơn thời gian bắt đầu",
    path: ["endTime"]
}).refine(data => {
    const start = new Date(data.startTime);
    const now = new Date();
    now.setMinutes(now.getMinutes() - 10); // Cấp dung sai 10 phút
    return start >= now;
}, {
    message: "Thời gian bắt đầu không được nằm trong quá khứ",
    path: ["startTime"]
});

exports.updateMaintenanceSchema = baseSchema.partial();
