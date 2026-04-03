import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ChevronDown } from 'lucide-react';
import debounce from 'lodash.debounce';

const FilterBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state for the search input to allow immediate UI update
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Debounced function to update URL search params
  const debouncedSetParams = useCallback(
    debounce((value) => {
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set('search', value);
      } else {
        newParams.delete('search');
      }
      newParams.set('page', '1'); // Reset to page 1 on new search
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
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-full md:max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm theo Tên hoặc URL..."
          className="w-full h-14 pl-12 pr-4 bg-white border-[3px] border-gray-100 rounded-2xl outline-none focus:border-primary transition-all duration-300 font-inter text-lg shadow-sm"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 w-full md:w-auto">
        {/* Status Filter */}
        <div className="relative min-w-[160px] flex-1 md:flex-none">
          <select
            value={searchParams.get('status') || 'All'}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full h-14 px-6 appearance-none bg-white border-[3px] border-gray-100 rounded-2xl text-lg font-medium font-inter outline-none focus:border-primary transition-all duration-300 cursor-pointer shadow-sm"
          >
            <option value="All">Tất cả Trạng thái</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center px-2 text-gray-400">
            <ChevronDown size={20} />
          </div>
        </div>

        {/* Protocol Filter */}
        <div className="relative min-w-[160px] flex-1 md:flex-none">
          <select
            value={searchParams.get('protocol') || 'All'}
            onChange={(e) => handleFilterChange('protocol', e.target.value)}
            className="w-full h-14 px-6 appearance-none bg-white border-[3px] border-gray-100 rounded-2xl text-lg font-medium font-inter outline-none focus:border-primary transition-all duration-300 cursor-pointer shadow-sm"
          >
            <option value="All">Tất cả Giao thức</option>
            <option value="HTTP">HTTP</option>
            <option value="Ping">Ping</option>
            <option value="Port">Port</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center px-2 text-gray-400">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
