import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Save, Loader2 } from 'lucide-react';

import alertSettingsService from '../../api/alertSettingsService';
import TriggerSettings from '../../components/alerts/TriggerSettings';
import ChannelIntegrations from '../../components/alerts/ChannelIntegrations';
import SilentModeSettings from '../../components/alerts/SilentModeSettings';
import PayloadCustomizer from '../../components/alerts/PayloadCustomizer';

export default function AlertSettings() {
  const queryClient = useQueryClient();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['alertSettings'],
    queryFn: alertSettingsService.getSettings,
  });

  const methods = useForm({
    defaultValues: {
      triggers: {
        websiteDown: true,
        slowResponse: { enabled: false, threshold: 500 },
        ssl: { enabled: false, daysBefore: 7 }
      },
      channels: {
        email: { enabled: false, target: '' },
        discord: { enabled: false, target: '' },
        telegram: { enabled: false, target: '' },
        sms: { enabled: false, target: '' }
      },
      silentMode: {
        enabled: false,
        startTime: '22:00',
        endTime: '06:00',
        days: {
          mon: false, tue: false, wed: false, thu: false, fri: false, sat: false, sun: false
        }
      },
      customPayload: {
        title: '',
        body: ''
      }
    }
  });

  // Reset form values when data gets loaded
  useEffect(() => {
    if (settingsData) {
      methods.reset(settingsData);
    }
  }, [settingsData, methods]);

  const updateMutation = useMutation({
    mutationFn: alertSettingsService.updateSettings,
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['alertSettings'], updatedData);
      toast.success('Lưu cấu hình cảnh báo thành công!');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi lưu cấu hình.');
    }
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-10 bg-teal-50 flex items-center justify-center">
         <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-10 bg-slate-50 min-h-[100vh]">
      <div className="max-w-[1732px] mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-teal-600 font-['Inter']">Cấu Hình Cảnh Báo</h1>
          <button
            onClick={methods.handleSubmit(onSubmit)}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? (
               <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
               <Save className="w-5 h-5" />
            )}
            Lưu Cấu Hình
          </button>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-[1300px]">
            <TriggerSettings />
            <ChannelIntegrations />
            <SilentModeSettings />
            <PayloadCustomizer />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
