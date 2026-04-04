import React from 'react';
import ReactDOM from 'react-dom';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeMember } from '../../services/teamService';

/**
 * DeleteConfirmModal
 * Props:
 *   member   {object|null}  — member to delete; modal closed when null
 *   onClose  {() => void}
 */
const DeleteConfirmModal = ({ member, onClose }) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => removeMember(member.id),
        onSuccess: () => {
            toast.success('Đã xóa thành viên!');
            queryClient.invalidateQueries({ queryKey: ['team-members'] });
            queryClient.invalidateQueries({ queryKey: ['team-stats'] });
            onClose();
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Xóa thành viên thất bại. Vui lòng thử lại!');
        },
    });

    if (!member) return null;

    return ReactDOM.createPortal(
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col gap-5 p-6">
                {/* Icon + Title */}
                <div className="flex flex-col items-center gap-3 pt-2">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h2 className="text-gray-800 text-xl font-bold font-['Segoe_UI'] text-center">
                        Xác nhận xóa thành viên
                    </h2>
                    <p className="text-gray-500 text-sm text-center">
                        Bạn có chắc muốn xóa{' '}
                        <span className="font-semibold text-gray-700">{member.name}</span>{' '}
                        khỏi team? Hành động này không thể hoàn tác.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3 pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="h-11 px-6 rounded-md border border-gray-300 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={() => mutate()}
                        disabled={isPending}
                        className="h-11 px-6 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? 'Đang xóa...' : 'Xóa thành viên'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DeleteConfirmModal;
