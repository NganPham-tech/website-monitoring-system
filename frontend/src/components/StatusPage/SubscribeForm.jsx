import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import statusPageService from '../../api/statusPageService';

const SubscribeForm = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await statusPageService.subscribe(data.email);
      toast.success('Đăng ký nhận thông báo thành công!');
      reset();
    } catch (error) {
        const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1208px] bg-white p-16 mt-10 shadow-sm rounded-sm flex flex-col items-center">
      <h3 className="text-xs font-normal text-black font-['Inter'] uppercase mb-4 tracking-widest">
        NHẬN THÔNG BÁO CẬP NHẬT
      </h3>
      <p className="text-xl font-normal text-black font-['Inter'] mb-10">
        Đăng ký để nhận thông báo qua email
      </p>

      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row items-center gap-2 w-full max-w-lg"
      >
        <div className="flex-1 w-full relative">
          <input
            {...register('email', { 
                required: 'Vui lòng nhập email', 
                pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ'
                }
            })}
            type="email"
            placeholder="example@email.com"
            className={`w-full h-12 px-4 bg-zinc-100 border ${errors.email ? 'border-red-500' : 'border-zinc-200'} rounded-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-['Inter']`}
            disabled={loading}
          />
          {errors.email && (
            <span className="absolute left-0 top-full mt-1 text-[10px] text-red-500 font-['Inter']">
              {errors.email.message}
            </span>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-32 h-12 bg-indigo-500 text-white font-['Inter'] text-sm hover:bg-indigo-600 disabled:bg-indigo-300 transition-colors rounded-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Đang gửi...</span>
            </>
          ) : (
            'Đăng ký'
          )}
        </button>
      </form>
    </div>
  );
};

export default SubscribeForm;
