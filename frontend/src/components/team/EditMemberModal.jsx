import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMember } from '../../services/teamService';

/**
 * EditMemberModal
 * Props:
 *   member   {object|null}  — member to edit; modal closed when null
 *   onClose  {() => void}
 */
const EditMemberModal = ({ member, onClose }) => {
    const [role, setRole] = useState(member?.role ?? 'member');
    const queryClient = useQueryClient();

    // Sync role when member changes
    useEffect(() => {
        if (member) setRole(member.role ?? 'member');
    }, [member]);

    const { mutate, isPending } = useMutation({
        mutationFn: updateMember,
        onSuccess: () => {
            toast.success('Đã cập nhật vai trò!');
            queryClient.invalidateQueries({ queryKey: ['team-members'] });
            onClose();
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại!');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!member) return;
        mutate({ id: member.id, role });
    };

    if (!member) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col gap-5 p-6">
                {/* Title */}
                <div className="flex items-center justify-between">
                    <h2 className="text-gray-800 text-2xl font-bold font-['Segoe_UI']">Chỉnh sửa thành viên</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Name (read-only) */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-700 text-sm font-semibold">Tên thành viên</label>
                        <div className="h-11 px-4 flex items-center rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-500 select-none">
                            {member.name}
                        </div>
                    </div>

                    {/* Email (read-only) */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-700 text-sm font-semibold">Email</label>
                        <div className="h-11 px-4 flex items-center rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-500 select-none">
                            {member.email}
                        </div>
                    </div>

                    {/* Role */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-700 text-sm font-semibold">Vai trò</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="h-11 px-4 rounded-md border border-gray-300 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-gray-700 transition bg-white"
                        >
                            <option value="admin">Admin</option>
                            <option value="member">Member</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 px-5 rounded-md border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="h-11 px-6 bg-teal-500 text-white rounded-md text-sm font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default EditMemberModal;
