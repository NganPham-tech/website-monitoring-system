import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Loader2 } from 'lucide-react';
import monitorDetailService from '../services/monitorDetailService';

// Layout components
import DetailHeader from '../components/monitor-detail/DetailHeader';
import TabsNavigation from '../components/monitor-detail/TabsNavigation';

// Overview tab components
import KpiCards from '../components/monitor-detail/KpiCards';
import ConfigSidebar from '../components/monitor-detail/ConfigSidebar';
import ResponseChart from '../components/monitor-detail/ResponseChart';
import ActivityLogs from '../components/monitor-detail/ActivityLogs';

// Other tab content
import StatsTab from '../components/monitor-detail/StatsTab';
import HistoryTab from '../components/monitor-detail/HistoryTab';
import AlertsTab from '../components/monitor-detail/AlertsTab';
import SettingsTab from '../components/monitor-detail/SettingsTab';

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
const DeleteModal = ({ monitorName, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={!isDeleting ? onCancel : undefined}
    />
    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10 animate-fade-in-scale">
      <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Trash2 size={30} className="text-rose-500" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
        Xác nhận xóa Monitor?
      </h3>
      <p className="text-sm text-gray-500 text-center mb-1">
        Bạn sắp xóa vĩnh viễn:
      </p>
      <p className="text-sm font-bold text-gray-800 text-center bg-gray-50 rounded-xl px-4 py-3 mb-5">
        &ldquo;{monitorName}&rdquo;
      </p>

      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-6">
        <p className="text-xs text-rose-600 font-semibold text-center leading-relaxed">
          ⚠️ Hành động này không thể hoàn tác.<br />
          Toàn bộ lịch sử và nhật ký sẽ bị xóa vĩnh viễn.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isDeleting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Đang xóa...
            </>
          ) : (
            <>
              <Trash2 size={15} />
              Xóa vĩnh viễn
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);

// ─── Overview Tab ─────────────────────────────────────────────────────────────
const OverviewTab = ({ monitor, kpis, isLoadingKpis, chartData, isLoadingChart, chartRange, onRangeChange, logs, isLoadingLogs }) => (
  <div className="space-y-8">
    {/* KPI Cards */}
    <KpiCards kpis={kpis} isLoading={isLoadingKpis} />

    {/* Chart + Sidebar */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2">
        <ResponseChart
          data={chartData || []}
          range={chartRange}
          onRangeChange={onRangeChange}
          isLoading={isLoadingChart}
        />
      </div>
      <div>
        <ConfigSidebar monitor={monitor} isLoading={!monitor} />
      </div>
    </div>

    {/* Activity Logs */}
    <ActivityLogs logs={logs} isLoading={isLoadingLogs} />
  </div>
);

// ─── Main Page Container ──────────────────────────────────────────────────────
const MonitorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('overview');
  const [chartRange, setChartRange] = useState('7d');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ── Data Queries ────────────────────────────────────────────────────────────
  const {
    data: monitor,
    isLoading: isLoadingMonitor,
    isError,
    error,
  } = useQuery({
    queryKey: ['monitor', id],
    queryFn: () => monitorDetailService.getMonitorDetail(id),
    enabled: !!id,
    staleTime: 30_000,
    retry: 1,
  });

  const { data: kpis, isLoading: isLoadingKpis } = useQuery({
    queryKey: ['kpis', id],
    queryFn: () => monitorDetailService.getMonitorKpis(id),
    enabled: !!id,
    staleTime: 5 * 60_000,
  });

  const { data: chartData, isLoading: isLoadingChart } = useQuery({
    queryKey: ['chart', id, chartRange],
    queryFn: () => monitorDetailService.getMonitorChartData(id, chartRange),
    enabled: !!id,
    staleTime: 2 * 60_000,
  });

  const { data: logs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['logs', id],
    queryFn: () => monitorDetailService.getActivityLogs(id),
    enabled: !!id,
    staleTime: 60_000,
  });

  // ── Mutations ───────────────────────────────────────────────────────────────
  const toggleMutation = useMutation({
    mutationFn: () => monitorDetailService.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitor', id] });
      queryClient.invalidateQueries({ queryKey: ['monitors'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => monitorDetailService.deleteMonitor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitors'] });
      navigate('/monitors');
    },
  });

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleToggleStatus = () => toggleMutation.mutate();
  const handleDeleteClick = () => setShowDeleteModal(true);
  const handleDeleteConfirm = () => deleteMutation.mutate();
  const handleDeleteCancel = () => setShowDeleteModal(false);

  // ── Alert logs: filter offline from activity logs ───────────────────────────
  const alertLogs = (logs || []).filter((l) => l.status >= 400 || l.status === 503);

  // ── Error State ─────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="max-w-xl mx-auto mt-24 text-center">
        <div className="bg-white rounded-3xl p-14 shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Không thể tải Monitor</h2>
          <p className="text-sm text-gray-400">
            {error?.response?.data?.message || 'Monitor không tồn tại hoặc bạn không có quyền truy cập.'}
          </p>
          <button
            onClick={() => navigate('/monitors')}
            className="mt-6 px-6 py-3 bg-[#00BFA5] text-white rounded-xl font-bold text-sm hover:bg-[#00897B] transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // ── Tab Content Renderer ────────────────────────────────────────────────────
  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            monitor={monitor}
            kpis={kpis}
            isLoadingKpis={isLoadingKpis}
            chartData={chartData}
            isLoadingChart={isLoadingChart}
            chartRange={chartRange}
            onRangeChange={setChartRange}
            logs={logs}
            isLoadingLogs={isLoadingLogs}
          />
        );
      case 'statistics':
        return <StatsTab kpis={kpis} monitor={monitor} isLoading={isLoadingKpis} />;
      case 'history':
        return <HistoryTab logs={logs} isLoading={isLoadingLogs} />;
      case 'alerts':
        return <AlertsTab logs={alertLogs} isLoading={isLoadingLogs} />;
      case 'settings':
        return <SettingsTab monitor={monitor} isLoading={isLoadingMonitor} monitorId={id} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-0">
      {/* Header */}
      <DetailHeader
        monitor={monitor}
        isLoading={isLoadingMonitor}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteClick}
        isTogglingStatus={toggleMutation.isPending}
      />

      {/* Tab Navigation */}
      <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content — only active tab is mounted */}
      <div key={activeTab} className="animate-fade-in">
        {renderTab()}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          monitorName={monitor?.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default MonitorDetail;
