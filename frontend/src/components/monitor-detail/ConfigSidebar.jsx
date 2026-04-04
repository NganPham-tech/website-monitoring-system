import React from 'react';
import { Clock, Shield, Globe, Terminal, MapPin } from 'lucide-react';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const ConfigSidebarSkeleton = () => (
  <div className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm animate-pulse space-y-6">
    <div className="h-6 w-36 bg-gray-200 rounded" />
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-start gap-4">
        <div className="w-9 h-9 bg-gray-200 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-20 bg-gray-100 rounded" />
          <div className="h-4 w-28 bg-gray-200 rounded" />
        </div>
      </div>
    ))}
    <div className="pt-4 border-t border-gray-100 space-y-2">
      <div className="h-2.5 w-24 bg-gray-100 rounded" />
      <div className="flex gap-2">
        <div className="h-7 w-20 bg-gray-200 rounded-lg" />
      </div>
    </div>
  </div>
);

const locationMap = {
  'us-west': '🇺🇸 US West',
  'us-east': '🇺🇸 US East',
  'eu-west': '🇪🇺 EU West',
  'asian': '🌏 Asia',
  'ap-northeast': '🇯🇵 AP Northeast',
};

// ─── Single config row ────────────────────────────────────────────────────────
const ConfigRow = ({ icon: Icon, label, value, valueClass = '' }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-gray-50 rounded-lg text-gray-400 shrink-0">
      <Icon size={18} />
    </div>
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</div>
      <div className={`text-sm font-bold mt-0.5 ${valueClass || 'text-gray-700'}`}>{value}</div>
    </div>
  </div>
);

// ─── SSL days helper ──────────────────────────────────────────────────────────
const getSslDisplay = (monitor) => {
  if (!monitor?.alertTriggers?.sslExpiry) return { text: 'Không áp dụng', cls: 'text-gray-400' };
  const days = monitor.alertTriggers?.sslDays ?? 42;
  const cls = days < 15 ? 'text-rose-500' : days < 30 ? 'text-yellow-500' : 'text-emerald-500';
  return { text: `Còn ${days} ngày`, cls };
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ConfigSidebar = ({ monitor, isLoading }) => {
  if (isLoading) return <ConfigSidebarSkeleton />;
  if (!monitor) return null;

  const ssl = getSslDisplay(monitor);
  const locations = (monitor.locations || ['asian']).map((l) => locationMap[l] || l);

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm space-y-6">
      <h3 className="text-base font-bold text-gray-900">Cấu hình chi tiết</h3>

      <div className="space-y-5">
        <ConfigRow
          icon={Clock}
          label="Tần suất (Interval)"
          value={`Mỗi ${monitor.interval || '5m'}`}
        />
        <ConfigRow
          icon={Terminal}
          label="Timeout"
          value={`${monitor.timeout ? monitor.timeout / 1000 : 30}s`}
        />
        <ConfigRow
          icon={Globe}
          label="HTTP Method"
          value={monitor.httpMethod || 'GET'}
        />
        <ConfigRow
          icon={Shield}
          label="Bảo mật SSL"
          value={ssl.text}
          valueClass={ssl.cls}
        />
      </div>

      {/* Locations */}
      <div className="pt-5 border-t border-gray-50">
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin size={12} className="text-gray-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Vị trí thực hiện
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {locations.map((loc) => (
            <span
              key={loc}
              className="px-3 py-1 bg-[#E0F2F1] text-[#00897B] rounded-lg text-xs font-bold border border-[#B2DFDB]"
            >
              {loc}
            </span>
          ))}
        </div>
      </div>

      {/* Alert channels */}
      {monitor.alertChannels && monitor.alertChannels.length > 0 && (
        <div className="pt-5 border-t border-gray-50">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-3">
            Kênh cảnh báo
          </div>
          <div className="flex flex-wrap gap-2">
            {monitor.alertChannels.map((ch) => (
              <span
                key={ch}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100"
              >
                {ch}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigSidebar;
