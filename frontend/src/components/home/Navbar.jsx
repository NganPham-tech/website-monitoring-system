import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md py-3' : 'bg-white/95 py-4'} px-[5%]`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-[#14B8A6] flex items-center gap-2">
          <span>🔍</span> Uptime Monitor
        </Link>
        
        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 list-none m-0 p-0">
          <li><Link to="/" className="text-[#333] font-medium hover:text-[#14B8A6] transition-colors">Trang chủ</Link></li>
          <li><Link to="/dashboard" className="text-[#333] font-medium hover:text-[#14B8A6] transition-colors">Dashboard</Link></li>
          <li><Link to="/monitors" className="text-[#333] font-medium hover:text-[#14B8A6] transition-colors">Monitors</Link></li>
          <li><a href="#features" className="text-[#333] font-medium hover:text-[#14B8A6] transition-colors">Tính năng</a></li>
        </ul>

        {/* Auth Button */}
        <div className="hidden md:block">
          <Link to="/login" className="px-6 py-2.5 rounded bg-[#14B8A6] text-white font-semibold hover:bg-[#0D9488] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#14B8A6]/40 transition-all inline-block">
            Đăng nhập
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg flex flex-col py-4 px-[5%] gap-4">
          <Link to="/" className="text-[#333] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Trang chủ</Link>
          <Link to="/dashboard" className="text-[#333] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
          <Link to="/monitors" className="text-[#333] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Monitors</Link>
          <a href="#features" className="text-[#333] font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>Tính năng</a>
          <Link to="/login" className="mt-2 w-full text-center px-6 py-3 rounded bg-[#14B8A6] text-white font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
            Đăng nhập
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
