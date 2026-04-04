import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import debounce from 'lodash.debounce';

const FilterBar = () => {
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

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') newParams.set(key, value);
    else newParams.delete(key);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const status = searchParams.get('status') || 'All';
  const protocol = searchParams.get('protocol') || 'All';

  const FilterButton = ({ active, label, onClick, count }) => (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200 border-2 ${
        active 
          ? 'bg-[#00BFA5] border-[#00BFA5] text-white shadow-md' 
          : 'bg-white border-gray-100 text-gray-500 hover:border-[#00BFA5] hover:text-[#00BFA5]'
      }`}
    >
      {label} {count !== undefined && `(${count})`}
    </button>
  );

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 mb-8">
      <div className="flex flex-col gap-6">
        {/* Status Filter Row */}
        <div className="flex items-center gap-6">
          <span className="text-[#80CBC4] font-bold text-sm min-w-[80px]">Trạng thái:</span>
          <div className="flex gap-3 flex-wrap">
            <FilterButton active={status === 'All'} label="Tất cả" count={10} onClick={() => handleFilterChange('status', 'All')} />
            <FilterButton active={status === 'Online'} label="Online" count={10} onClick={() => handleFilterChange('status', 'Online')} />
            <FilterButton active={status === 'Offline'} label="Offline" count={4} onClick={() => handleFilterChange('status', 'Offline')} />
          </div>
        </div>

        {/* Protocol Filter Row */}
        <div className="flex items-center gap-6">
          <span className="text-[#80CBC4] font-bold text-sm min-w-[80px]">Loại:</span>
          <div className="flex gap-3 flex-wrap">
            <FilterButton active={protocol === 'All'} label="Tất cả" onClick={() => handleFilterChange('protocol', 'All')} />
            <FilterButton active={protocol === 'HTTP'} label="HTTP" onClick={() => handleFilterChange('protocol', 'HTTP')} />
            <FilterButton active={protocol === 'Ping'} label="Ping" onClick={() => handleFilterChange('protocol', 'Ping')} />
            <FilterButton active={protocol === 'Port'} label="Port" onClick={() => handleFilterChange('protocol', 'Port')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
