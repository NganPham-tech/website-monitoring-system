import { useFormContext, Controller } from 'react-hook-form';

export default function TriggerSettings() {
  const { control, watch } = useFormContext();
  const watchSlowResponse = watch('triggers.slowResponse.enabled');
  const watchSSLCert = watch('triggers.ssl.enabled');

  return (
    <div className="bg-white rounded-lg shadow p-8 mb-8 border border-slate-100">
      <h2 className="text-xl font-semibold text-black uppercase mb-6 tracking-wide border-b pb-3">Cài Đặt Chung</h2>
      
      <div className="space-y-8">
        {/* Website Down Trigger */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-black">Cảnh báo khi website down</h3>
            <p className="text-sm text-gray-500">Nhận thông báo ngay lập tức khi trang web không phản hồi.</p>
          </div>
          <Controller
            name="triggers.websiteDown"
            control={control}
            render={({ field: { value, onChange } }) => (
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={value} onChange={(e) => onChange(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
              </label>
            )}
          />
        </div>

        {/* Slow Response Time Trigger */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-black">Cảnh báo khi Response Time chậm</h3>
              <p className="text-sm text-gray-500">Kích hoạt khi thời gian phản hồi vượt mức cấu hình.</p>
            </div>
            <Controller
              name="triggers.slowResponse.enabled"
              control={control}
              render={({ field: { value, onChange } }) => (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={value} onChange={(e) => onChange(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              )}
            />
          </div>
          {watchSlowResponse && (
            <div className="flex items-center space-x-4 pl-4 border-l-2 border-teal-500">
              <span className="text-sm text-gray-700">Ngưỡng cảnh báo (ms):</span>
              <Controller
                name="triggers.slowResponse.threshold"
                control={control}
                rules={{ required: watchSlowResponse }}
                render={({ field }) => (
                  <input 
                    type="number" 
                    {...field} 
                    className="w-24 h-10 px-3 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
                    placeholder="500" 
                  />
                )}
              />
            </div>
          )}
        </div>

        {/* SSL Certificate Trigger */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-black">Cảnh báo SSL Certificate</h3>
              <p className="text-sm text-gray-500">Nhận thông báo trước khi chứng chỉ SSL hết hạn.</p>
            </div>
            <Controller
              name="triggers.ssl.enabled"
              control={control}
              render={({ field: { value, onChange } }) => (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={value} onChange={(e) => onChange(e.target.checked)} />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                </label>
              )}
            />
          </div>
          {watchSSLCert && (
            <div className="flex items-center space-x-4 pl-4 border-l-2 border-teal-500">
              <span className="text-sm text-gray-700">Báo trước (ngày):</span>
              <Controller
                name="triggers.ssl.daysBefore"
                control={control}
                rules={{ required: watchSSLCert }}
                render={({ field }) => (
                   <input 
                    type="number" 
                    {...field} 
                    className="w-24 h-10 px-3 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
                    placeholder="7" 
                  />
                )}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
