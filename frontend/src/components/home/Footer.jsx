import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.warning('Vui lòng nhập email');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('/api/public/newsletter', { email });
      toast.success('Đăng ký nhận bản tin thành công!');
      setEmail('');
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#2d3748] text-white py-[60px] px-[5%]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div>
          <div className="text-2xl font-bold text-[#14B8A6] flex items-center gap-2 mb-4">
            <span>🔍</span> Uptime Monitor
          </div>
          <p className="text-gray-400 leading-relaxed max-w-sm">
            Hệ thống giám sát Website chuyên nghiệp. Nhận cảnh báo tức thì khi website của bạn gặp sự cố qua nhiều kênh khác nhau.
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-bold mb-2">Liên kết nội bộ</h3>
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">Trang chủ</Link>
          <a href="#features" className="text-gray-400 hover:text-white transition-colors">Tính năng</a>
          <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Đăng nhập</Link>
          <Link to="/register" className="text-gray-400 hover:text-white transition-colors">Đăng ký mới</Link>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-4">Đăng ký nhận bản tin</h3>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <input 
              type="email" 
              placeholder="Nhập email của bạn" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-[#14B8A6] transition-colors"
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#14B8A6] hover:bg-[#0D9488] text-white px-4 py-3 rounded font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang gửi...' : 'Đăng ký'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="text-center pt-8 border-t border-gray-700 text-gray-400">
        <p>&copy; 2026 Uptime Monitor. Hệ thống giám sát Website chuyên nghiệp.</p>
      </div>
    </footer>
  );
};

export default Footer;
