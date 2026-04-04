import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../services/adminService';

// Hooks for quick stats
export const useAdminStats = () => {
  return useQuery({
    queryKey: ['adminStats'],
    queryFn: adminService.getQuickStats,
  });
};

// Hooks for server health
export const useServerHealth = (refetchInterval = 5000) => {
  return useQuery({
    queryKey: ['serverHealth'],
    queryFn: adminService.getServerHealth,
    refetchInterval, // Real-time polling every 5s
  });
};

// Hooks for User Management
export const useAdminUsers = (page, limit, search) => {
  return useQuery({
    queryKey: ['adminUsers', page, limit, search],
    queryFn: () => adminService.getUsers(page, limit, search),
    keepPreviousData: true,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, data }) => adminService.updateUserRole(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });
};

// Hooks for System Config
export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['systemSettings'],
    queryFn: adminService.getSystemSettings,
  });
};

export const useUpdateSystemSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings) => adminService.updateSystemSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemSettings'] });
    },
  });
};

// Hooks for System Logs
export const useSystemLogs = () => {
  return useQuery({
    queryKey: ['systemLogs'],
    queryFn: () => adminService.getSystemLogs(100),
  });
};

export const useClearSystemLogs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminService.clearSystemLogs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemLogs'] });
    },
  });
};
