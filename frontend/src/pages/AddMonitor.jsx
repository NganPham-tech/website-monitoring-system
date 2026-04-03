import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

import api from '../services/api';
import { addMonitorSchema } from '../schemas/monitorSchema';
import IdentificationFields from '../components/monitors/form/IdentificationFields';
import ProtocolEngineFields from '../components/monitors/form/ProtocolEngineFields';
import AlertSettingsFields from '../components/monitors/form/AlertSettingsFields';

const AddMonitor = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addMonitorSchema),
    defaultValues: {
      protocol: 'HTTP(S)',
      interval: '30',
      timeout: '1 phút',
      retries: '2',
      httpMethod: 'GET',
      locations: ['asian'],
      alertTriggers: {
        isDown: true,
        slowResponse: true,
        sslExpiry: false,
      },
      alertChannels: ['email'],
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Logic for real API or mock
      await api.post('/monitors', data);
      toast.success('Tạo Monitor thành công!');
      navigate('/monitors');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo monitor');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Page Title with Underline */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#00897B] mb-4">Thêm Monitor Mới</h1>
        <hr className="border-[#00BFA5] border-t-2 opacity-50" />
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl p-12 shadow-sm border border-gray-50 space-y-12 pb-24 relative">
        
        {/* Sub-Components */}
        <ProtocolEngineFields register={register} watch={watch} errors={errors} />
        
        <hr className="border-[#00BFA5] opacity-30" />
        
        <IdentificationFields register={register} errors={errors} />
        
        <hr className="border-[#00BFA5] opacity-30" />
        
        <AlertSettingsFields register={register} watch={watch} errors={errors} />

        <hr className="border-[#00BFA5] opacity-30" />

        {/* Action Buttons at the bottom right */}
        <div className="absolute bottom-10 right-12 flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/monitors')}
            className="px-10 py-3 bg-[#E0F2F1] text-[#00897B] border border-[#00BFA5] rounded-xl font-bold text-lg hover:bg-[#B2DFDB] transition-all"
          >
            Hủy
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-3 bg-[#00BFA5] text-white rounded-xl font-bold text-lg hover:bg-[#00897B] shadow-lg shadow-[#00BFA5]/20 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            Tạo Monitor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMonitor;
