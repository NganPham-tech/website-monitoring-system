import React from 'react';

const MaintenanceHeader = ({ onOpenModal }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-teal-500 rounded-[10px] shadow-sm border border-black p-8 px-12 mb-12">
            <h1 className="text-white text-3xl font-medium">Scheduled Maintenance</h1>
            <button
                onClick={onOpenModal}
                className="mt-4 md:mt-0 bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-[20px] text-xl font-medium transition-colors border border-gray-200"
            >
                Create Maintenance +
            </button>
        </div>
    );
};

export default MaintenanceHeader;
