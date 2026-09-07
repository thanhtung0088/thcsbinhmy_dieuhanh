import {
  Users,
  UserSquare2,
  Building2,
  GraduationCap,
  ClipboardList,
  FileText,
  Wrench,
  Wallet,
  Gauge,
  CalendarDays,
  AlertTriangle,
  Globe2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PageBanner } from '../components/layout/PageBanner';
import { Link } from 'react-router-dom';
import {
  ALERTS,
  CAMPUSES,
  DOCUMENTS,
  KPI_SNAPSHOTS,
  LEADERSHIP,
  SUBJECT_GROUPS,
  TASKS,
  TOTAL_PARTY_MEMBERS,
} from '../data/mockData';
import type { Task, TaskStatus } from '../types';

function filterByCampus<T extends { campusId: string }>(items: T[], campusId: string) {
  return campusId === 'all' ? items : items.filter((i) => i.campusId === campusId || i.campusId === 'all');
}

const STATUS_META: Record<TaskStatus, { label: string; dot: string; text: string }> = {
  qua_han: { label: 'Quá hạn', dot: 'bg-signal-overdue', text: 'text-signal-overdue' },
  sap_den_han: { label: 'Sắp đến hạn', dot: 'bg-signal-soon', text: 'text-signal-soon' },
  chua_hoan_thanh: { label: 'Chưa hoàn thành', dot: 'bg-signal-pending', text: 'text-signal-pending' },
  cho_duyet: { label: 'Chờ duyệt', dot: 'bg-signal-review', text: 'text-signal-review' },
  hoan_thanh: { label: 'Hoàn thành', dot: 'bg-signal-done', text: 'text-signal-done' },
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-blue-700/60">{label}</p>
        <Icon size={16} className="text-blue-600" />
      </div>
      <p className="mt-2 text-2xl font-bold text-blue-950">{value}</p>
      {sub && <p className="text-xs text-blue-700/40 mt-0.5">{sub}</p>}
    </div>
  );
}

function StatusBucket({ status, tasks }: { status: TaskStatus; tasks: Task[] }) {
  const meta = STATUS_META[status];
  const items = tasks.filter((t) => t.status === status);
  return (
    <div className="rounded-xl border border-blue-100 bg-white p-4 min-w-[220px]">
      <div className="flex items-center gap-2 mb-3">
        <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
        <p className={`text-sm font-semibold ${meta.text}`}>{meta.label}</p>
        <span className="ml-auto text-xs font-medium text-blue-700/40">{items.length}</span>
      </div>
      <ul className="space-y-2">
        {items.slice(0, 3).map((t) => (
          <li key={t.id} className="text-xs text-ink/70 leading-snug">
            {t.title}
          </li>
        ))}
        {items.length === 0 && <li className="text-xs text-blue-700/30">Không có mục nào</li>}
      </ul>
    </div>
  );
}

export function Dashboard() {
  const { activeCampus } = useAuth();

  const tasks = filterByCampus(TASKS, activeCampus);
  const alerts = filterByCampus(ALERTS, activeCampus);
  const campuses = activeCampus === 'all' ? CAMPUSES : CAMPUSES.filter((c) => c.id === activeCampus);

  const totals = campuses.reduce(
    (acc, c) => ({
      teachers: acc.teachers + (c.teacherCount ?? 0),
      staff: acc.staff + (c.staffCount ?? 0),
      students: acc.students + c.studentCount,
      classes: acc.classes + c.classCount,
    }),
    { teachers: 0, staff: 0, students: 0, classes: 0 }
  );

  const overdueCount = tasks.filter((t) => t.status === 'qua_han').length;
  const pendingApproval = tasks.filter((t) => t.status === 'cho_duyet').length;
  const newDocs = DOCUMENTS.filter((d) => d.status === 'moi').length;
  const overallKpi = KPI_SNAPSHOTS.find((k) => k.scope === 'Toàn trường')?.score ?? 0;

  return (
    <div className="-m-6 p-6 bg-gradient-to-b from-sky-50 to-white space-y-6 min-h-full">
      <PageBanner />
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600">TRUNG TÂM ĐIỀU HÀNH</p>
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

      {/* Hôm nay Hiệu trưởng cần biết gì */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-blue-600" />
          <h3 className="font-semibold text-blue-900">Hôm nay Hiệu trưởng cần biết gì?</h3>
        </div>
        <ul className="space-y-2">
          <li className="text-sm text-blue-800/80">
            • <span className="font-medium text-blue-900">{overdueCount} nhiệm vụ quá hạn</span> cần xử lý ngay
            {activeCampus === 'all' ? '' : ` tại ${campuses[0]?.name}`}.
          </li>
          <li className="text-sm text-blue-800/80">
            • <span className="font-medium text-blue-900">{pendingApproval} việc đang chờ duyệt</span> — cần quyết định của Hiệu trưởng.
          </li>
          <li className="text-sm text-blue-800/80">
            • <span className="font-medium text-blue-900">{newDocs} văn bản đến mới</span> chưa được phân công xử lý.
          </li>
          <li className="text-sm text-blue-800/80">
            • KPI toàn trường hiện ở mức <span className="font-medium text-blue-900">{overallKpi}/100</span>.
          </li>
        </ul>
      </div>

      {/* Overview stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        <StatCard
          icon={Users}
          label="CB-GV-NV"
          value={totals.teachers + totals.staff}
          sub={campuses.some((c) => c.teacherCount === undefined) ? 'Chưa gồm Điểm 2 & 3 (chưa tách NS)' : undefined}
        />
        <StatCard icon={UserSquare2} label="Học sinh" value={totals.students.toLocaleString('vi-VN')} sub="Sĩ số đầu năm, 06/09/2026" />
        <StatCard icon={GraduationCap} label="Lớp" value={totals.classes} />
        <StatCard icon={Building2} label="Điểm trường" value={campuses.length} sub="3 điểm · 1 dữ liệu" />
        <StatCard icon={ClipboardList} label="Công việc" value={tasks.length} sub={`${overdueCount} quá hạn`} />
        <StatCard icon={FileText} label="Văn bản" value={DOCUMENTS.length} sub={`${newDocs} mới`} />
        <StatCard icon={Gauge} label="KPI (minh họa)" value={`${overallKpi}`} />
        <Link to="/dich-vu-cong" className="block">
          <StatCard icon={Globe2} label="Dịch vụ công" value="Xem yêu cầu" sub="PH · GV-NV · Trường lớp" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Wrench} label="Cơ sở vật chất" value="Bình thường" sub="0 sự cố mở" />
        <StatCard icon={Wallet} label="Tài chính" value="Đúng dự toán" sub="Xem chi tiết ở module Tài chính" />
        <StatCard icon={CalendarDays} label="Lịch công tác" value="3 sự kiện tuần này" />
        <StatCard icon={Users} label="Đảng bộ" value={`${TOTAL_PARTY_MEMBERS} đảng viên`} sub="7 chi bộ" />
      </div>

      {/* Status buckets */}
      <div>
        <h3 className="text-sm font-semibold text-blue-900/70 mb-3">Trạng thái công việc</h3>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {(['qua_han', 'sap_den_han', 'chua_hoan_thanh', 'cho_duyet', 'hoan_thanh'] as TaskStatus[]).map(
            (status) => (
              <StatusBucket key={status} status={status} tasks={tasks} />
            )
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Alerts */}
        <div className="rounded-xl border border-blue-100 bg-white p-4">
          <h3 className="text-sm font-semibold text-blue-900/70 mb-3">Cảnh báo</h3>
          <ul className="space-y-2.5">
            {alerts.map((a) => (
              <li key={a.id} className="flex items-start gap-2 text-sm">
                <span
                  className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                    a.level === 'do' ? 'bg-signal-overdue' : a.level === 'cam' ? 'bg-signal-soon' : 'bg-signal-pending'
                  }`}
                />
                <span className="text-ink/80">{a.message}</span>
              </li>
            ))}
            {alerts.length === 0 && <li className="text-sm text-blue-700/40">Không có cảnh báo nào.</li>}
          </ul>
        </div>

        {/* Subject groups snapshot */}
        <div className="rounded-xl border border-blue-100 bg-white p-4">
          <h3 className="text-sm font-semibold text-blue-900/70 mb-3">Tổ chuyên môn — Tổ trưởng</h3>
          <ul className="space-y-2">
            {SUBJECT_GROUPS.map((g) => (
              <li key={g.id} className="text-xs text-ink/70 flex justify-between gap-2">
                <span>{g.name}</span>
                <span className="text-blue-700/50 text-right">{g.ttcm ? g.ttcm.name : 'Chưa cập nhật'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
