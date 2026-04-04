import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessService } from '../../../api/businessService';
import { TableSkeleton } from '../../ui/Skeleton';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';

export default function UserTab() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers', searchTerm, planFilter, statusFilter],
    queryFn: () => businessService.fetchUsers({ search: searchTerm, plan: planFilter, status: statusFilter }),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, action }) => businessService.toggleUserStatus(id, action),
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries(['adminUsers']);
    },
    onError: () => toast.error('Đã có lỗi xảy ra.')
  });

  const impersonateMutation = useMutation({
    mutationFn: (id) => businessService.impersonateUser(id),
    onSuccess: (data) => {
      toast.success('Mạo danh thành công, đang chuyển hướng...');
      localStorage.setItem('token', data.access_token);
      setTimeout(() => {
        window.location.href = data.redirectUrl || '/dashboard';
      }, 1000);
    },
    onError: () => toast.error('Không thể mạo danh vào lúc này.')
  });

  const handleToggleStatus = (user) => {
    const action = user.status === 'Active' ? 'ban' : 'unban';
    if (window.confirm(`Bạn có chắc chắn muốn ${action === 'ban' ? 'khóa' : 'mở khóa'} user ${user.email}?`)) {
      toggleStatusMutation.mutate({ id: user.id, action });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
      {/* Toolbar */}
      <div className="p-5 flex flex-col md:flex-row justify-between items-center border-b border-slate-100 bg-slate-50 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo Tên, Email hoặc Keycloak ID..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm cursor-pointer outline-none focus:border-teal-500"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="all">Tất cả gói cước</option>
            <option value="free">Gói Free</option>
            <option value="pro">Gói PRO</option>
            <option value="enterprise">Gói Enterprise</option>
          </select>
          <select 
            className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm cursor-pointer outline-none focus:border-teal-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <TableSkeleton cols={6} rows={5} />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="py-4 px-6">Người dùng</th>
                <th className="py-4 px-6">Gói cước</th>
                <th className="py-4 px-6">Monitors</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6">Ngày tham gia</th>
                <th className="py-4 px-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users?.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                        style={{ backgroundColor: user.bg, color: user.color }}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                        <span className="text-xs font-mono text-slate-400 block mt-0.5">KC_ID: {user.keycloakId}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block
                      ${user.plan === 'Enterprise' ? 'bg-purple-50 text-purple-700 border border-purple-100' : ''}
                      ${user.plan === 'PRO' ? 'bg-blue-50 text-blue-700 border border-blue-100' : ''}
                      ${user.plan === 'Free' ? 'bg-slate-100 text-slate-600' : ''}
                    `}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-600">
                    <span className="text-slate-900 font-semibold">{user.currentMonitors}</span> <span className="text-slate-400">/ {user.maxMonitors}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block
                      ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}
                    `}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 text-sm">{user.joinDate}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2 text-sm">
                      <button 
                        onClick={() => impersonateMutation.mutate(user.id)}
                        disabled={impersonateMutation.isPending}
                        className="px-3 py-1.5 border border-slate-200 rounded-md text-blue-600 hover:bg-blue-50 hover:border-blue-300 font-medium transition-colors disabled:opacity-50"
                      >
                        👁️ Mạo danh
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={toggleStatusMutation.isPending}
                        className={`px-3 py-1.5 border border-slate-200 rounded-md font-medium transition-colors disabled:opacity-50
                          ${user.status === 'Active' ? 'text-red-600 hover:bg-red-50 hover:border-red-300' : 'text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300'}  
                        `}
                      >
                        {user.status === 'Active' ? 'Khóa' : 'Mở khóa'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    Không tìm thấy dữ liệu phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
