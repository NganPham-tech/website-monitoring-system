import React from 'react';

const TabsNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'statistics', label: 'Thống kê' },
    { id: 'history', label: 'Lịch sử' },
    { id: 'alerts', label: 'Cảnh báo' },
    { id: 'settings', label: 'Cài đặt' },
  ];

  return (
    <div className="flex border-b border-gray-100 mb-8 gap-10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`pb-4 px-2 text-sm font-bold transition-all relative ${
            activeTab === tab.id 
              ? 'text-[#00BFA5]' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#00BFA5] rounded-t-full"></div>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabsNavigation;
