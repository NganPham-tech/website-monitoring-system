import React, { useState, memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  Crown, Activity, Clock, Users, ArrowUpRight,
  AlertTriangle, Trash2, Loader2, X,
} from 'lucide-react';
import { deleteAccountSchema } from '../../schemas/profileSchema';
import profileService from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const {
    register, handleSubmit, reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { confirmation: '' },
  });

  const onSubmit = async (data) => {
    setDeleting(true);
    try {
      await profileService.deleteAccount(data.confirmation);
      toast.success('Tài khoản đã được xóa');
      logout();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa tài khoản');
    } finally {
      setDeleting(false);
    }
  };

  const handleClose = () => { reset(); onClose(); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 animate-fade-in-scale z-10">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-inter text-black">Xóa tài khoản</h3>
            <p className="text-sm text-red-500 font-inter">Hành động này không thể hoàn tác</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-700 font-inter">
            Khi bạn xóa tài khoản, tất cả dữ liệu sẽ bị xóa vĩnh viễn bao gồm:
          </p>
          <ul className="text-sm text-red-600 font-inter mt-2 space-y-1 list-disc list-inside">
            <li>Tất cả monitors và lịch sử uptime</li>
            <li>Cài đặt cảnh báo và thông báo</li>
            <li>API keys và tích hợp</li>
            <li>Dữ liệu team và thành viên</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-sm font-medium text-gray-700 font-inter mb-2">
            Nhập <span className="font-bold text-red-600">CONFIRM</span> để xác nhận:
          </label>
          <input
            type="text" {...register('confirmation')} placeholder="Nhập CONFIRM"
            className={`w-full h-12 px-4 bg-white rounded-xl border-2 ${errors.confirmation ? 'border-red-400' : 'border-gray-200'} text-base font-inter outline-none focus:border-red-400 transition-colors mb-1`}
            autoFocus
          />
          {errors.confirmation && <p className="text-red-500 text-sm mb-2">{errors.confirmation.message}</p>}
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={handleClose} className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium font-inter rounded-xl hover:bg-gray-200 transition-colors">Hủy</button>
            <button type="submit" disabled={deleting} className="flex-1 py-3 bg-red-500 text-white font-bold font-inter rounded-xl hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {deleting ? <><Loader2 className="w-4 h-4 animate-spin" />Đang xóa...</> : <><Trash2 className="w-4 h-4" />Xóa tài khoản</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BillingPlan = ({ billing }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const plan = billing || { name: 'Pro Plan', monitors: 50, interval: '30s', teamMembers: 10 };

  return (
    <>
      <div className="bg-white rounded-xl p-8 shadow-sm" id="billing-plan-section">
        <h2 className="text-xl font-bold font-inter text-gray-700 mb-2">Gói dịch vụ</h2>
        <div className="h-0.5 bg-zinc-300 mb-6" />

        <div className="inline-flex items-center gap-3 bg-zinc-200 rounded-lg px-6 py-4 mb-5">
          <Crown className="w-6 h-6 text-amber-500" />
          <span className="text-xl font-bold font-inter text-black">{plan.name}</span>
        </div>

        <div className="mb-6">
          <button onClick={() => navigate('/pricing')}
            className="inline-flex items-center gap-2.5 px-10 py-3.5 bg-indigo-500 text-white text-xl font-bold font-inter rounded-md hover:bg-indigo-600 transition-all duration-200 shadow-sm hover:shadow-md">
            Nâng cấp <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-16 mb-8">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-normal font-inter text-indigo-500">{plan.monitors} Monitors</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-normal font-inter text-indigo-500">{plan.interval} Min interval</span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-indigo-400" />
            <span className="text-xl font-normal font-inter text-indigo-500">{plan.teamMembers} Team members</span>
          </div>
        </div>

        <div className="bg-zinc-200 border border-black/10 rounded-lg shadow-md p-6">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <p className="text-lg font-normal font-inter text-red-500">
              Hành động này không thể hoàn tác, vui lòng cân nhắc kỹ trước khi thực hiện
            </p>
          </div>
          <button onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-2.5 px-10 py-2 bg-red-500 text-white text-lg font-normal font-inter rounded-md hover:bg-red-600 transition-all duration-200 shadow-sm">
            <Trash2 className="w-4 h-4" /> Xóa tài khoản
          </button>
        </div>
      </div>
      <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
    </>
  );
};

export default memo(BillingPlan);
