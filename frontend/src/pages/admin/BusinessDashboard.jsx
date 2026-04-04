import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Users, Settings, LogOut, ShieldCheck } from 'lucide-react';

import UserTab from '../../components/admin/business/UserTab';
import TransactionTab from '../../components/admin/business/TransactionTab';
import PlanConfigTab from '../../components/admin/business/PlanConfigTab';

const TABS = [
  { id: 'users', label: '👥 Danh sách Users', component: UserTab },
  { id: 'payments', label: '💳 Lịch sử Giao dịch', component: TransactionTab },
  { id: 'plans', label: '🏷️ Cấu hình Gói cước', component: PlanConfigTab }
];

export default function BusinessDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabId = searchParams.get('tab') || 'users';

  const switchTab = (id) => {
    setSearchParams({ tab: id });
  };

  const ActiveComponent = TABS.find(t => t.id === activeTabId)?.component || UserTab;

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-[260px] bg-slate-900 text-white p-6 fixed h-screen overflow-y-auto border-r-4 border-teal-400">
        <div className="flex items-center gap-2 text-2xl font-bold text-teal-400 mb-8">
          <ShieldCheck size={32} />
          <span>Uptime Admin</span>
        </div>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-lg transition-colors hover:bg-slate-800 hover:text-white font-medium">
                <LayoutDashboard size={20} />
                Tổng quan & Hạ tầng
              </a>
            </li>
            <li>
              <a href="/admin/business" className="flex items-center gap-3 px-4 py-3 bg-teal-400 text-slate-900 rounded-lg font-bold">
                <Users size={20} />
                Khách hàng & Doanh thu
              </a>
            </li>
            <li>
              <a href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 rounded-lg transition-colors hover:bg-slate-800 hover:text-white font-medium">
                <Settings size={20} />
                Cấu hình Hệ thống
              </a>
            </li>
          </ul>
          
          <div className="h-px bg-slate-700 my-6"></div>
          
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-red-400 rounded-lg transition-colors hover:bg-slate-800 font-medium">
                <LogOut size={20} />
                Thoát về User Mode
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-[260px] flex-1 p-8 flex flex-col gap-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Quản lý Khách hàng & Doanh thu</h1>
          
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm">
            <div className="text-right">
              <div className="font-semibold text-slate-800 text-sm">Super Admin</div>
              <div className="text-xs text-slate-500">admin@uptime.com</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-teal-400 flex items-center justify-center text-slate-900 font-bold text-lg">
              A
            </div>
          </div>
        </header>

        {/* Tabs Header */}
        <div className="flex gap-2 border-b-2 border-slate-200 mb-2">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={cn(
                "px-6 py-4 text-[1.05rem] font-semibold transition-all flex items-center gap-2 border-b-4 -mb-[2px]",
                activeTabId === tab.id 
                  ? "text-teal-700 border-teal-400 bg-teal-50/50 rounded-t-lg" 
                  : "text-slate-500 border-transparent hover:text-teal-600 hover:bg-slate-50 rounded-t-lg"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
