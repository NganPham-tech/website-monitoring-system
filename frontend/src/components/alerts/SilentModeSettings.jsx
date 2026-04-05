import { useFormContext, Controller } from 'react-hook-form';

export default function SilentModeSettings() {
  const { control, watch } = useFormContext();
  const isSilentModeEnabled = watch('silentMode.enabled');

  const daysOfWeek = [
    { id: 'mon', label: 'THỨ 2' },
    { id: 'tue', label: 'THỨ 3' },
    { id: 'wed', label: 'THỨ 4' },
    { id: 'thu', label: 'THỨ 5' },
    { id: 'fri', label: 'THỨ 6' },
    { id: 'sat', label: 'THỨ 7' },
    { id: 'sun', label: 'CHỦ NHẬT' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-8 mb-8 border border-slate-100">
      <div className="flex items-center justify-between mb-6 border-b pb-3">
        <h2 className="text-xl font-semibold text-black uppercase tracking-wide">Chế Độ Im Lặng</h2>
        <Controller
          name="silentMode.enabled"
          control={control}
          render={({ field: { value, onChange } }) => (
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={value} onChange={(e) => onChange(e.target.checked)} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          )}
        />
      </div>

      <div className={`transition-opacity duration-300 ${isSilentModeEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <p className="text-gray-500 mb-6">Không gửi thông báo trong khung giờ và các ngày được chọn.</p>
        
        <h3 className="text-lg font-medium text-black mb-4 uppercase">Lịch Cảnh Báo</h3>
        
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">TỪ</label>
             <Controller
                name="silentMode.startTime"
                control={control}
                render={({ field }) => (
                  <input 
                    type="time" 
                    {...field} 
                    className="w-full h-14 px-4 bg-zinc-100 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none text-lg"
                  />
                )}
              />
          </div>
          
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">ĐẾN</label>
             <Controller
                name="silentMode.endTime"
                control={control}
                render={({ field }) => (
                  <input 
                    type="time" 
                    {...field} 
                    className="w-full h-14 px-4 bg-zinc-100 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none text-lg"
                  />
                )}
              />
          </div>
        </div>

        <h3 className="text-lg font-medium text-black mb-4 uppercase">Ngày Áp Dụng</h3>
        <div className="flex flex-col gap-3">
          {daysOfWeek.map((day) => (
            <div key={day.id} className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-md hover:bg-stone-100 transition-colors cursor-pointer">
              <span className="text-md font-medium text-black">{day.label}</span>
              <Controller
                name={`silentMode.days.${day.id}`}
                control={control}
                render={({ field: { value, onChange } }) => (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={value} onChange={(e) => onChange(e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
