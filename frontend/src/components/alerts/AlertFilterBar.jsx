import React from 'react';

const AlertFilterBar = ({ searchParams, setSearchParams }) => {
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (value) newParams.set('search', value);
            else newParams.delete('search');
            newParams.set('page', '1');
            return newParams;
        });
    };

    const handleLevelChange = (e) => {
        const value = e.target.value;
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (value) newParams.set('level', value);
            else newParams.delete('level');
            newParams.set('page', '1');
            return newParams;
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-lg md:text-xl font-medium">Monitor</label>
                <input
                    type="text"
                    placeholder="Tất cả"
                    value={searchParams.get('search') || ''}
                    onChange={handleSearchChange}
                    className="w-full h-14 md:h-[70px] px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-800 text-lg md:text-xl focus:outline-none focus:border-teal-500 transition-colors shadow-sm"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-lg md:text-xl font-medium">Mức độ</label>
                <select
                    value={searchParams.get('level') || ''}
                    onChange={handleLevelChange}
                    className="w-full h-14 md:h-[70px] px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-800 text-lg md:text-xl focus:outline-none focus:border-teal-500 transition-colors shadow-sm"
                >
                    <option value="">Tất cả</option>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-lg md:text-xl font-medium">Từ ngày</label>
                <input
                    type="date"
                    className="w-full h-14 md:h-[70px] px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-800 text-lg md:text-xl focus:outline-none focus:border-teal-500 transition-colors shadow-sm"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-gray-900 text-lg md:text-xl font-medium">Đến ngày</label>
                <input
                    type="date"
                    className="w-full h-14 md:h-[70px] px-4 py-2 bg-white rounded-lg border border-gray-300 text-gray-800 text-lg md:text-xl focus:outline-none focus:border-teal-500 transition-colors shadow-sm"
                />
            </div>
        </div>
    );
};

export default AlertFilterBar;
