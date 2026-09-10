import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LayoutGrid, UserCircle2, ClipboardList, CalendarClock, Award, ChevronLeft } from 'lucide-react';
import { CLASSES } from '../data/classes';
import { CAMPUSES } from '../data/mockData';
import { useGvcn } from '../context/GvcnContext';
import { SeatingChart } from '../components/gvcn/SeatingChart';
import { StudentRecords } from '../components/gvcn/StudentRecords';
import { MeetingNotes } from '../components/gvcn/MeetingNotes';
import { WeeklyPlan } from '../components/gvcn/WeeklyPlan';
import { AiRemarks } from '../components/gvcn/AiRemarks';

const TABS = [
  { key: 'so-do', label: 'Sơ đồ lớp', icon: LayoutGrid },
  { key: 'ho-so', label: 'Hồ sơ HS', icon: UserCircle2 },
  { key: 'bien-ban', label: 'Biên bản & Hội họp', icon: ClipboardList },
  { key: 'ke-hoach', label: 'Kế hoạch tuần/tháng', icon: CalendarClock },
  { key: 'thi-dua', label: 'Thi đua & nhận xét AI', icon: Award },
] as const;

export function GvcnWorkspace() {
  const { className } = useParams<{ className: string }>();
  const { getClassData } = useGvcn();
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('so-do');

  const cls = CLASSES.find((c) => c.name === className);
  const campus = cls ? CAMPUSES.find((c) => c.id === cls.campusId) : undefined;
  const data = className ? getClassData(className) : undefined;

  if (!cls || !className) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-ink/50">Không tìm thấy lớp này.</p>
        <Link to="/gvcn" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
          ← Quay lại danh sách GVCN
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Link to="/gvcn" className="flex items-center gap-1 text-xs text-ink/40 hover:text-ink mb-2">
          <ChevronLeft size={13} /> Danh sách GVCN
        </Link>
        <p className="text-xs font-semibold tracking-wide text-blue-600">LỚP CHỦ NHIỆM</p>
        <h2 className="text-xl font-bold text-ink mt-0.5 uppercase">{className}</h2>
        <p className="text-xs text-ink/50 mt-1">
          {campus?.name} · {cls.total} học sinh · GVCN: {data?.gvcnName || 'chưa phân công'}
        </p>
      </div>

      <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
        <div className="flex items-center gap-1 overflow-x-auto border-b border-black/10 bg-paper/60 px-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3.5 py-3 text-xs font-semibold border-b-2 shrink-0 transition-colors ${
                tab === t.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-ink/40 hover:text-ink/70'
              }`}
            >
              <t.icon size={14} />
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === 'so-do' && <SeatingChart className={className} total={cls.total} />}
          {tab === 'ho-so' && <StudentRecords className={className} />}
          {tab === 'bien-ban' && <MeetingNotes className={className} />}
          {tab === 'ke-hoach' && <WeeklyPlan className={className} />}
          {tab === 'thi-dua' && <AiRemarks className={className} />}
        </div>
      </div>
    </div>
  );
}
