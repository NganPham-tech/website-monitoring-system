import { useFormContext, Controller } from 'react-hook-form';

export default function ChannelIntegrations() {
  const { control, watch } = useFormContext();
  
  const channels = [
    { id: 'email', name: 'Email', placeholder: 'ví dụ: admin@example.com' },
    { id: 'discord', name: 'Discord', placeholder: 'Webhook URL' },
    { id: 'telegram', name: 'Telegram', placeholder: 'Chat ID' },
    { id: 'sms', name: 'SMS', placeholder: 'Số điện thoại' }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-8 mb-8 border border-slate-100">
      <h2 className="text-xl font-semibold text-black uppercase mb-6 tracking-wide border-b pb-3">Kênh Nhận Cảnh Báo</h2>
      
      <div className="space-y-6">
        {channels.map((channel) => {
          const isEnabled = watch(`channels.${channel.id}.enabled`);
          
          return (
            <div key={channel.id} className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-black">{channel.name}</span>
                <Controller
                  name={`channels.${channel.id}.enabled`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={value} onChange={(e) => onChange(e.target.checked)} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                    </label>
                  )}
                />
              </div>
              
              {isEnabled && (
                <div className="mt-4 animate-fade-in">
                  <Controller
                    name={`channels.${channel.id}.target`}
                    control={control}
                    rules={{ required: isEnabled ? `Vui lòng nhập thông tin cho ${channel.name}` : false }}
                    render={({ field, fieldState }) => (
                      <div className="relative">
                        <input 
                          type="text" 
                          {...field} 
                          className={`w-full h-12 px-4 border ${fieldState.error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow`}
                          placeholder={channel.placeholder} 
                        />
                        {fieldState.error && (
                          <span className="absolute left-0 top-full mt-1 text-xs text-red-500">{fieldState.error.message}</span>
                        )}
                      </div>
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
