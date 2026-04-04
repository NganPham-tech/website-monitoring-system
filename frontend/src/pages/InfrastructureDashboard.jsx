import React from 'react';
import MacroStatsCards from '../components/infrastructure/MacroStatsCards';
import NodeClusterMonitor from '../components/infrastructure/NodeClusterMonitor';
import RealtimeConsoleLog from '../components/infrastructure/RealtimeConsoleLog';

const InfrastructureDashboard = () => {
    return (
        <div className="space-y-8">
            {/* ── Page title ────────────────────────────────────────────────── */}
            <h1 className="text-3xl font-normal font-['Segoe_UI'] text-black">
                Dashboard Quản trị Lõi
            </h1>

            {/* ── Macro stat cards ──────────────────────────────────────────── */}
            <MacroStatsCards />

            {/* ── Ping Nodes cluster ────────────────────────────────────────── */}
            <NodeClusterMonitor />

            {/* ── Real-time console log ─────────────────────────────────────── */}
            <div>
                <h2 className="text-3xl font-normal font-['Segoe_UI'] text-black mb-4">
                    📟 Real-time System & Audit Logs
                </h2>
                <RealtimeConsoleLog />
            </div>
        </div>
    );
};

export default InfrastructureDashboard;
