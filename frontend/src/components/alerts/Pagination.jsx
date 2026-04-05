import React from 'react';

const Pagination = ({ meta, setSearchParams, searchParams }) => {
    if (!meta || meta.totalPages <= 1) return null;

    const { page, totalPages } = meta;

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setSearchParams(prev => {
            const p = new URLSearchParams(prev);
            p.set('page', newPage.toString());
            return p;
        });
    };

    const renderPages = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 min-w-[50px] md:min-w-[80px] h-10 border rounded-lg font-medium transition-colors ${i === page
                            ? 'bg-gray-800 text-white border-gray-800'
                            : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex justify-center items-center gap-4 mt-8 bg-white border border-gray-300 rounded-xl p-4 shadow-sm w-full md:w-max mx-auto overflow-x-auto">
            <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 min-w-[100px] h-10 border border-gray-300 bg-white rounded-lg text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                &lt;&lt; Trước
            </button>

            {renderPages()}

            <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 min-w-[100px] h-10 border border-gray-300 bg-white rounded-lg text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                Sau &gt;&gt;
            </button>
        </div>
    );
};

export default Pagination;
