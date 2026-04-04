import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="text-center pt-[150px] pb-[100px] px-[5%] text-white bg-gradient-to-br from-[#14B8A6] to-[#0F766E]">
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold mb-6"
      >
        Giám sát Website 24/7
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto font-light"
      >
        Nhận cảnh báo tức thì khi website của bạn gặp sự cố qua Telegram, Discord, Email
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <Link to="/register" className="px-10 py-4 rounded-md font-semibold text-lg bg-[#14B8A6] text-white hover:bg-[#0D9488] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(102,126,234,0.4)] transition-all w-full sm:w-auto inline-block">
          Bắt đầu miễn phí
        </Link>
        <a href="#features" className="px-10 py-4 rounded-md font-semibold text-lg bg-white text-[#14B8A6] hover:bg-[#f0f0f0] transition-colors w-full sm:w-auto inline-block">
          Tìm hiểu thêm
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
