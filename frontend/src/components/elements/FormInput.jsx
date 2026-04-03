import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FormInput = ({ 
  label, 
  name, 
  register, 
  error, 
  type = 'text', 
  placeholder,
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        <label className="absolute -top-7 left-0 text-[20px] font-medium text-black font-inter">
          {label}
        </label>
        
        <input
          {...register(name)}
          type={inputType}
          placeholder={placeholder}
          className={`w-full h-16 px-6 bg-white border-[5px] rounded-[20px] text-[24px] font-medium font-inter outline-none transition-all duration-300 placeholder:text-black/50 ${
            error 
              ? 'border-red-400 focus:border-red-500' 
              : 'border-Grays-Gray-4 focus:border-primary'
          }`}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        )}
      </div>
      {error && <p className="absolute -bottom-6 left-2 text-sm text-red-500 font-medium font-inter">{error.message}</p>}
    </div>
  );
};

export default FormInput;
