import React, { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import FilterBar from '../components/monitors/FilterBar';
import MonitorCard from '../components/monitors/MonitorCard';
import { useMonitors } from '../hooks/useMonitors';
import Skeleton from '../components/elements/Skeleton';
import { Search } from 'lucide-react';
import debounce from 'lodash.debounce';

const MonitorListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const debouncedSetParams = useCallback(
    debounce((value) => {
      const newParams = new URLSearchParams(searchParams);
      if (value) newParams.set('search', value);
      else newParams.delete('search');
      newParams.set('page', '1');
      setSearchParams(newParams);
    }, 500),
    [searchParams, setSearchParams]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSetParams(value);
  };
  
  const filters = {
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'All',
    protocol: searchParams.get('protocol') || 'All',
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 10,
  };

  const { data, isLoading, isError } = useMonitors(filters);
  const monitors = data?.monitors || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-[#00796B]">Danh sách Monitors</h1>
        
        <div className="flex items-center gap-4 flex-1 max-w-2xl justify-end">
          {/* Search Input matches image */}
          <div className="relative w-64">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm monitor"
              className="w-full h-10 pl-4 pr-10 rounded-lg bg-white border border-gray-100 text-sm outline-none focus:border-[#00BFA5] transition-all"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
          </div>
          
          <button 
            onClick={() => navigate('/monitors/add')}
            className="px-6 py-2 bg-[#00BFA5] text-white rounded-lg font-bold text-sm hover:bg-[#00897B] transition-all shadow-sm"
          >
            Thêm Monitor
          </button>
        </div>
      </div>

      {/* Filter Bar Component */}
      <FilterBar />

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-3xl" />
          ))}
        </div>
      )}

      {/* Monitors List */}
      {!isLoading && !isError && monitors.length > 0 && (
        <div className="space-y-2">
          {monitors.map((monitor) => (
            <MonitorCard key={monitor.id} monitor={monitor} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && monitors.length === 0 && (
        <div className="bg-white rounded-3xl p-20 flex flex-col items-center text-center shadow-sm border border-gray-50">
          <p className="text-gray-500 font-bold text-xl mb-4">Chưa có monitor nào</p>
          <button 
            onClick={() => navigate('/monitors/add')}
            className="px-8 py-3 bg-[#00BFA5] text-white rounded-xl font-bold"
          >
            Tạo ngay Monitor đầu tiên
          </button>
        </div>
      )}
    </div>
  );
};

export default MonitorListPage;
