import React, { useState } from 'react';
import { IntegrationsForm, AnnouncementForm, AnnouncementHistory } from '../components/admin/settings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('system'); // 'system' or 'announcements'

  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      {/* Header Block Matches HTML */}
      <div className="flex justify-between items-center mb-10 pt-2">
        <h1 className="text-3xl font-semibold font-inter text-slate-800">
          Cấu hình Lõi & Truyền thông
        </h1>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <div className="text-right">
            <div className="font-bold text-sm text-slate-800">Super Admin</div>
            <div className="text-xs text-slate-500">quang@uptime.com</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-teal-400 flex items-center justify-center font-bold text-slate-900">
            Q
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex gap-4 border-b-2 border-slate-200 mb-8">
        <button 
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-[1.05rem] transition border-b-4 ${activeTab === 'system' ? 'text-teal-600 border-teal-400' : 'text-slate-500 border-transparent hover:text-teal-600'}`}
        >
          🛠️ Cấu hình API / Tích hợp
        </button>
        <button 
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-6 py-4 font-semibold text-[1.05rem] transition border-b-4 ${activeTab === 'announcements' ? 'text-teal-600 border-teal-400' : 'text-slate-500 border-transparent hover:text-teal-600'}`}
        >
          📢 Đăng Thông báo (Announcements)
        </button>
      </div>

      {/* Tabs Content */}
      <div className="transition-opacity duration-300">
        {activeTab === 'system' && (
          <div className="animate-fade-in-up">
            <IntegrationsForm />
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-8 animate-fade-in-up">
            <AnnouncementForm />
            <AnnouncementHistory />
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
