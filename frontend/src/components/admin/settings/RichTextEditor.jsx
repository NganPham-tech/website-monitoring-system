import React from 'react';

const RichTextEditor = ({ value, onChange }) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white mb-4">
      {/* Fallback Editor due to missing npm package during test */}
      <div className="bg-slate-50 p-2 border-b border-slate-200 flex gap-2">
        <button type="button" className="px-2 py-1 hover:bg-slate-200 rounded text-slate-600 font-bold">B</button>
        <button type="button" className="px-2 py-1 hover:bg-slate-200 rounded text-slate-600 italic">I</button>
        <button type="button" className="px-2 py-1 hover:bg-slate-200 rounded text-slate-600 underline">U</button>
      </div>
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[210px] p-4 font-inter text-base border-none outline-none resize-none"
        placeholder="Nhập nội dung thông báo... Định dạng HTML được hỗ trợ."
      />
    </div>
  );
};

export default RichTextEditor;
