import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader2, User } from 'lucide-react';

import { registerSchema } from '../../schemas/registerSchema';
import authService from '../../services/authService';
import FormInput from '../elements/FormInput';
import PlanSelector from '../elements/PlanSelector';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      acceptTerms: false,
      plan: 'Miễn phí - 5 Monitors'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // payload chứa mọi thông tin của user và gói
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        company: data.company,
        plan: data.plan
      };

      await authService.register(payload);
      toast.success('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full relative bg-white py-10 px-4 flex justify-center mb-10 overflow-hidden">
      
      {/* Container Khớp với HTML - Rộng để chứa Title và Form (ẩn UI trái phải đi) */}
      <div className="max-w-4xl w-full flex flex-col items-center">
        
        {/* Banner Headers */}
        <div className="flex flex-col items-center text-center justify-center flex-shrink-0 w-full mb-16 relative">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-primary/10 rounded-2xl border-[3px] border-primary/20 shadow-sm">
            <User className="w-12 h-12 text-primary" strokeWidth={2.5} />
          </div>
          <h1 className="text-primary-dark text-4xl md:text-5xl font-bold font-inter mb-2">
            Đăng kí tài khoản
          </h1>
          <h3 className="text-primary-dark text-xl md:text-3xl font-medium font-inter">
            Đăng kí tài khoản để bắt đầu giám sát
          </h3>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[785px] space-y-12">
          
          {/* Row 1: First Name & Last Name */}
          <div className="flex flex-col md:flex-row space-y-12 md:space-y-0 md:space-x-[30px] w-full items-end">
            <FormInput
              label="Họ"
              name="firstName"
              placeholder="Nguyễn"
              register={register}
              error={errors.firstName}
              className="w-full md:w-1/2"
            />
            <FormInput
              label="Tên"
              name="lastName"
              placeholder="Văn A"
              register={register}
              error={errors.lastName}
              className="w-full md:w-1/2"
            />
          </div>

          {/* Email */}
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="your.email@example.com"
            register={register}
            error={errors.email}
          />

          {/* Company */}
          <FormInput
            label="Công ty/Tổ chức (Tuỳ chọn)"
            name="company"
            placeholder="Tên công ty"
            register={register}
            error={errors.company}
          />

          {/* Password */}
          <FormInput
            label="Mật khẩu"
            name="password"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password}
          />

          {/* Confirm Password */}
          <FormInput
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.confirmPassword}
          />

          {/* Plan Selection */}
          <PlanSelector register={register} error={errors.plan} />

          {/* Submit Button */}
          <div className="pt-6 relative w-full h-16">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-[20px] text-white text-3xl font-bold font-inter disabled:opacity-70 flex justify-center items-center hover:opacity-90 transition-opacity"
            >
               {loading ? <Loader2 className="w-8 h-8 animate-spin mr-3" /> : null}
               {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </button>
          </div>

          {/* Accept Terms */}
          <div className="flex items-center justify-center relative mt-6 pt-2 w-full">
            <label className="flex items-center justify-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  {...register('acceptTerms')}
                  className="sr-only"
                />
                <div className={`w-14 h-9 rounded-[10px] border-[5px] flex items-center justify-center transition-colors ${
                  errors.acceptTerms ? 'border-red-400' : 'border-Grays-Gray-4 group-hover:border-primary'
                }`}>
                  {/* Fake checkbox check icon handled by CSS or state... in react hook form it stays simple */}
                  <div className="w-10 h-6 flex items-center justify-center rounded-[6px]">
                     <svg className="w-6 h-6 text-primary fill-current pointer-events-none opacity-0 check-mark-svg" viewBox="0 0 20 20">
                        <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                     </svg>
                  </div>
                  {/* Style inline to show SVG when checked */}
                  <style>
                    {`input:checked + div .check-mark-svg { opacity: 1; }`}
                  </style>
                </div>
              </div>
              <span className="ml-4 text-black text-xl md:text-2xl font-medium font-inter">
                Tôi đồng ý với <span className="text-Accents-Blue">Điều khoản dịch vụ</span><span className="text-black"> và </span><span className="text-Accents-Blue">Chính sách bảo mật</span>
              </span>
            </label>
            {errors.acceptTerms && <p className="absolute -bottom-8 text-sm text-red-500 font-medium">{errors.acceptTerms.message}</p>}
          </div>

          {/* Footer Navigation */}
          <div className="flex flex-col items-center mt-12 space-y-4">
            <p className="text-black text-2xl md:text-3xl font-medium font-inter">
              Đã có tài khoản? <Link to="/login" className="text-Accents-Blue hover:underline">Đăng nhập</Link>
            </p>
            
            <Link to="/" className="relative flex items-center text-Accents-Blue text-2xl md:text-3xl font-medium font-inter group">
              <div className="mr-2">
                {/* Arrow from HTML */}
                <svg className="w-6 h-6 rotate-180 fill-current" viewBox="0 0 24 24">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </div>
              Về trang chủ
            </Link>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Register;
