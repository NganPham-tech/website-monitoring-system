import React, { memo } from 'react';

const SkeletonBlock = ({ className = '' }) => (
  <div className={`skeleton-shimmer rounded-lg ${className}`} />
);

const ProfileSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Personal Info Skeleton */}
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <SkeletonBlock className="h-7 w-48 mb-6" />
      <div className="flex items-center gap-8 mb-8">
        <SkeletonBlock className="w-20 h-20 !rounded-full" />
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-7 w-40" />
          <SkeletonBlock className="h-4 w-56" />
          <SkeletonBlock className="h-6 w-16 !rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div><SkeletonBlock className="h-4 w-12 mb-2" /><SkeletonBlock className="h-12 w-full" /></div>
        <div><SkeletonBlock className="h-4 w-12 mb-2" /><SkeletonBlock className="h-12 w-full" /></div>
      </div>
      <div className="mb-4"><SkeletonBlock className="h-4 w-16 mb-2" /><SkeletonBlock className="h-12 w-full" /></div>
      <div className="mb-4"><SkeletonBlock className="h-4 w-20 mb-2" /><SkeletonBlock className="h-12 w-full" /></div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div><SkeletonBlock className="h-4 w-28 mb-2" /><SkeletonBlock className="h-12 w-full" /></div>
        <div><SkeletonBlock className="h-4 w-20 mb-2" /><SkeletonBlock className="h-12 w-full" /></div>
      </div>
      <SkeletonBlock className="h-11 w-40" />
    </div>

    {/* Security Skeleton */}
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <SkeletonBlock className="h-7 w-28 mb-4" />
      <SkeletonBlock className="h-0.5 w-full mb-6" />
      <div className="space-y-5 mb-6">
        <SkeletonBlock className="h-14 w-full !rounded-xl" />
        <SkeletonBlock className="h-14 w-full !rounded-xl" />
        <SkeletonBlock className="h-14 w-full !rounded-xl" />
      </div>
      <SkeletonBlock className="h-10 w-36 !rounded-xl" />
    </div>

    {/* Notifications Skeleton */}
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <SkeletonBlock className="h-7 w-32 mb-8" />
      <div className="space-y-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between bg-zinc-50 rounded-xl px-7 py-4">
            <div className="flex items-center gap-4">
              <SkeletonBlock className="w-10 h-10" />
              <div className="flex flex-col gap-1">
                <SkeletonBlock className="h-5 w-48" />
                <SkeletonBlock className="h-4 w-32" />
              </div>
            </div>
            <SkeletonBlock className="h-7 w-12 !rounded-full" />
          </div>
        ))}
      </div>
    </div>

    {/* API Key Skeleton */}
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <SkeletonBlock className="h-7 w-24 mb-4" />
      <SkeletonBlock className="h-0.5 w-full mb-4" />
      <SkeletonBlock className="h-5 w-96 mb-8" />
      <div className="space-y-4 mb-6">
        <SkeletonBlock className="h-20 w-full" />
        <SkeletonBlock className="h-20 w-full" />
      </div>
      <SkeletonBlock className="h-11 w-44 mb-6" />
      <SkeletonBlock className="h-16 w-full" />
    </div>

    {/* Billing Skeleton */}
    <div className="bg-white rounded-xl p-8 shadow-sm">
      <SkeletonBlock className="h-6 w-28 mb-2" />
      <SkeletonBlock className="h-0.5 w-full mb-6" />
      <SkeletonBlock className="h-14 w-40 mb-5" />
      <SkeletonBlock className="h-12 w-36 mb-6" />
      <div className="flex gap-16 mb-8">
        <SkeletonBlock className="h-6 w-36" />
        <SkeletonBlock className="h-6 w-40" />
        <SkeletonBlock className="h-6 w-40" />
      </div>
      <SkeletonBlock className="h-32 w-full" />
    </div>
  </div>
);

export default memo(ProfileSkeleton);
