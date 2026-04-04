import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  PersonalInfo,
  SecuritySettings,
  NotificationSettings,
  ApiKeyManager,
  BillingPlan,
  ProfileSkeleton,
} from '../components/profile';
import profileService from '../services/profileService';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [billingInfo, setBillingInfo] = useState(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, notifRes, keysRes, billingRes] = await Promise.allSettled([
        profileService.getProfile(),
        profileService.getNotificationSettings(),
        profileService.getApiKeys(),
        profileService.getBillingInfo(),
      ]);

      if (profileRes.status === 'fulfilled') setProfileData(profileRes.value.data);
      if (notifRes.status === 'fulfilled') setNotificationSettings(notifRes.value.data);
      if (keysRes.status === 'fulfilled') setApiKeys(keysRes.value.data);
      if (billingRes.status === 'fulfilled') setBillingInfo(billingRes.value.data);
    } catch {
      toast.error('Không thể tải dữ liệu trang cài đặt');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleProfileUpdate = useCallback((updatedProfile) => {
    setProfileData(updatedProfile);
  }, []);

  const handleNotifUpdate = useCallback((updatedSettings) => {
    setNotificationSettings(updatedSettings);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold font-inter text-black mb-8 text-center">
        Cài đặt tài khoản
      </h1>

      {loading ? (
        <ProfileSkeleton />
      ) : (
        <div className="space-y-8">
          <PersonalInfo
            profile={profileData}
            onProfileUpdate={handleProfileUpdate}
          />
          <SecuritySettings />
          <NotificationSettings
            settings={notificationSettings}
            onSettingsUpdate={handleNotifUpdate}
          />
          <ApiKeyManager apiKeys={apiKeys} />
          <BillingPlan billing={billingInfo} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
