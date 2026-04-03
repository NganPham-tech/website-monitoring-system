import React from 'react';

const SocialLoginButton = ({ provider, onClick }) => {
  const isGoogle = provider === 'google';
  
  const label = isGoogle ? 'Đăng nhập với Google' : 'Đăng nhập với Github';
  
  // Custom styles to match HTML sample's "dot" and "border" feeling
  const dotColor = isGoogle 
    ? 'bg-gradient-to-b from-[#0088FF] to-[#667EEA]' 
    : 'bg-gradient-to-b from-[#D9D9D9] to-black shadow-inner';

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full h-[60px] md:h-[70px] bg-white rounded-2xl border-[3px] border-gray-200 hover:border-primary transition-all duration-300 flex items-center justify-center space-x-4 mb-4"
    >
      {/* Decorative dot from design */}
      <div className={`w-4 h-4 rounded-full ${dotColor} absolute left-6 md:left-8`}></div>
      
      <span className="text-gray-700 font-inter font-medium text-base md:text-lg">
        {label}
      </span>
    </button>
  );
};

export default SocialLoginButton;
