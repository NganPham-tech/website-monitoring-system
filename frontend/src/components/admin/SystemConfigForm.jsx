import React, { memo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { useSystemSettings, useUpdateSystemSettings } from '../../hooks/useAdmin';

const ConfigField = ({ label, register, error, type = 'number' }) => (
  <div className="relative w-full h-14 bg-zinc-100 rounded-[10px] flex items-center px-6">
    <label className="text-gray-700 text-sm font-medium font-inter w-48 shrink-0">{label}</label>
    <div className="flex-1 flex flex-col">
      <input 
        type={type}
        {...register}
        className="w-full bg-transparent outline-none text-black font-inter text-base"
      />
      {error && <span className="text-xs text-red-500 absolute -bottom-5">{error.message}</span>}
    </div>
  </div>
);

const SystemConfigForm = () => {
  const { data: settings, isLoading } = useSystemSettings();
  const updateSettingsMut = useUpdateSystemSettings();

  const { register, handleSubmit, formState: { errors } } = useForm({
    values: settings || {
      defaultCheckInterval: 5,
      maxMonitorsPerUser: 50,
      alertRetentionDays: 30,
      databaseBackupSync: 24,
      apiRateLimit: 100,
      serverStatusToggle: true,
    }
  });

  const onSubmit = (data) => {
    // Basic val
    if (data.defaultCheckInterval <= 0) return toast.error('Interval phải > 0');
    
    updateSettingsMut.mutate(data, {
      onSuccess: () => toast.success('Cập nhật cấu hình thành công'),
      onError: () => toast.error('Lỗi cập nhật cấu hình'),
    });
  };

  return (
    <div className="bg-white rounded-[10px] p-8 w-full shadow-sm min-h-[637px] flex flex-col relative">
      <h2 className="text-2xl font-semibold font-inter text-black text-center mb-10">Cấu hình hệ thống</h2>
      
      {isLoading ? (
        <div className="flex-1 flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 flex-1">
          <ConfigField 
            label="Default Check Interval" 
            register={register('defaultCheckInterval', { valueAsNumber: true, min: {value: 1, message: 'Min 1'} })} 
            error={errors.defaultCheckInterval} 
          />
          <ConfigField 
            label="Max Monitors per User" 
            register={register('maxMonitorsPerUser', { valueAsNumber: true })} 
            error={errors.maxMonitorsPerUser} 
          />
          <ConfigField 
            label="Alert Retention (Days)" 
            register={register('alertRetentionDays', { valueAsNumber: true })} 
            error={errors.alertRetentionDays} 
          />
          <ConfigField 
            label="Database Backup (Hrs)" 
            register={register('databaseBackupSync', { valueAsNumber: true })} 
            error={errors.databaseBackupSync} 
          />
          <ConfigField 
            label="API Rate Limit (/hr)" 
            register={register('apiRateLimit', { valueAsNumber: true })} 
            error={errors.apiRateLimit} 
          />

          <div className="mt-auto flex gap-4 pr-10">
            <button 
              type="submit" 
              disabled={updateSettingsMut.isLoading}
              className="w-40 h-14 bg-teal-500 rounded-[10px] text-black text-xl font-bold font-inter flex justify-center items-center hover:bg-teal-600 transition disabled:opacity-50"
            >
              {updateSettingsMut.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Chỉnh sửa'}
            </button>
            <button 
              type="button" 
              className="w-40 h-12 bg-stone-200 rounded-[10px] text-black text-xl font-bold font-inter flex justify-center items-center hover:bg-stone-300 transition"
              onClick={() => toast.success('Đang thực hiện trigger cronjob backup...')}
            >
              Backup ngay
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default memo(SystemConfigForm);
