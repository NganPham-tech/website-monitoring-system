import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  PlusCircle, 
  Bell, 
  AlertTriangle, 
  BarChart3, 
  Zap, 
  Globe, 
  Users, 
  Settings, 
  ShieldCheck 
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Monitor', icon: Activity, path: '/monitors' },
    { name: 'Thêm Monitor', icon: PlusCircle, path: '/monitors/add' },
    { name: 'Cảnh báo', icon: Bell, path: '/alerts' },
    { name: 'Sự cố', icon: AlertTriangle, path: '/incidents' },
    { name: 'Báo cáo', icon: BarChart3, path: '/reports' },
    { name: 'Tích hợp', icon: Zap, path: '/integrations' },
    { name: 'Status Page', icon: Globe, path: '/status-page' },
    { name: 'Team', icon: Users, path: '/team' },
    { name: 'Cài đặt', icon: Settings, path: '/settings' },
    { name: 'Admin', icon: ShieldCheck, path: '/admin' },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col p-6 sticky top-0 h-screen overflow-y-auto">
      {/* Brand Logo */}
      <div className="bg-[#E0F2F1] rounded-xl p-4 mb-10">
        <h1 className="text-[#00897B] font-bold text-xl text-center">Uptime Monitor</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-[#80CBC4] text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} />
            <span className="text-sm font-semibold">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
