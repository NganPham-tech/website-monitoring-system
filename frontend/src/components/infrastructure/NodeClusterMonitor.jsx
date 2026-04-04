import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getNodes, deployNode } from '../../services/infraService';

// ─── Available deploy regions ─────────────────────────────────────────────────

const AVAILABLE_REGIONS = [
    '🇺🇸 US East (N. Virginia)',
    '🇺🇸 US West (Oregon)',
    '🇸🇬 Asia (Singapore)',
    '🇩🇪 EU (Frankfurt)',
    '🇬🇧 EU (London)',
    '🇦🇺 Asia Pacific (Sydney)',
    '🇯🇵 Asia Pacific (Tokyo)',
];

// ─── Deploy confirmation modal ────────────────────────────────────────────────

const DeployNodeModal = ({ isOpen, onClose }) => {
    const [region, setRegion] = useState(AVAILABLE_REGIONS[0]);
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => deployNode(region),
        onSuccess: () => {
            toast.success(`Đã kích hoạt triển khai Node mới tại ${region}!`);
            queryClient.invalidateQueries({ queryKey: ['infra-nodes'] });
            onClose();
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || 'Triển khai thất bại!');
        },
    });

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-1">Triển khai Node mới</h2>
                <p className="text-sm text-gray-500 mb-5">
                    Chọn khu vực địa lý để khởi tạo Ping Worker mới. Thao tác này không thể hoàn tác ngay.
                </p>

                <label className="block text-sm font-medium text-gray-600 mb-1">
                    Khu vực triển khai
                </label>
                <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-400 mb-6"
                >
                    {AVAILABLE_REGIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition"
                    >
                        Huỷ
                    </button>
                    <button
                        onClick={() => mutate()}
                        disabled={isPending}
                        className="px-5 py-2 rounded-lg bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition disabled:opacity-60"
                    >
                        {isPending ? 'Đang triển khai...' : 'Xác nhận triển khai'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// ─── Single node card ─────────────────────────────────────────────────────────

const NodeCard = ({ node }) => {
    const isOnline = node.status === 'online';

    return (
        <div className="mix-blend-hard-light bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-black/20 overflow-hidden w-96 flex-shrink-0 p-4 flex flex-col justify-between h-44">
            {/* Top: region + status badge */}
            <div className="flex items-start justify-between gap-2">
                <div className="text-xl font-normal font-['Segoe_UI'] text-black leading-snug">
                    {node.region}
                </div>
                <span
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-black/20 text-base font-normal font-['Segoe_UI'] ${isOnline ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
                        }`}
                >
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-white' : 'bg-white'}`} />
                    {isOnline ? 'Online' : 'Offline'}
                </span>
            </div>

            {/* Bottom: metrics row */}
            <div className="flex items-end justify-between mt-4">
                <div>
                    <div className="text-base font-normal font-['Segoe_UI'] text-black">
                        Latency TB
                    </div>
                    <div className="text-base font-normal font-['Segoe_UI'] text-black">
                        {node.latency} ms
                    </div>
                </div>
                <div>
                    <div className="text-base font-normal font-['Segoe_UI'] text-black">
                        Tải CPU
                    </div>
                    <div className="text-base font-normal font-['Segoe_UI'] text-black">
                        {node.cpu}%
                    </div>
                </div>
                <div>
                    <div className="text-base font-normal font-['Segoe_UI'] text-black">
                        Queue
                    </div>
                    <div className="text-base font-normal font-['Segoe_UI'] text-black">
                        {node.queue}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Node card skeleton ───────────────────────────────────────────────────────

const NodeCardSkeleton = () => (
    <div className="w-96 h-44 flex-shrink-0 bg-white rounded-[20px] animate-pulse shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-black/20" />
);

// ─── Main component ───────────────────────────────────────────────────────────

const NodeClusterMonitor = () => {
    const [deployOpen, setDeployOpen] = useState(false);

    const { data: nodes, isLoading } = useQuery({
        queryKey: ['infra-nodes'],
        queryFn: getNodes,
        refetchInterval: 10_000,
    });

    return (
        <>
            <div className="mix-blend-hard-light bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-black/20 overflow-hidden p-6">
                {/* Header row */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-normal font-['Segoe_UI'] text-black">
                        🌐 Trạng thái Ping Nodes (Workers)
                    </h2>
                    <button
                        onClick={() => setDeployOpen(true)}
                        className="mix-blend-hard-light bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-black/20 px-5 py-2 text-xl font-normal font-['Segoe_UI'] text-black hover:bg-gray-50 transition whitespace-nowrap"
                    >
                        + Triển khai Node mới
                    </button>
                </div>

                {/* Scrollable nodes row */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => <NodeCardSkeleton key={i} />)
                        : nodes?.map((node) => <NodeCard key={node.id} node={node} />)
                    }
                </div>
            </div>

            <DeployNodeModal
                isOpen={deployOpen}
                onClose={() => setDeployOpen(false)}
            />
        </>
    );
};

export default NodeClusterMonitor;
