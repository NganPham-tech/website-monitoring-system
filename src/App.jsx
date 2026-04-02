import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthLayout from './components/layouts/AuthLayout';
import Login from './components/auth/Login';

// Protected Route Component (Placeholder)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

// Simple Dashboard Placeholder
const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Chào mừng, {user?.email}!</p>
      <button 
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Đăng xuất
      </button>
    </div>
  );
};

// Simple Landing/Home Placeholder
const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-primary mb-6">Uptime Monitor</h1>
      <div className="space-x-4">
        <Navigate to="/login" replace />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        } />
        
        {/* Registration & Forgot Password Placeholders */}
        <Route path="/register" element={
          <AuthLayout>
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-4">Trang Đăng ký</h2>
              <p className="mb-6">Tính năng này đang được phát triển.</p>
              <Navigate to="/login" replace className="text-primary font-bold hover:underline" />
              <button onClick={() => window.history.back()} className="text-primary font-bold hover:underline">Quay lại</button>
            </div>
          </AuthLayout>
        } />

        <Route path="/forgot-password" element={
          <AuthLayout>
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-4">Quên mật khẩu</h2>
              <p className="mb-6">Vui lòng liên hệ quản trị viên.</p>
              <button onClick={() => window.history.back()} className="text-primary font-bold hover:underline">Quay lại</button>
            </div>
          </AuthLayout>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
