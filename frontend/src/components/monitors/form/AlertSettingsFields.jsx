import React from 'react';

const AlertSettingsFields = ({ register, watch, errors }) => {
  const watchTriggers = watch('alertTriggers');

  const channels = [
    { id: 'email', label: 'Email' },
    { id: 'discord', label: 'Discord' },
    { id: 'sms', label: 'SMS' },
    { id: 'telegram', label: 'Telegram' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-black">Cảnh báo</h2>
      
      <div className="space-y-4">
        {/* Trigger List */}
        <div className="space-y-3">
          <label className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              {...register('alertTriggers.isDown')}
              type="checkbox"
              className="w-5 h-5 rounded accent-[#00BFA5]"
            />
            <span className="text-sm font-medium text-gray-700">Cảnh báo khi Website down</span>
          </label>

          <label className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              {...register('alertTriggers.slowResponse')}
              type="checkbox"
              className="w-5 h-5 rounded accent-[#00BFA5]"
            />
            <span className="text-sm font-medium text-gray-700">Cảnh báo khi response time chậm</span>
          </label>

          <label className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              {...register('alertTriggers.sslExpiry')}
              type="checkbox"
              className="w-5 h-5 rounded accent-[#00BFA5]"
            />
            <span className="text-sm font-medium text-gray-700">Cảnh báo khi SSL sắp hết hạn</span>
          </label>
        </div>

        {/* Channel Selection Listbox style */}
        <div className="space-y-2 pt-2">
          <label className="block text-sm font-medium text-gray-500">Kênh nhận cảnh báo</label>
          <select
            {...register('alertChannels')}
            multiple
            className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#00BFA5] transition-all font-medium text-gray-700 shadow-sm min-h-[120px] cursor-pointer"
          >
            {channels.map(ch => (
              <option key={ch.id} value={ch.id} className="py-1 px-2 rounded hover:bg-[#E0F2F1]">{ch.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 italic">Giữ Ctrl/Cmd để chọn nhiều kênh</p>
        </div>
      </div>
    </div>
  );
};

export default AlertSettingsFields;
