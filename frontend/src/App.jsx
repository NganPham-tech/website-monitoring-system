import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import MonitorListPage from './pages/MonitorListPage';
import AddMonitor from './pages/AddMonitor';

const Home = () => <div className="p-10 text-center"><h1 className="text-2xl font-bold">Trang Chủ (Mẫu)</h1><a href="/login" className="text-blue-500 hover:underline">Đăng nhập</a></div>;

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        } />
        
        <Route path="/register" element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        } />
        
        {/* Group Dashboard Routes with Shared Sidebar Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/monitors" element={<MonitorListPage />} />
          <Route path="/monitors/add" element={<AddMonitor />} />
          <Route path="/monitors/:id" element={<div className="p-10 text-center text-4xl font-bold text-[#00796B]">Chi tiết Monitor!</div>} />
          {/* Các trang khác của Dashboard có thể thêm vào đây */}
          <Route path="/dashboard" element={<Navigate to="/monitors" replace />} />
          <Route path="/alerts" element={<div className="p-10 text-center text-4xl font-bold text-[#00796B]">Trang Cảnh báo</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
