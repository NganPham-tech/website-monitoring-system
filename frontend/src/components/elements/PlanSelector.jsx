import React from 'react';

const PlanSelector = ({ register, error }) => {
  return (
    <div className="relative w-full">
      <label className="absolute -top-7 left-0 text-[20px] font-medium text-black font-inter z-10">
        Chọn gói dịch vụ
      </label>
      <div className="relative">
        <select
          {...register('plan')}
          className={`w-full h-16 px-6 appearance-none bg-white border-[5px] rounded-[20px] text-[24px] font-medium font-inter outline-none transition-all duration-300 cursor-pointer ${
            error 
              ? 'border-red-400 focus:border-red-500' 
              : 'border-Grays-Gray-4 focus:border-primary'
          }`}
          defaultValue="Miễn phí - 5 Monitors"
        >
          <option value="Miễn phí - 5 Monitors">Miễn phí - 5 Monitors</option>
          <option value="Cơ bản - 50 Monitors">Cơ bản - 50 Monitors</option>
          <option value="Nâng cao - 200 Monitors">Nâng cao - 200 Monitors</option>
        </select>
        
        {/* Custom Caret Icon based on HTML template spacing */}
        <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && <p className="absolute -bottom-6 left-2 text-sm text-red-500 font-medium font-inter">{error.message}</p>}
    </div>
  );
};

export default PlanSelector;
