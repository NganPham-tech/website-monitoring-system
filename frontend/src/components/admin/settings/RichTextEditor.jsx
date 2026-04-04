import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange }) => {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white mb-4">
      {/* Quill handles toolbar automatically via CSS and custom Toolbar logic injected above */}
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange}
        modules={modules}
        className="h-[250px] font-inter text-base border-none"
        placeholder="Nhập nội dung thông báo... Định dạng HTML được hỗ trợ."
      />
      <style>{`
        .ql-toolbar.ql-snow { border: none; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
        .ql-container.ql-snow { border: none; font-family: 'Inter', sans-serif; height: 250px; }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
