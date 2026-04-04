import React from 'react';

const ProtocolEngineFields = ({ register, watch, errors }) => {
  const protocol = watch('protocol');

  const locations = [
    { id: 'us-west', label: 'US West' },
    { id: 'us-east', label: 'US East' },
    { id: 'asian', label: 'Asian' },
  ];

  return (
    <div className="space-y-10">
      {/* Loại Monitor Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-black">Loại Monitor</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['HTTP(S)', 'Ping', 'Port', 'Keyword'].map((p) => (
            <label key={p} className="cursor-pointer group">
              <input
                {...register('protocol')}
                type="radio"
                value={p}
                className="peer sr-only"
              />
              <div className="w-full h-20 flex items-center justify-center rounded-lg border border-gray-100 bg-white text-[#00BFA5] font-bold text-xl peer-checked:border-[#00BFA5] peer-checked:bg-[#E0F2F1]/30 transition-all duration-300 shadow-sm group-hover:border-[#00BFA5]">
                {p}
              </div>
            </label>
          ))}
        </div>
        <hr className="border-[#00BFA5] opacity-30" />
      </div>

      {/* Cấu hình giám sát Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-black">Cấu hình giám sát</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">Tần suất kiểm tra</label>
            <input
              {...register('interval')}
              type="text"
              placeholder="30"
              className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#00BFA5] transition-all font-inter shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">Timeout</label>
            <input
              {...register('timeout')}
              type="text"
              placeholder="1 phút"
              className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#00BFA5] transition-all font-inter shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">Số lần thử lại</label>
            <input
              {...register('retries')}
              type="text"
              placeholder="2"
              className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#00BFA5] transition-all font-inter shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500">HTTP Method</label>
            <select
              {...register('httpMethod')}
              className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#00BFA5] transition-all font-bold text-gray-700 shadow-sm appearance-none cursor-pointer"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-500">Vị trí giám sát</label>
            <select
              {...register('locations')}
              multiple
              className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#00BFA5] transition-all font-medium text-gray-700 shadow-sm min-h-[120px] cursor-pointer"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id} className="py-1 px-2 rounded hover:bg-[#E0F2F1]">{loc.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 italic">Giữ Ctrl/Cmd để chọn nhiều vị trí</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolEngineFields;
