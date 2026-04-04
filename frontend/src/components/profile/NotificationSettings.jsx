import React, { useState, useCallback, memo } from 'react';
import { toast } from 'react-toastify';
import { Mail, MessageCircle, Calendar, CalendarDays, Wrench, Loader2 } from 'lucide-react';
import profileService from '../../services/profileService';

const NOTIFICATION_OPTIONS = [
  {
    key: 'emailAlerts',
    title: 'Nhận thông báo qua email',
    description: 'Cảnh báo qua email',
    icon: Mail,
  },
  {
    key: 'telegramAlerts',
    title: 'Thông báo Telegram',
    description: 'Cảnh báo qua Telegram',
    icon: MessageCircle,
  },
  {
    key: 'weeklyReport',
    title: 'Báo cáo Tuần',
    description: 'Nhận báo cáo tổng kết hàng tuần',
    icon: Calendar,
  },
  {
    key: 'monthlyReport',
    title: 'Báo cáo Tháng',
    description: 'Nhận báo cáo tổng kết hàng tháng',
    icon: CalendarDays,
  },
  {
    key: 'maintenanceAlerts',
    title: 'Thông báo bảo trì',
    description: 'Thông báo về các hoạt động bảo trì hệ thống',
    icon: Wrench,
  },
];

const ToggleSwitch = ({ checked, onChange, disabled, id }) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
      checked ? 'bg-indigo-500' : 'bg-gray-300'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const NotificationSettings = ({ settings, onSettingsUpdate }) => {
  const [localSettings, setLocalSettings] = useState(
    settings || {
      emailAlerts: true,
      telegramAlerts: false,
      weeklyReport: true,
      monthlyReport: false,
      maintenanceAlerts: true,
    }
  );
  const [savingKey, setSavingKey] = useState(null);

  const handleToggle = useCallback(
    async (key, value) => {
      const previousSettings = { ...localSettings };
      const newSettings = { ...localSettings, [key]: value };
      setLocalSettings(newSettings);
      setSavingKey(key);

      try {
        await profileService.updateNotificationSettings(newSettings);
        toast.success('Đã cập nhật cài đặt thông báo');
        if (onSettingsUpdate) onSettingsUpdate(newSettings);
      } catch (error) {
        // Rollback on failure
        setLocalSettings(previousSettings);
        toast.error('Lỗi khi cập nhật cài đặt thông báo');
      } finally {
        setSavingKey(null);
      }
    },
    [localSettings, onSettingsUpdate]
  );

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm" id="notification-settings-section">
      <h2 className="text-2xl font-bold font-inter text-gray-700 mb-8">Thông báo</h2>

      <div className="flex flex-col gap-5">
        {NOTIFICATION_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <div
              key={option.key}
              className="flex items-center justify-between bg-zinc-100 rounded-xl px-7 py-4 transition-all duration-200 hover:bg-zinc-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold font-inter text-black">{option.title}</span>
                  <span className="text-base font-medium font-inter text-slate-500">
                    {option.description}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {savingKey === option.key && (
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                )}
                <ToggleSwitch
                  id={`toggle-${option.key}`}
                  checked={localSettings[option.key]}
                  onChange={(value) => handleToggle(option.key, value)}
                  disabled={savingKey !== null}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(NotificationSettings);
