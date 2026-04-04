import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inviteMember } from '../../services/teamService';

/**
 * InviteMemberModal
 * Props:
 *   isOpen   {boolean}
 *   onClose  {() => void}
 */
const InviteMemberModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: inviteMember,
        onSuccess: () => {
            toast.success('Đã gửi lời mời!');
            queryClient.invalidateQueries({ queryKey: ['team-stats'] });
            queryClient.invalidateQueries({ queryKey: ['team-members'] });
            setEmail('');
            setRole('member');
            onClose();
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Gửi lời mời thất bại. Vui lòng thử lại!');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('Vui lòng nhập email.');
            return;
        }
        mutate({ email: email.trim(), role });
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col gap-5 p-6">
                {/* Title */}
                <div className="flex items-center justify-between">
                    <h2 className="text-gray-800 text-2xl font-bold font-['Segoe_UI']">Mời thành viên</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Email field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-gray-700 text-sm font-semibold">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                            className="h-11 px-4 rounded-md border border-gray-300 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm text-gray-700 transition"
                            autoFocus
                            required
                        />
                    </div>

                    {/* Role field */}
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
                            {isPending ? 'Đang gửi...' : 'Gửi lời mời'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default InviteMemberModal;
