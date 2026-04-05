import React from 'react';

const IntegrationItem = ({ integration, onConnect, onDisconnect, isDisconnecting }) => {
    const isConnected = integration.status === 'connected';

    const getBranding = (type) => {
        switch (type) {
            case 'email': return { bg: 'bg-[#FEF3C7]', iconStr: 'E', desc: 'Nhận cảnh báo trực tiếp qua Email.\nHỗ trợ nhiều địa chỉ email và tùy chỉnh nội dung', configTitle: 'Địa chỉ email:', configValue: integration.details?.addresses || 'Chưa thiết lập' };
            case 'telegram': return { bg: 'bg-[#DBEAFE]', iconStr: 'T', desc: 'Nhận thông báo tức thì qua Telegram Bot.\nHỗ trợ gửi đến nhóm hoặc kênh', configTitle: 'Chat ID:', configValue: integration.details?.chatId || 'Chưa thiết lập' };
            case 'discord': return { bg: 'bg-[#EDE9FE]', iconStr: 'D', desc: 'Gửi cảnh báo vào Discord channel qua Webhook.\nHỗ trợ rich embed với màu sắc và biểu tượng.', configTitle: 'Webhook URL:', configValue: integration.details?.webhookUrl || '...' };
            case 'slack': return { bg: 'bg-[#F8D7DA]', iconStr: 'S', desc: 'Tích hợp với Slack workspace.\nGửi thông báo vào channel hoặc DM cụ thể.', configTitle: 'Webhook URL:', configValue: integration.details?.webhookUrl || '...' };
            case 'webhook': return { bg: 'bg-[#F8D7DA]', iconStr: 'W', desc: 'Gửi cảnh báo đến webhook URL tùy chỉnh.\nHỗ trợ JSON payload với đầy đủ thông tin sự cố.', configTitle: 'Webhook URL:', configValue: integration.details?.webhookUrl || '...' };
            case 'sms': return { bg: 'bg-[#DCFCE7]', iconStr: 'S', desc: 'Nhận cảnh báo qua tin nhắn SMS cho các sự cố nghiêm trọng.\nTính phí theo tin nhắn', configTitle: 'Phone Number:', configValue: integration.details?.phoneNumber || '...' };
            default: return { bg: 'bg-gray-100', iconStr: type.charAt(0).toUpperCase(), desc: '', configTitle: '', configValue: '' };
        }
    };

    const brand = getBranding(integration.type);

    return (
        <div className="bg-white border-[8px] border-[#E5E7EB] p-8 flex flex-col justify-between" style={{ minHeight: '360px' }}>
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-6 items-center">
                        <div className={`w-[72px] h-[72px] ${brand.bg} rounded-md flex items-center justify-center`}>
                            <span className="text-[32px] font-bold text-gray-800">{brand.iconStr}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-black">{integration.name}</h3>
                    </div>
                    <div className={`px-4 py-2 rounded-[8px] text-sm font-bold tracking-wide ${isConnected ? 'bg-[#DCFCE7] text-[#29AD47]' : 'bg-[#F8D7DA] text-[#DC3545]'}`}>
                        {isConnected ? 'Đang kích hoạt' : 'Chưa kết nối'}
                    </div>
                </div>

                <p className="text-[#B3B3B3] text-lg whitespace-pre-line mb-6 leading-relaxed min-h-[60px]">
                    {brand.desc}
                </p>

                {isConnected && brand.configTitle && (
                    <div className="mb-6 grid grid-cols-[140px_1fr] bg-[#F5F7FA] p-4 rounded items-center text-sm font-medium text-black gap-4 border border-gray-100">
                        <span className="opacity-70">{brand.configTitle}</span>
                        <span className="truncate bg-[#CBD5E0] p-2 text-black rounded font-medium">{brand.configValue}</span>
                    </div>
                )}
            </div>

            <div className="mt-auto">
                <div className="flex justify-between items-center mb-4 bg-[#F5F7FA] p-3 rounded">
                    <span className="text-sm font-medium text-black">Trạng thái</span>
                    <span className={`text-sm font-bold ${isConnected ? 'text-black' : 'text-[#DC3545]'}`}>{isConnected ? 'Kết nối' : 'Chưa kết nối'}</span>
                </div>
                {isConnected ? (
                    <button
                        disabled={isDisconnecting}
                        onClick={() => onDisconnect(integration)}
                        className="w-full py-4 bg-[#5D8ADD] text-white font-bold text-xl tracking-wide rounded-md hover:bg-blue-600 transition-colors disabled:opacity-75 disabled:cursor-wait"
                    >
                        {isDisconnecting ? 'Đang xử lý...' : 'Ngắt kết nối'}
                    </button>
                ) : (
                    <button
                        onClick={() => onConnect(integration)}
                        className="w-full py-4 bg-[#0F6EC0] text-white font-bold text-xl tracking-wide rounded-md hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        Kết nối
                    </button>
                )}
            </div>
        </div>
    );
};

export default IntegrationItem;
