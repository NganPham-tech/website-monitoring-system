import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { integrationService } from '../services/integrationService';
import IntegrationItem from '../components/integrations/IntegrationItem';
import ConnectionModal from '../components/integrations/ConnectionModal';
import { toast } from 'react-toastify';

const IntegrationsPage = () => {
    const queryClient = useQueryClient();
    const [selectedIntegration, setSelectedIntegration] = useState(null);
    const [isDisconnectingId, setIsDisconnectingId] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['integrations'],
        queryFn: () => integrationService.getIntegrations()
    });

    const connectMutation = useMutation({
        mutationFn: ({ type, configData }) => integrationService.connectIntegration(type, configData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['integrations'] });
            toast.success('Kết nối thành công!');
            setSelectedIntegration(null);
        },
        onError: () => toast.error('Kết nối thất bại, vui lòng kiểm tra lại cấu hình!')
    });

    const disconnectMutation = useMutation({
        mutationFn: (id) => integrationService.disconnectIntegration(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['integrations'] });
            toast.success('Đã ngắt kết nối an toàn!');
            setIsDisconnectingId(null);
        },
        onError: () => {
            toast.error('Ngắt kết nối thất bại!');
            setIsDisconnectingId(null);
        }
    });

    const handleConnectSave = (type, configData) => {
        connectMutation.mutate({ type, configData });
    };

    const handleDisconnect = (integration) => {
        if (window.confirm(`Bạn có chắc muốn ngắt kết nối với dịch vụ ${integration.name}? Tất cả cảnh báo đang gửi đến kênh này sẽ ngừng hoạt động.`)) {
            setIsDisconnectingId(integration.id);
            disconnectMutation.mutate(integration.id);
        }
    };

    return (
        <div className="bg-[#F0FDFA] min-h-screen p-8 lg:p-14 font-sans">
            <div className="max-w-[2400px] mx-auto relative px-4 lg:px-12 pt-8">

                {/* Tiêu đề trang */}
                <div className="mb-14 border-b border-gray-200 pb-6 w-full max-w-[500px]">
                    <h1 className="text-[32px] font-bold text-black leading-tight mb-2">Tích hợp</h1>
                    <p className="text-[24px] font-normal text-black mt-2">
                        Kết nối Uptime Monitor với các dịch vụ thông báo
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 animate-pulse pt-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white border-[8px] border-gray-200 min-h-[360px] rounded-lg shadow-sm opacity-50"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 pt-4">
                        {data?.data?.map(item => (
                            <IntegrationItem
                                key={item.id}
                                integration={item}
                                onConnect={setSelectedIntegration}
                                onDisconnect={handleDisconnect}
                                isDisconnecting={isDisconnectingId === item.id}
                            />
                        ))}
                    </div>
                )}

                {/* Headless UI Modal */}
                <ConnectionModal
                    isOpen={!!selectedIntegration}
                    onClose={() => !connectMutation.isPending && setSelectedIntegration(null)}
                    integration={selectedIntegration}
                    onSave={handleConnectSave}
                    isSaving={connectMutation.isPending}
                />
            </div>
        </div>
    );
};
export default IntegrationsPage;
