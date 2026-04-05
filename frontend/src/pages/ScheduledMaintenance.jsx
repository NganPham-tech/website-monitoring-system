import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceService } from '../services/maintenanceService';
import MaintenanceHeader from '../components/maintenance/MaintenanceHeader';
import MaintenanceList from '../components/maintenance/MaintenanceList';
import TimelineGanttChart from '../components/maintenance/TimelineGanttChart';
import MaintenanceFormModal from '../components/maintenance/MaintenanceFormModal';

const ScheduledMaintenance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['maintenances'],
        queryFn: () => maintenanceService.getMaintenances()
    });

    const createMutation = useMutation({
        mutationFn: (payload) => maintenanceService.createMaintenance(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['maintenances'] });
            setIsModalOpen(false);
        }
    });

    const handleCreate = (payload) => {
        createMutation.mutate(payload);
    };

    return (
        <div className="bg-[#1e293b] min-h-screen p-6 md:p-10 font-sans">
            <div className="max-w-[2400px] mx-auto">
                <MaintenanceHeader onOpenModal={() => setIsModalOpen(true)} />

                {isLoading ? (
                    <div className="text-white text-2xl text-center py-20 animate-pulse">Đang tải kế hoạch bảo trì...</div>
                ) : (
                    <>
                        <MaintenanceList maintenances={data?.data} />
                        <TimelineGanttChart maintenances={data?.data} />
                    </>
                )}

                <MaintenanceFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreate}
                />
            </div>
        </div>
    );
};

export default ScheduledMaintenance;
