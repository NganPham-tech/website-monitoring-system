import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import settingsService from '../../../services/settingsService';
import { TextInput, PasswordInput } from './FormInputs';

const IntegrationsForm = () => {
  const { data: defaultValues, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: settingsService.getIntegrations,
    // Add default mock data if api returns 404/empty early on to match design visually
    initialData: {
      keycloakUrl: 'https://auth.uptime.com/auth',
      keycloakRealm: 'uptime-monitor-realm',
      keycloakClientId: 'uptime-admin-cli',
      keycloakSecret: 'kcl_v2_893jd823h8dh238dh2',
      stripePublishable: 'pk_live_51MtwB3H8...',
      stripeSecret: 'sk_live_51MtwB3H892jd823...',
      stripeWebhook: 'whsec_892jd823h8dh238dh2',
      smtpHost: 'smtp.sendgrid.net',
      smtpPort: 587,
      smtpUser: 'apikey',
      smtpPass: 'SG.892jd823h8dh238dh2.xyz',
      telegramBot: '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz',
      telegramChatId: '-1001234567890'
    }
  });

  const { register, handleSubmit, getValues } = useForm({ values: defaultValues });

  const mutSave = useMutation({
    mutationFn: settingsService.updateIntegrations,
    onSuccess: () => toast.success('Đã lưu cấu hình API/Tích hợp thành công!'),
    onError: () => toast.error('Lỗi lưu cấu hình')
  });

  const mutTestSmtp = useMutation({
    mutationFn: settingsService.testSmtp,
    onSuccess: () => toast.success('Kiểm tra SMTP thành công. Mail test đã gửi!'),
    onError: () => toast.error('Kết nối SMTP thất bại. Vui lòng kiểm tra lại cấu hình.')
  });

  const onSubmit = (data) => {
    mutSave.mutate(data);
  };

  const handleTestSmtp = () => {
    const data = getValues();
    mutTestSmtp.mutate({ host: data.smtpHost, port: data.smtpPort, user: data.smtpUser, pass: data.smtpPass });
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-teal-500 w-8 h-8" /></div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
      {/* Keycloak */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <span className="text-2xl">🔐</span>
          <h2 className="text-lg font-semibold text-slate-800">Identity & Access (Keycloak)</h2>
        </div>
        <TextInput label="Keycloak Server URL" register={register('keycloakUrl')} />
        <TextInput label="Realm Name" register={register('keycloakRealm')} />
        <TextInput label="Admin Client ID" register={register('keycloakClientId')} />
        <PasswordInput label="Client Secret" register={register('keycloakSecret')} />
        <div className="flex justify-end mt-6">
          <button type="submit" disabled={mutSave.isLoading} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-5 rounded-md transition disabled:opacity-50 flex items-center">
            {mutSave.isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null} Lưu Cấu Hình
          </button>
        </div>
      </div>

      {/* Stripe */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <span className="text-2xl">💳</span>
          <h2 className="text-lg font-semibold text-slate-800">Cổng Thanh Toán (Stripe)</h2>
        </div>
        <TextInput label="Publishable Key" register={register('stripePublishable')} />
        <PasswordInput label="Secret Key" register={register('stripeSecret')} />
        <PasswordInput label="Webhook Signing Secret" register={register('stripeWebhook')} />
        <div className="flex justify-end mt-6">
          <button type="submit" disabled={mutSave.isLoading} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-5 rounded-md transition disabled:opacity-50">
            Lưu Cấu Hình
          </button>
        </div>
      </div>

      {/* SMTP */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <span className="text-2xl">📧</span>
          <h2 className="text-lg font-semibold text-slate-800">Hệ thống Gửi Mail (SMTP)</h2>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <TextInput label="SMTP Host" register={register('smtpHost')} />
          </div>
          <div className="col-span-4">
            <TextInput label="Port" type="number" register={register('smtpPort', { valueAsNumber: true })} />
          </div>
        </div>
        <TextInput label="SMTP Username" register={register('smtpUser')} />
        <PasswordInput label="SMTP Password" register={register('smtpPass')} />
        <div className="flex justify-end mt-6 gap-4">
          <button type="button" onClick={handleTestSmtp} disabled={mutTestSmtp.isLoading} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-5 rounded-md transition disabled:opacity-50 flex items-center">
            {mutTestSmtp.isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null} Gửi Mail Test
          </button>
          <button type="submit" disabled={mutSave.isLoading} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-5 rounded-md transition disabled:opacity-50">
            Lưu Cấu Hình
          </button>
        </div>
      </div>

      {/* Telegram */}
      <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
          <span className="text-2xl">🤖</span>
          <h2 className="text-lg font-semibold text-slate-800">Telegram System Bot</h2>
        </div>
        <p className="text-slate-500 font-inter text-sm mb-5 leading-relaxed">
          Bot này được dùng để bắn cảnh báo hạ tầng riêng cho nhóm nội bộ (Super Admin). Khác với bot cảnh báo của User.
        </p>
        <PasswordInput label="Bot Token" register={register('telegramBot')} />
        <TextInput label="Admin Group Chat ID" register={register('telegramChatId')} />
        <div className="flex justify-end mt-6">
          <button type="submit" disabled={mutSave.isLoading} className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-5 rounded-md transition disabled:opacity-50">
            Lưu Cấu Hình
          </button>
        </div>
      </div>
    </form>
  );
};

export default IntegrationsForm;
