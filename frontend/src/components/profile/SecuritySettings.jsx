import React, { useState, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Lock, Shield, Loader2, Eye, EyeOff, X } from 'lucide-react';
import { changePasswordSchema } from '../../schemas/profileSchema';
import profileService from '../../services/profileService';

// ─── 2FA Modal ─────────────────────────────────────────────────────────────────
const TwoFactorModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('qr'); // 'qr' | 'verify'
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [enabling, setEnabling] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setStep('qr');
      setVerifyCode('');
      fetchQRCode();
    }
  }, [isOpen]);

  const fetchQRCode = async () => {
    setLoading(true);
    try {
      const response = await profileService.enable2FA();
      setQrCode(response.data.qrCode);
      setSecret(response.data.secret);
    } catch (error) {
      toast.error('Lỗi khi tạo mã QR');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (verifyCode.length !== 6) {
      toast.error('Mã xác thực phải có 6 chữ số');
      return;
    }
    setEnabling(true);
    try {
      await profileService.verify2FA(verifyCode);
      toast.success('Kích hoạt 2FA thành công!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Mã xác thực không hợp lệ');
    } finally {
      setEnabling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 animate-fade-in-scale z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold font-inter text-black">Kích hoạt Xác thực 2 yếu tố</h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
            <p className="text-sm text-gray-500 font-inter">Đang tạo mã QR...</p>
          </div>
        ) : step === 'qr' ? (
          <div className="flex flex-col items-center gap-5">
            <p className="text-sm text-gray-600 font-inter text-center">
              Quét mã QR bên dưới bằng ứng dụng Google Authenticator hoặc bất kỳ ứng dụng xác thực
              nào tương thích.
            </p>
            {/* QR Code */}
            <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-inner">
              {qrCode ? (
                <img src={qrCode} alt="QR Code 2FA" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded grid grid-cols-8 gap-0.5 p-2">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Manual Secret */}
            {secret && (
              <div className="w-full bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 font-inter mb-1">Hoặc nhập mã thủ công:</p>
                <code className="text-sm font-mono font-bold text-gray-800 select-all">{secret}</code>
              </div>
            )}
            <button
              onClick={() => setStep('verify')}
              className="w-full py-3 bg-indigo-500 text-white font-bold font-inter rounded-xl hover:bg-indigo-600 transition-colors"
            >
              Tiếp tục
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <p className="text-sm text-gray-600 font-inter">
              Nhập mã 6 chữ số từ ứng dụng xác thực của bạn để hoàn tất kích hoạt.
            </p>
            <input
              type="text"
              maxLength={6}
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="h-14 text-center text-2xl tracking-[0.5em] font-mono bg-zinc-100 rounded-xl border-2 border-transparent focus:border-indigo-400 outline-none transition-colors"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setStep('qr')}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium font-inter rounded-xl hover:bg-gray-200 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleVerify}
                disabled={enabling || verifyCode.length !== 6}
                className="flex-1 py-3 bg-indigo-500 text-white font-bold font-inter rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {enabling && <Loader2 className="w-4 h-4 animate-spin" />}
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Security Settings ─────────────────────────────────────────────────────────
const SecuritySettings = () => {
  const [saving, setSaving] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await profileService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
      reset();
      setShowPasswords({ current: false, new: false, confirm: false });
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi đổi mật khẩu';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-8 shadow-sm" id="security-settings-section">
        <h2 className="text-2xl font-normal font-inter text-stone-900 mb-4">Bảo mật</h2>
        <div className="h-0.5 bg-zinc-300 mb-6" />

        {/* Change Password Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <h3 className="text-sm font-medium font-inter text-gray-700 mb-4">Mật khẩu hiện tại</h3>

          <div className="flex flex-col gap-5 mb-6">
            {/* Current Password */}
            <div className="relative">
              <input
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                {...register('currentPassword')}
                placeholder="Nhập mật khẩu hiện tại"
                className={`w-full h-14 px-8 bg-zinc-100 rounded-xl text-base font-normal font-inter outline-none transition-all duration-200 ${
                  errors.currentPassword
                    ? 'ring-2 ring-red-400'
                    : 'focus:ring-2 focus:ring-indigo-400'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="relative">
              <input
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                {...register('newPassword')}
                placeholder="Nhập mật khẩu mới"
                className={`w-full h-14 px-8 bg-zinc-100 rounded-xl text-base font-normal font-inter outline-none transition-all duration-200 ${
                  errors.newPassword ? 'ring-2 ring-red-400' : 'focus:ring-2 focus:ring-indigo-400'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="relative">
              <input
                id="confirmNewPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                {...register('confirmNewPassword')}
                placeholder="Xác nhận mật khẩu mới"
                className={`w-full h-14 px-8 bg-zinc-100 rounded-xl text-base font-normal font-inter outline-none transition-all duration-200 ${
                  errors.confirmNewPassword
                    ? 'ring-2 ring-red-400'
                    : 'focus:ring-2 focus:ring-indigo-400'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 rounded-lg transition-colors"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {errors.confirmNewPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2.5 px-7 py-2.5 bg-indigo-500 text-white text-base font-normal font-inter rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang đổi...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Đổi mật khẩu
              </>
            )}
          </button>
        </form>

        {/* 2FA Section */}
        <div className="h-0.5 bg-zinc-300 mb-6" />
        <div className="flex flex-col gap-3">
          <p className="text-base font-normal font-inter text-slate-500">
            Tăng cường bảo mật tài khoản bằng xác thực 2 yếu tố
          </p>
          <button
            onClick={() => setShow2FAModal(true)}
            className="inline-flex items-center gap-2.5 px-5 py-2 bg-zinc-100 text-black text-lg font-normal font-inter rounded-xl hover:bg-zinc-200 transition-all duration-200 w-fit"
          >
            <Shield className="w-5 h-5" />
            Kích hoạt 2FA
          </button>
        </div>
      </div>

      {/* 2FA Modal */}
      <TwoFactorModal isOpen={show2FAModal} onClose={() => setShow2FAModal(false)} />
    </>
  );
};

export default memo(SecuritySettings);
