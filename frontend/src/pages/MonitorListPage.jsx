import React from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterBar from '../components/monitors/FilterBar';
import MonitorCard from '../components/monitors/MonitorCard';
import { useMonitors } from '../hooks/useMonitors';
import Skeleton from '../components/elements/Skeleton';
import { LayoutGrid, Plus, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const MonitorListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Extract filters from URL Search Params
  const filters = {
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || 'All',
    protocol: searchParams.get('protocol') || 'All',
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 12,
  };

  const { data, isLoading, isError, error } = useMonitors(filters);

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const monitors = data?.monitors || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50/30 p-4 md:p-8 lg:p-12 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Danh sách Monitor</h1>
              <p className="text-gray-500 font-medium">Theo dõi tình trạng hoạt động của các website</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-primary/20 group">
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
            Thêm Monitor
          </button>
        </div>

        {/* Filter Bar Component */}
        <FilterBar />

        {/* Loading State: Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border-[3px] border-gray-100 p-6 h-[340px] flex flex-col">
                <div className="flex justify-between mb-4">
                   <Skeleton className="w-24 h-6" />
                   <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <Skeleton className="w-3/4 h-8 mb-2" />
                <Skeleton className="w-1/2 h-4 mb-6" />
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <Skeleton className="w-32 h-4" />
                  <Skeleton className="w-24 h-10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-[3px] border-rose-100">
            <div className="p-4 bg-rose-50 rounded-full text-rose-500 mb-4">
              <AlertCircle size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Đã có lỗi xảy ra</h3>
            <p className="text-gray-500 mb-6">{error?.message || 'Không thể tải danh sách monitors'}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && monitors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-[3px] border-gray-100 shadow-sm">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <LayoutGrid size={48} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy Monitor</h3>
            <p className="text-gray-500 mb-8 max-w-md text-center">
              Chúng tôi không tìm thấy website nào khớp với bộ lọc của bạn. Hãy thử thay đổi từ khóa hoặc bộ lọc khác.
            </p>
            <button 
              onClick={() => setSearchParams({})}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}

        {/* Monitors Grid */}
        {!isLoading && !isError && monitors.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {monitors.map((monitor) => (
                <MonitorCard key={monitor.id} monitor={monitor} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pb-12">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="p-3 rounded-xl border-2 border-gray-100 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-12 h-12 rounded-xl font-bold transition-all ${
                      filters.page === i + 1
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-white border-2 border-gray-100 text-gray-500 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === totalPages}
                  className="p-3 rounded-xl border-2 border-gray-100 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-gray-100 disabled:hover:text-gray-400 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MonitorListPage;
