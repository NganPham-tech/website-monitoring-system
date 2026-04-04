import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex bg-[#F1F8F7] min-h-screen">
      {/* Sidebar cố định cho toàn bộ Dashboard */}
      <Sidebar />

      {/* Phần nội dung thay đổi theo Route */}
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
