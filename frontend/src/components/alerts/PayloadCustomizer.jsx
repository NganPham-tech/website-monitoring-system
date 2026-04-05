import { useFormContext, Controller } from 'react-hook-form';
import usePreviewParser from '../../hooks/usePreviewParser';
import { Mail } from 'lucide-react';

export default function PayloadCustomizer() {
  const { control, watch } = useFormContext();
  
  const titleTemplate = watch('customPayload.title');
  const bodyTemplate = watch('customPayload.body');

  const previewTitle = usePreviewParser(titleTemplate);
  const previewBody = usePreviewParser(bodyTemplate);

  return (
    <div className="bg-white rounded-lg shadow p-8 mb-8 border border-slate-100 flex flex-col xl:flex-row gap-8">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-black uppercase mb-6 tracking-wide border-b pb-3">Tùy Chỉnh Nội Dung Cảnh Báo</h2>
        
        <p className="text-sm text-gray-500 mb-6 font-['Inter']">
          Sử dụng các biến động: <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">{'{name}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">{'{status}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">{'{time}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600">{'{url}'}</code>
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-md font-medium text-black mb-2 font-['Inter']">Tiêu đề cảnh báo</label>
            <Controller
              name="customPayload.title"
              control={control}
              render={({ field }) => (
                <textarea 
                  {...field} 
                  rows={2}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none resize-none font-['Inter']"
                  placeholder="{name} đang gặp sự cố"
                />
              )}
            />
          </div>
          
          <div>
            <label className="block text-md font-medium text-black mb-2 font-['Inter']">Nội dung cảnh báo</label>
            <Controller
               name="customPayload.body"
               control={control}
               render={({ field }) => (
                <textarea 
                  {...field} 
                  rows={6}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-md focus:ring-teal-500 focus:border-teal-500 outline-none resize-none font-['Inter']"
                  placeholder="Website {url} không thể truy cập.&#10;Status: {status}&#10;Thời gian: {time}"
                />
               )}
            />
          </div>
        </div>
      </div>

      {/* Live Preview Boundary */}
      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-6 font-['Inter'] flex flex-col">
        <h3 className="text-lg font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
           <Mail className="w-5 h-5"/> XEM TRƯỚC
        </h3>
        
        <div className="bg-white rounded-md p-6 shadow-sm border border-gray-100 flex-1 flex flex-col">
          <div className="text-xl font-bold text-black mb-4 break-words">
            {previewTitle || 'Tiêu đề sẽ hiển thị ở đây...'}
          </div>
          <div className="text-sm font-normal text-gray-700 whitespace-pre-wrap flex-1 break-words leading-relaxed">
            {previewBody || 'Nội dung thông báo sẽ hiển thị ở đây...'}
          </div>
        </div>
      </div>
    </div>
  );
}
