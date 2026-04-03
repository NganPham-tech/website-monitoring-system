import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Timer, Cpu, ShieldCheck, MapPin, Bell, Repeat, CheckCircle2 } from 'lucide-react';

const locationMap = {
  'us-west': '🇺🇸 US West',
  'us-east': '🇺🇸 US East',
  'eu-west': '🇪🇺 EU West',
  'asian': '🌏 Asia (Singapore)',
  'ap-northeast': '🇯🇵 AP Northeast',
};

const Field = ({ label, value }) => (
  <div className="p-4 bg-gray-50 rounded-xl">
    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value ?? '—'}</p>
  </div>
);

const SettingsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <div className="h-4 w-36 bg-gray-200 rounded mb-5" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, j) => <div key={j} className="h-14 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    ))}
  </div>
);

const SettingsTab = ({ monitor, isLoading, monitorId }) => {
  const navigate = useNavigate();

  if (isLoading) return <SettingsSkeleton />;
  if (!monitor) return null;

  return (
    <div className="space-y-6">
      {/* Basic Config */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-5">
          Cấu hình cơ bản
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Tên Monitor" value={monitor.name} />
          <Field label="URL / IP" value={monitor.url} />
          <Field label="Protocol" value={monitor.protocol?.toUpperCase()} />
          <Field label="HTTP Method" value={monitor.httpMethod || 'GET'} />
          <Field label="Tần suất" value={`Mỗi ${monitor.interval || '5m'}`} />
          <Field label="Timeout" value={`${(monitor.timeout ?? 30000) / 1000}s`} />
        </div>
      </div>

      {/* Advanced Config */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-5">
          Cài đặt nâng cao
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Field label="Số lần thử lại" value={`${monitor.retries ?? 3} lần`} />
          {monitor.portNumber && <Field label="Port" value={monitor.portNumber} />}
          {monitor.searchKeyword && <Field label="Từ khóa" value={monitor.searchKeyword} />}
          <Field
            label="Node vị trí"
            value={(monitor.locations || []).map((l) => locationMap[l] || l).join(', ')}
          />
        </div>
      </div>

      {/* Alert config */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-5">
          Cấu hình cảnh báo
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Điều kiện kích hoạt</p>
            {[
              { label: 'Khi xuống Offline', active: monitor.alertTriggers?.isDown },
              { label: 'Phản hồi chậm', active: monitor.alertTriggers?.slowResponse },
              { label: 'SSL sắp hết hạn', active: monitor.alertTriggers?.sslExpiry },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  item.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'
                }`}>
                  {item.active ? 'Bật' : 'Tắt'}
                </span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-3">Kênh nhận cảnh báo</p>
            <div className="flex flex-wrap gap-2">
              {(monitor.alertChannels || []).map((ch) => (
                <span
                  key={ch}
                  className="px-3 py-1.5 bg-teal-50 text-[#00897B] text-xs font-bold rounded-full border border-teal-100"
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate(`/monitors/${monitorId}/edit`)}
          className="px-6 py-3 bg-[#00BFA5] text-white rounded-xl text-sm font-bold hover:bg-[#00897B] transition-colors shadow-sm"
        >
          Chỉnh sửa cấu hình
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
