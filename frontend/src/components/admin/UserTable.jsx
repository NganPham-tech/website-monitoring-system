import React, { useState, memo } from 'react';
import { Eye, Edit2, Loader2, X } from 'lucide-react';
import { useAdminUsers, useUpdateUserRole } from '../../hooks/useAdmin';
import { toast } from 'react-toastify';

// Table Header Constants matching HTML
const TABLE_HEADERS = ['Người dùng', 'Email', 'Vai trò', 'Gói', 'Monitors', 'Trạng thái', 'Tham gia', 'Hành động'];

const ModalOverlay = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-fade-in-scale">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold font-inter text-black mb-6">{title}</h3>
        {children}
      </div>
    </div>
  );
};

const UserTable = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const { data, isLoading } = useAdminUsers(page, 10, search);
  const updateRoleMutation = useUpdateUserRole();

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      role: formData.get('role'),
      plan: formData.get('plan'),
      isActive: formData.get('status') === 'active',
    };

    updateRoleMutation.mutate(
      { userId: editUser._id, data: updates },
      {
        onSuccess: () => {
          toast.success('Cập nhật user thành công');
          setEditUser(null);
        },
        onError: () => toast.error('Cập nhật thất bại'),
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 w-full min-h-[400px]">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold font-inter text-slate-900">Quản lý người dùng</h2>
        <input 
          type="text" 
          placeholder="Tìm email/tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 outline-none w-64"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-inter">
          <thead>
            <tr className="border-b border-gray-100">
              {TABLE_HEADERS.map((h, i) => (
                <th key={i} className="pb-4 text-base font-semibold text-black text-center whitespace-nowrap px-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={8} className="py-6"><div className="h-6 bg-gray-100 rounded w-full"></div></td>
                </tr>
              ))
            ) : data?.users?.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-500">Không tìm thấy user nào</td></tr>
            ) : (
              data?.users?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-5 text-center text-base font-semibold text-black px-4 whitespace-nowrap">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="text-center text-base font-semibold text-black px-4">{user.email}</td>
                  <td className="text-center text-base font-semibold text-black px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="text-center text-base font-semibold text-black px-4">{user.plan || 'Free'}</td>
                  <td className="text-center text-base font-semibold text-black px-4">{user.monitorCount || 0}</td>
                  <td className="text-center text-base font-semibold text-black px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.isActive ? 'Active' : 'Banned'}
                    </span>
                  </td>
                  <td className="text-center text-base font-semibold text-black px-4">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="text-center px-4">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => setViewUser(user)} className="w-8 h-8 flex justify-center items-center bg-white rounded outline outline-1 outline-slate-200 hover:bg-slate-50 relative group">
                        <Eye className="w-4 h-4 text-gray-700" />
                        <span className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">Chi tiết</span>
                      </button>
                      <button onClick={() => setEditUser(user)} className="w-10 h-8 flex justify-center items-center bg-white rounded outline outline-1 outline-slate-200 hover:bg-slate-50 relative group">
                        <Edit2 className="w-4 h-4 text-gray-700" />
                        <span className="absolute -top-8 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">Sửa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination (Simple) */}
      <div className="mt-8 flex justify-end gap-2">
        <button disabled={page === 1} onClick={() => setPage(p=>p-1)} className="px-4 py-2 border rounded disabled:opacity-50">Trước</button>
        <button disabled={!data?.hasMore} onClick={() => setPage(p=>p+1)} className="px-4 py-2 border rounded disabled:opacity-50">Sau</button>
      </div>

      {/* Edit Modal */}
      <ModalOverlay isOpen={!!editUser} onClose={() => setEditUser(null)} title="Cập nhật quyền hạn">
        {editUser && (
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="text" readOnly value={editUser.email} className="w-full border p-2 rounded bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vai trò</label>
              <select name="role" defaultValue={editUser.role} className="w-full border p-2 rounded">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gói cước</label>
              <select name="plan" defaultValue={editUser.plan} className="w-full border p-2 rounded">
                <option value="Miễn phí - 5 Monitors">Miễn phí (Free)</option>
                <option value="Cơ bản - 50 Monitors">Cơ bản (Pro)</option>
                <option value="Nâng cao - 200 Monitors">Nâng cao (Enterprise)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <select name="status" defaultValue={editUser.isActive ? 'active' : 'banned'} className="w-full border p-2 rounded">
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </div>
            <button type="submit" disabled={updateRoleMutation.isLoading} className="w-full bg-teal-500 text-white font-bold py-3 pt-3.5 rounded-lg flex justify-center mt-4">
              {updateRoleMutation.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu cập nhật'}
            </button>
          </form>
        )}
      </ModalOverlay>

      {/* View Modal */}
      <ModalOverlay isOpen={!!viewUser} onClose={() => setViewUser(null)} title="Thông tin chi tiết">
        {viewUser && (
          <div className="space-y-3 font-inter">
            <p><strong>Họ tên:</strong> {viewUser.firstName} {viewUser.lastName}</p>
            <p><strong>Email:</strong> {viewUser.email}</p>
            <p><strong>Số điện thoại:</strong> {viewUser.phone || 'N/A'}</p>
            <p><strong>Công ty:</strong> {viewUser.company || 'N/A'}</p>
            <p><strong>Quyền:</strong> <span className="uppercase">{viewUser.role}</span></p>
            <p><strong>Created:</strong> {new Date(viewUser.createdAt).toLocaleString()}</p>
            <p><strong>2FA Enabled:</strong> {viewUser.is2FAEnabled ? 'Yes' : 'No'}</p>
          </div>
        )}
      </ModalOverlay>
    </div>
  );
};

export default memo(UserTable);
