import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './components/layouts/AuthLayout';
import DashboardLayout from './components/layouts/DashboardLayout';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import MonitorListPage from './pages/MonitorListPage';
import AddMonitor from './pages/AddMonitor';
import MonitorDetail from './pages/MonitorDetail';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import IncidentDetail from './pages/IncidentDetail';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';
import StatusPage from './pages/StatusPage';
import { AdminRouteGuard } from './components/admin';
import BusinessDashboard from './pages/admin/BusinessDashboard';
import AnalyticsReport from './pages/AnalyticsReport';
import TeamPage from './pages/TeamPage';
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/status" element={<StatusPage />} />

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

        <Route path="/admin/business" element={<BusinessDashboard />} />

        {/* Group Dashboard Routes with Shared Sidebar Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/monitors" element={<MonitorListPage />} />
          <Route path="/monitors/add" element={<AddMonitor />} />
          <Route path="/monitors/:id" element={<MonitorDetail />} />
          {/* Các trang khác của Dashboard có thể thêm vào đây */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
          <Route path="/alerts" element={<div className="p-10 text-center text-4xl font-bold text-[#00796B]">Trang Cảnh báo</div>} />
          <Route path="/reports" element={<AnalyticsReport />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/settings" element={<ProfilePage />} />
          <Route path="/admin" element={
            <AdminRouteGuard>
              <AdminDashboard />
            </AdminRouteGuard>
          } />
          <Route path="/admin/settings" element={
            <AdminRouteGuard>
              <AdminSettings />
            </AdminRouteGuard>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
