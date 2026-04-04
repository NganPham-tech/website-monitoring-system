import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stats = () => {
  const [stats, setStats] = useState({
    accuracy: '99.9%',
    monitors: '10,000+',
    users: '5,000+',
    support: '24/7'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/public/stats');
        if (response.data) {
          setStats({
            accuracy: response.data.accuracy || '99.9%',
            monitors: response.data.totalMonitors ? `${response.data.totalMonitors.toLocaleString()}+` : '10,000+',
            users: response.data.totalUsers ? `${response.data.totalUsers.toLocaleString()}+` : '5,000+',
            support: response.data.support || '24/7'
          });
        }
      } catch (error) {
        // Fallback already set in initial state
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="bg-gradient-to-br from-[#14B8A6] to-[#0F766E] py-[60px] px-[5%] text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-[1000px] mx-auto text-center">
        <div className="stat-item">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">{stats.accuracy}</h2>
          <p className="text-lg opacity-90">Độ chính xác</p>
        </div>
        <div className="stat-item">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">{stats.monitors}</h2>
          <p className="text-lg opacity-90">Website giám sát</p>
        </div>
        <div className="stat-item">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">{stats.users}</h2>
          <p className="text-lg opacity-90">Người dùng</p>
        </div>
        <div className="stat-item">
          <h2 className="text-4xl md:text-5xl font-bold mb-2">{stats.support}</h2>
          <p className="text-lg opacity-90">Hỗ trợ</p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
