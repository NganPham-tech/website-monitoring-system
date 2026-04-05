import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { alertService } from '../services/alertService';
import AlertFilterBar from '../components/alerts/AlertFilterBar';
import AlertTable from '../components/alerts/AlertTable';
import Pagination from '../components/alerts/Pagination';

const AlertHistoryPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Extract params mapped from URL for React Query key and API
    const params = {
        search: searchParams.get('search') || '',
        level: searchParams.get('level') || '',
        fromDate: searchParams.get('fromDate') || '',
        toDate: searchParams.get('toDate') || '',
        page: searchParams.get('page') || '1',
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ['alertHistory', params],
        queryFn: () => alertService.getAlertHistory(params),
        keepPreviousData: true,
    });

    return (
        <div className="min-h-screen p-6 md:p-8 font-sans">
            <div className="max-w-[1600px] mx-auto">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 md:mb-12">Lịch sử Cảnh báo</h1>

                {/* Stats Section */}
                <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-8 flex flex-wrap gap-12 lg:gap-32 justify-between items-center mb-12">
                    <div className="flex flex-col text-center">
                        <span className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{data?.stats?.total ?? '-'}</span>
                        <span className="text-gray-400 text-xl font-medium">Tổng (30 ngày)</span>
                    </div>
                    <div className="flex flex-col text-center">
                        <span className="text-4xl md:text-5xl font-bold text-red-600 mb-2">{data?.stats?.critical ?? '-'}</span>
                        <span className="text-gray-400 text-xl font-medium">Cảnh báo Critical</span>
                    </div>
                    <div className="flex flex-col text-center">
                        <span className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">{data?.stats?.warning ?? '-'}</span>
                        <span className="text-gray-400 text-xl font-medium">Cảnh báo Warning</span>
                    </div>
                    <div className="flex flex-col text-center">
                        <span className="text-4xl md:text-5xl font-bold text-teal-600 mb-2">{data?.stats?.info ?? '-'}</span>
                        <span className="text-gray-400 text-xl font-medium">Thông báo Info</span>
                    </div>
                </div>

                <AlertFilterBar searchParams={searchParams} setSearchParams={setSearchParams} />

                {isError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm border border-red-200">
                        Có lỗi xảy ra khi tải dữ liệu cảnh báo.
                    </div>
                )}

                <div className="mt-8 bg-gray-50/50 rounded-xl p-4 border border-gray-200 border-dashed">
                    <AlertTable isLoading={isLoading} alerts={data?.data} />
                </div>

                <Pagination meta={data?.meta} searchParams={searchParams} setSearchParams={setSearchParams} />
            </div>
        </div>
    );
};

export default AlertHistoryPage;
