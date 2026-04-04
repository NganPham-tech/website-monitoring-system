import React, { useState } from 'react';

export const PasswordInput = ({ label, register, error }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4.5">
      <label className="block mb-2 font-semibold text-slate-700 text-sm">
        {label}
      </label>
      <div className="relative flex items-center">
        <input 
          type={show ? "text" : "password"} 
          {...register}
          className="w-full py-2.5 px-4 pr-16 bg-slate-50 border border-slate-200 rounded-md text-sm border-slate-200 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all font-inter"
        />
        <button 
          type="button" 
          onClick={() => setShow(!show)}
          className="absolute right-3 text-sm font-semibold text-slate-500 hover:text-teal-600 transition outline-none"
        >
          {show ? 'Ẩn' : 'Hiện'}
        </button>
      </div>
      {error && <span className="text-red-500 text-xs mt-1 block">{error.message}</span>}
    </div>
  );
};

export const TextInput = ({ label, register, error, type = "text", placeholder }) => {
  return (
    <div className="mb-4.5">
      <label className="block mb-2 font-semibold text-slate-700 text-sm">
        {label}
      </label>
      <input 
        type={type} 
        {...register} 
        placeholder={placeholder}
        className="w-full py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all font-inter"
      />
      {error && <span className="text-red-500 text-xs mt-1 block">{error.message}</span>}
    </div>
  );
};
