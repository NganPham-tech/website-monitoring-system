import React from 'react';
import { 
  StatCards, 
  UserTable, 
  SystemConfigForm, 
  HealthCharts, 
  LogTerminal 
} from '../components/admin';

const AdminDashboard = () => {
  return (
    <div className="max-w-[1600px] mx-auto pb-10">
      {/* Page Title */}
      <h1 className="text-4xl font-semibold font-inter text-black mb-8 text-center pt-2">
        Admin Panel
      </h1>

      {/* Quick Metrics */}
      <StatCards />

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-8">
        {/* Left Column: User Table */}
        <div className="xl:col-span-12">
          <UserTable />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Configuration */}
        <div className="xl:col-span-6">
          <SystemConfigForm />
        </div>

        {/* Right Column: Server Health */}
        <div className="xl:col-span-6">
          <HealthCharts />
        </div>
      </div>

      {/* Bottom Area: Terminal Logs */}
      <LogTerminal />
    </div>
  );
};

export default AdminDashboard;
