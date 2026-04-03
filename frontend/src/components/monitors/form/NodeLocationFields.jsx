import React from 'react';
import { MapPin } from 'lucide-react';

const NodeLocationFields = ({ register, errors }) => {
  const locations = [
    { id: 'us-west', label: 'US West', country: 'United States' },
    { id: 'us-east', label: 'US East', country: 'United States' },
    { id: 'asian', label: 'Asian', country: 'Singapore' },
  ];

  return (
    <div className="bg-white p-8 rounded-3xl border-[3px] border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 font-bold">3</div>
        <h2 className="text-2xl font-bold text-gray-900">Mạng lưới Node (Location Nodes)</h2>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-gray-700 ml-1">Chọn khu vực máy chủ <span className="text-red-500">*</span></label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations.map((loc) => (
            <label key={loc.id} className="group relative cursor-pointer">
              <input
                {...register('locations')}
                type="checkbox"
                value={loc.id}
                className="peer sr-only"
              />
              <div className="p-5 border-[3px] border-gray-50 bg-gray-50 rounded-2xl transition-all duration-300 peer-checked:border-amber-500 peer-checked:bg-amber-50/50 group-hover:bg-gray-100/50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-gray-400 peer-checked:text-amber-500 transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{loc.label}</div>
                    <div className="text-xs text-gray-400 font-medium">{loc.country}</div>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
        {errors.locations && <p className="text-sm text-red-500 font-medium ml-1 italic">{errors.locations.message}</p>}
      </div>
    </div>
  );
};

export default NodeLocationFields;
