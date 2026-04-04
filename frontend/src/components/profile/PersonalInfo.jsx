import React, { useState, useCallback, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { Camera, Save, Loader2 } from 'lucide-react';
import { personalInfoSchema } from '../../schemas/profileSchema';
import profileService from '../../services/profileService';

const TIMEZONES = [
  { value: 'Asia/Ho_Chi_Minh', label: 'GMT+7 (Ho Chi Minh)' },
  { value: 'Asia/Bangkok', label: 'GMT+7 (Bangkok)' },
  { value: 'Asia/Tokyo', label: 'GMT+9 (Tokyo)' },
  { value: 'Asia/Shanghai', label: 'GMT+8 (Shanghai)' },
  { value: 'Asia/Singapore', label: 'GMT+8 (Singapore)' },
  { value: 'Asia/Kolkata', label: 'GMT+5:30 (Kolkata)' },
  { value: 'Europe/London', label: 'GMT+0 (London)' },
  { value: 'Europe/Paris', label: 'GMT+1 (Paris)' },
  { value: 'America/New_York', label: 'GMT-5 (New York)' },
  { value: 'America/Los_Angeles', label: 'GMT-8 (Los Angeles)' },
  { value: 'Australia/Sydney', label: 'GMT+11 (Sydney)' },
  { value: 'Pacific/Auckland', label: 'GMT+13 (Auckland)' },
];

const PersonalInfo = ({ profile, onProfileUpdate }) => {
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      company: profile?.company || '',
      phone: profile?.phone || '',
      timezone: profile?.timezone || 'Asia/Ho_Chi_Minh',
    },
  });

  const getInitials = useCallback(() => {
    const first = profile?.firstName?.[0] || '';
    const last = profile?.lastName?.[0] || '';
    return (first + last).toUpperCase() || 'NA';
  }, [profile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Upload avatar if changed
      if (avatarFile) {
        await profileService.uploadAvatar(avatarFile);
      }
      const response = await profileService.updateProfile(data);
      toast.success('Cập nhật thông tin thành công!');
      if (onProfileUpdate) onProfileUpdate(response.data);
    } catch (error) {
      const message = error.response?.data?.message || 'Lỗi khi cập nhật thông tin';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm" id="personal-info-section">
      {/* Section Header */}
      <h2 className="text-2xl font-bold font-inter text-black mb-6">Thông tin cá nhân</h2>

      {/* Avatar & Name Row */}
      <div className="flex items-center gap-8 mb-8">
        {/* Avatar */}
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center overflow-hidden">
            {avatarPreview || profile?.avatar ? (
              <img
                src={avatarPreview || profile.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-3xl font-bold font-inter">{getInitials()}</span>
            )}
          </div>
          <label
            htmlFor="avatar-upload"
            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
          >
            <Camera className="w-6 h-6 text-white" />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Name Display */}
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold font-inter text-black">
            {profile?.firstName || 'Nguyễn Văn'} {profile?.lastName || 'A'}
          </h3>
          <p className="text-sm text-indigo-500 font-inter">{profile?.email || 'nguyen.van.a@example.com'}</p>
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 w-fit">
            {profile?.role || 'Pro'}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name / Last Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className="text-base font-normal font-inter text-black">
              Họ
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              className={`h-12 px-4 bg-white rounded-lg border-2 ${
                errors.firstName ? 'border-red-400' : 'border-slate-200'
              } text-base font-inter text-black outline-none focus:border-indigo-400 transition-colors`}
              placeholder="Nguyễn Văn"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-base font-normal font-inter text-black">
              Tên
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName')}
              className={`h-12 px-4 bg-white rounded-lg border-2 ${
                errors.lastName ? 'border-red-400' : 'border-slate-200'
              } text-base font-inter text-black outline-none focus:border-indigo-400 transition-colors`}
              placeholder="A"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-base font-normal font-inter text-black">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`h-12 px-4 bg-white rounded-lg border-2 ${
              errors.email ? 'border-red-400' : 'border-slate-200'
            } text-base font-inter text-black outline-none focus:border-indigo-400 transition-colors`}
            placeholder="nguyen.van.a@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Company */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="company" className="text-base font-normal font-inter text-black">
            Công ty
          </label>
          <input
            id="company"
            type="text"
            {...register('company')}
            className="h-12 px-4 bg-white rounded-lg border-2 border-slate-200 text-base font-inter text-black outline-none focus:border-indigo-400 transition-colors"
            placeholder="ABC Technology"
          />
        </div>

        {/* Phone / Timezone Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-base font-normal font-inter text-black">
              Số điện thoại
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className="h-12 px-4 bg-white rounded-lg border-2 border-slate-200 text-base font-inter text-black outline-none focus:border-indigo-400 transition-colors"
              placeholder="+84 987 654 321"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="timezone" className="text-base font-normal font-inter text-black">
              Múi giờ
            </label>
            <select
              id="timezone"
              {...register('timezone')}
              className={`h-12 px-4 bg-slate-100 rounded-lg border-2 ${
                errors.timezone ? 'border-red-400' : 'border-slate-200'
              } text-base font-inter text-black outline-none focus:border-indigo-400 transition-colors cursor-pointer`}
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            {errors.timezone && (
              <p className="text-red-500 text-sm">{errors.timezone.message}</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={saving || (!isDirty && !avatarFile)}
            className="inline-flex items-center gap-2.5 px-10 py-3 bg-indigo-500 text-white text-base font-medium font-inter rounded-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default memo(PersonalInfo);
