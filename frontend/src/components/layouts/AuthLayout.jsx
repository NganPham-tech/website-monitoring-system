import React from 'react';
import { useLocation } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  if (isLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-teal-50/95 to-emerald-400 md:p-8 lg:p-12 overflow-hidden">
        {/* Container Card */}
        <div className="max-w-6xl w-full flex bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[80vh]">
          
          {/* Left Side: Brand Panel (Hidden on mobile) */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-light via-primary to-primary-dark p-12 flex-col justify-between relative overflow-hidden">
            {/* Abstract circles/decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl overflow-hidden"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-dark/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl overflow-hidden"></div>
            
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
              <img 
                src="https://placehold.co/120x100?text=Uptime" 
                alt="Uptime Logo" 
                className="w-32 h-auto mb-8 drop-shadow-lg"
              />
              <h1 className="text-4xl font-bold text-primary-dark mb-4 drop-shadow-sm font-inter">
                Uptime Monitor
              </h1>
              <p className="text-emerald-900/80 text-xl max-w-md font-medium leading-relaxed font-inter">
                Theo dõi hiệu năng website của bạn một cách thông minh và chuyên nghiệp nhất.
              </p>
            </div>
            
            <div className="relative z-10 text-emerald-900/60 text-sm italic font-inter">
              © 2024 Uptime Monitor. All rights reserved.
            </div>
          </div>
  
          {/* Right Side: Form Panel */}
          <div className="w-full lg:w-1/2 bg-white flex flex-col p-8 md:p-12 lg:p-16">
            <div className="flex-1 w-full max-w-md mx-auto flex flex-col justify-center">
              {children}
            </div>
            
            {/* Mobile Footer Links */}
            <div className="mt-8 flex items-center justify-center space-x-4 text-sm font-medium lg:hidden">
              <a href="/" className="text-accent-blue hover:underline">Về trang chủ</a>
              <span className="text-gray-300">|</span>
              <a href="/register" className="text-accent-link hover:underline">Đăng ký ngay</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Register Layout (1 Column)
  return (
    <div className="min-h-screen bg-white">
      {/* Container gradient matches the HTML exactly */}
      <div className="w-full min-h-screen relative flex bg-gradient-to-b from-teal-50/95 to-emerald-400 justify-center items-center p-4 lg:p-12">
        {/* White container */}
        <div className="w-full max-w-5xl bg-white rounded-[20px] shadow-2xl relative overflow-hidden flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
