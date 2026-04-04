import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRouteGuard = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a global loading spinner

  if (!user || user.role !== 'admin') {
    // Optionally trigger a toast or just silently redirect
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default AdminRouteGuard;
