import React, { useState } from 'react';

const MaintenanceFormModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        monitors: [],
        startTime: '',
        endTime: '',
        notes: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectMonitor = (e) => {
        const options = e.target.options;
        const selected = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) selected.push(options[i].value);
        }
        setFormData(prev => ({ ...prev, monitors: selected }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (new Date(formData.endTime) <= new Date(formData.startTime)) {
            alert("Thời gian kết thúc phải lớn hơn thời gian bắt đầu!");
            return;
        }
        onSubmit(formData);
        setFormData({ title: '', monitors: [], startTime: '', endTime: '', notes: '' });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Tạo mới Kế hoạch Bảo trì</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-3xl font-bold">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium text-lg">Tên bảo trì</label>
                        <input required name="title" value={formData.title} onChange={handleChange} type="text" className="border border-gray-300 rounded-lg p-3 text-lg" placeholder="VD: Nâng cấp Database" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium text-lg">Monitors chịu ảnh hưởng</label>
                        <select required multiple name="monitors" value={formData.monitors} onChange={handleSelectMonitor} className="border border-gray-300 rounded-lg p-3 text-lg h-32">
                            <option value="API Server">API Server</option>
                            <option value="Database Cluster">Database Cluster</option>
                            <option value="Payment Gateway">Payment Gateway</option>
                            <option value="Web Frontend">Web Frontend</option>
                        </select>
                        <p className="text-sm text-gray-500">Giữ Ctrl (hoặc Cmd) để chọn nhiều monitors</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium text-lg">Bắt đầu lúc</label>
                            <input required name="startTime" value={formData.startTime} onChange={handleChange} type="datetime-local" className="border border-gray-300 rounded-lg p-3 text-lg" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium text-lg">Kết thúc lúc</label>
                            <input required name="endTime" value={formData.endTime} onChange={handleChange} type="datetime-local" className="border border-gray-300 rounded-lg p-3 text-lg" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-700 font-medium text-lg">Ghi chú</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange} className="border border-gray-300 rounded-lg p-3 text-lg" rows="3" placeholder="Ghi chú thêm..."></textarea>
                    </div>
                    <div className="flex justify-end gap-4 border-t border-gray-200 pt-6 mt-6">
                        <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-300 rounded-lg text-lg font-medium hover:bg-gray-50">Hủy</button>
                        <button type="submit" className="px-6 py-3 bg-teal-600 text-white rounded-lg text-lg font-medium hover:bg-teal-700 shadow-sm">Lưu Kế Hoạch</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceFormModal;
