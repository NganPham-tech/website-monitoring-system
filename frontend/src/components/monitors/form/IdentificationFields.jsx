import React from 'react';

const IdentificationFields = ({ register, errors }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-black">Thông tin cơ bản</h2>
      
      <div className="space-y-6">
        {/* Monitor Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Tên Monitor</label>
          <input
            {...register('name')}
            type="text"
            placeholder="monitor"
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#00BFA5] transition-all font-inter shadow-sm"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* URL/IP */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">URL/IP</label>
          <input
            {...register('url')}
            type="text"
            placeholder="https://example.com"
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#00BFA5] transition-all font-inter shadow-sm"
          />
          {errors.url && <p className="text-xs text-red-500 mt-1">{errors.url.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Mô tả</label>
          <textarea
            {...register('description')}
            rows="3"
            placeholder="Mô tả chi tiết về monitor này"
            className="w-full p-4 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#00BFA5] transition-all font-inter shadow-sm resize-none"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default IdentificationFields;
