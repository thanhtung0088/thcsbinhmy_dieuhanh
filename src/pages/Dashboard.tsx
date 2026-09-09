import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, LineChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DICH_VU_CONG_TABS } from '../data/dichVuCong';
import { CAMPUSES, LEADERSHIP, TASKS, ALERTS } from '../data/mockData';
import { ServiceRequestModal } from '../components/shared/ServiceRequestModal';
import { WeeklyFocusCard } from '../components/shared/WeeklyFocusCard';

function filterByCampus<T extends { campusId: string }>(items: T[], campusId: string) {
  return campusId === 'all' ? items : items.filter((i) => i.campusId === campusId || i.campusId === 'all');
}

export function Dashboard() {
  const { activeCampus, user } = useAuth();
  const [dvcTab, setDvcTab] = useState(DICH_VU_CONG_TABS[0].id);
  const [openService, setOpenService] = useState<string | null>(null);

  const activeDvc = DICH_VU_CONG_TABS.find((t) => t.id === dvcTab)!;
  const campuses = activeCampus === 'all' ? CAMPUSES : CAMPUSES.filter((c) => c.id === activeCampus);
  const tasks = filterByCampus(TASKS, activeCampus);
  const alerts = filterByCampus(ALERTS, activeCampus);
  const overdueCount = tasks.filter((t) => t.status === 'qua_han').length;
  const pendingApproval = tasks.filter((t) => t.status === 'cho_duyet').length;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600">TỔNG QUAN</p>
        <h2 className="text-2xl font-bold text-blue-950 mt-0.5">
          {activeCampus === 'all' ? 'Toàn trường · 4 điểm trường' : campuses[0]?.name}
        </h2>
        <p className="text-xs text-blue-700/60 mt-1">
          Hiệu trưởng: {LEADERSHIP.find((l) => l.title === 'Hiệu trưởng')?.name}
          {' · '}
          {LEADERSHIP.filter((l) => l.title !== 'Hiệu trưởng')
            .map((l) => `${l.title.replace('Phó Hiệu trưởng phụ trách ', 'PHT ')}: ${l.name}`)
            .join(' · ')}
        </p>
      </div>

      {/* Hôm nay Hiệu trưởng cần biết gì — chỉ dành cho cán bộ đã đăng nhập, không hiện với khách */}
      {user && (
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <AlertTriangle size={17} className="text-blue-600 shrink-0" />
            <p className="text-sm text-blue-900">
              <span className="font-semibold">{overdueCount}</span> quá hạn ·{' '}
              <span className="font-semibold">{pendingApproval}</span> chờ duyệt ·{' '}
              <span className="font-semibold">{alerts.length}</span> cảnh báo
            </p>
          </div>
          <Link to="/phan-tich" className="flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900">
            <LineChart size={13} /> Xem phân tích chi tiết
          </Link>
        </div>
      )}

      <div className={`grid gap-4 ${user ? 'lg:grid-cols-2' : ''}`}>
        {/* Left: Dịch vụ công */}
        <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
            <p className="text-sm font-semibold">Dịch vụ công</p>
            <Link to="/dich-vu-cong" className="text-xs text-blue-100 hover:text-white underline">
              Xem tất cả
            </Link>
          </div>
          <div className="flex border-b border-black/10">
            {DICH_VU_CONG_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setDvcTab(t.id)}
                className={`flex-1 py-2 text-[11px] font-semibold uppercase border-b-2 ${
                  dvcTab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-ink/40 hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {activeDvc.items.map((item) => (
              <button
                key={item.label}
                onClick={() => setOpenService(item.label)}
                className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-left hover:border-blue-400 transition-colors"
              >
                <item.icon size={14} className="text-blue-600 shrink-0" />
                <span className="text-xs text-ink truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Công việc trọng tâm trong tuần — chỉ dành cho cán bộ đã đăng nhập */}
        {user && <WeeklyFocusCard />}
      </div>

      {openService && (
        <ServiceRequestModal
          groupLabel={activeDvc.label}
          serviceLabel={openService}
          onClose={() => setOpenService(null)}
        />
      )}
    </div>
  );
}
