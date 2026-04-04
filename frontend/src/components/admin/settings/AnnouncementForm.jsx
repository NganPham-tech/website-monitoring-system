import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Loader2, Send } from 'lucide-react';
import settingsService from '../../../services/settingsService';
import RichTextEditor from './RichTextEditor';

const AnnouncementForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const mutCreate = useMutation({
    mutationFn: settingsService.createAnnouncement,
    onSuccess: () => {
      toast.success('Đăng thông báo thành công!');
      reset();
      setContent('');
      queryClient.invalidateQueries(['announcements']);
    },
    onError: () => toast.error('Có lỗi xảy ra khi tạo thông báo.')
  });

  const onSubmit = (data) => {
    if (!content || content === '<p><br></p>') {
      return toast.warn('Bạn chưa nhập nội dung thông báo!');
    }
    mutCreate.mutate({ ...data, content });
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm h-full">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Soạn Thông báo Mới</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-slate-700 text-sm">Tiêu đề thông báo</label>
          <input 
            type="text" 
            {...register('title', { required: true })}
            placeholder="VD: Bảo trì hạ tầng Asia Node vào cuối tuần"
            className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-semibold text-slate-700 text-sm">Đối tượng nhận</label>
            <select 
              {...register('target')}
              className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400"
            >
              <option value="all">Tất cả người dùng (All Users)</option>
              <option value="pro_ent">Chỉ gói PRO & Enterprise</option>
              <option value="free">Chỉ gói Free</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-semibold text-slate-700 text-sm">Loại thông báo</label>
            <select 
              {...register('type')}
              className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-teal-400/20 focus:border-teal-400"
            >
              <option value="info">Thông tin (Info / Xanh dương)</option>
              <option value="warning">Cảnh báo (Warning / Vàng)</option>
              <option value="critical">Quan trọng (Critical / Đỏ)</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold text-slate-700 text-sm">Nội dung</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="flex items-center justify-between mt-6">
          <label className="flex items-center gap-2 text-slate-700 text-sm font-semibold cursor-pointer">
            <input type="checkbox" defaultChecked {...register('sendEmail')} className="w-4 h-4 text-teal-600 rounded cursor-pointer" />
            Gửi kèm email
          </label>
          <button 
            type="submit" 
            disabled={mutCreate.isLoading}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-6 rounded-md transition flex items-center justify-center disabled:opacity-50 gap-2"
          >
            {mutCreate.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />} Đăng Thông báo
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementForm;
