import React from 'react';

const featuresData = [
  { icon: '⚡', title: 'Giám sát thời gian thực', desc: 'Kiểm tra website của bạn mỗi 30 giây, phát hiện sự cố ngay lập tức' },
  { icon: '🔔', title: 'Cảnh báo đa kênh', desc: 'Nhận thông báo qua Telegram, Discord, Email và SMS' },
  { icon: '📊', title: 'Báo cáo chi tiết', desc: 'Thống kê uptime, response time và lịch sử sự cố đầy đủ' },
  { icon: '🌍', title: 'Giám sát toàn cầu', desc: 'Kiểm tra từ nhiều vị trí địa lý khác nhau' },
  { icon: '🔒', title: 'Bảo mật cao', desc: 'Mã hóa dữ liệu, xác thực 2 yếu tố' },
  { icon: '👥', title: 'Làm việc nhóm', desc: 'Quản lý team, phân quyền và chia sẻ dashboard' }
];

const Features = () => {
  return (
    <section className="bg-white py-20 px-[5%]" id="features">
      <h2 className="text-center text-4xl font-bold mb-12 text-[#333]">Tính năng nổi bật</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto">
        {featuresData.map((feature, idx) => (
          <div 
            key={idx} 
            className="p-8 text-center rounded-[10px] bg-[#f8f9fa] hover:-translate-y-2.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all duration-300"
          >
            <div className="text-5xl mb-4">{feature.icon}</div>
            <h3 className="text-[#14B8A6] text-xl font-bold mb-4">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
