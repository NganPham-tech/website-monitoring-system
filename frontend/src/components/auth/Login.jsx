import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SocialLoginButton from './SocialLoginButton';
import authService from '../../services/authService';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password, formData.rememberMe);
      toast.success('Đăng nhập thành công!');
      navigate('/monitors');
    } catch (error) {
      const message = error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authService.redirectToGoogle();
  };

  const handleGithubLogin = () => {
    authService.redirectToGithub();
  };

  return (
    <div className="flex flex-col w-full h-full justify-center">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-2">
          Đăng nhập
        </h2>
        <p className="text-gray-500 font-medium">
          Chào mừng trở lại với Uptime Monitor!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2 px-1">
            Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
              <Mail size={20} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full h-[60px] pl-12 pr-4 bg-white border-[3px] rounded-2xl outline-none transition-all duration-300 font-inter text-lg ${
                errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
              }`}
              placeholder="your.email@example.com"
            />
          </div>
          {errors.email && <p className="mt-2 text-sm text-red-500 font-medium px-1 italic">{errors.email}</p>}
        </div>

        {/* Password Input */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700 px-1">
              Mật khẩu
            </label>
            <Link to="/forgot-password" size="sm" className="text-accent-link hover:underline text-sm font-medium">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
              <Lock size={20} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full h-[60px] pl-12 pr-12 bg-white border-[3px] rounded-2xl outline-none transition-all duration-300 font-inter text-lg ${
                errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary'
              }`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="mt-2 text-sm text-red-500 font-medium px-1 italic">{errors.password}</p>}
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <label className="flex items-center group cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-6 h-6 border-[3px] rounded-md transition-all duration-200 flex items-center justify-center ${
                formData.rememberMe ? 'bg-primary border-primary' : 'bg-white border-gray-300 group-hover:border-primary'
              }`}>
                {formData.rememberMe && (
                  <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                )}
              </div>
            </div>
            <span className="ml-3 text-gray-700 font-medium font-inter select-none">Ghi nhớ đăng nhập</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-[65px] bg-gradient-to-r from-primary to-emerald-400 text-white rounded-2xl text-xl font-bold font-inter shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin mr-3" />
          ) : null}
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>

      {/* Divider */}
      <div className="my-10 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-white px-4 text-gray-500 font-bold font-inter tracking-widest">hoặc</span>
        </div>
      </div>

      {/* Social Login */}
      <div className="space-y-4">
        <SocialLoginButton provider="google" onClick={handleGoogleLogin} />
        <SocialLoginButton provider="github" onClick={handleGithubLogin} />
      </div>

      {/* Footer Links */}
      <div className="mt-10 text-center space-y-4">
        <p className="text-gray-500 font-medium">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-accent-link font-bold hover:underline">
            Đăng kí ngay
          </Link>
        </p>
        <Link to="/" className="inline-block text-accent-blue font-bold hover:underline mb-4">
          <div className="flex items-center justify-center space-x-2">
            <span>Về trang chủ</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Login;
