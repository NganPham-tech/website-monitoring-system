import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './components/layouts/AuthLayout';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

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
        
        {/* Dummy dashboard for login to redirect to */}
        <Route path="/dashboard" element={<div className="p-10 text-center text-4xl">Dashboard!</div>} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
