import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Building2, GraduationCap, UserSquare2, Users } from 'lucide-react';
import { CAMPUSES, LEADERSHIP, SUBJECT_GROUPS, TASKS, ALERTS, TOTAL_STUDENTS } from '../data/mockData';
import { CLASSES } from '../data/classes';

const GRADE_COLORS: Record<number, string> = { 6: 'bg-blue-500', 7: 'bg-emerald-500', 8: 'bg-amber-500', 9: 'bg-rose-500' };

export function CampusDetail() {
  const { campusId } = useParams<{ campusId: string }>();
  const campus = CAMPUSES.find((c) => c.id === campusId);

  if (!campus) return <Navigate to="/diem-truong" replace />;

  const head = LEADERSHIP.find((l) => l.campusId === campus.id);
  const classes = CLASSES.filter((c) => c.campusId === campus.id);
  const grades = [6, 7, 8, 9] as const;
  const maxGradeTotal = Math.max(...grades.map((g) => classes.filter((c) => c.grade === g).reduce((s, c) => s + c.total, 0)), 1);

  const scopedTasks = TASKS.filter((t) => t.campusId === campus.id || t.campusId === 'all');
  const scopedAlerts = ALERTS.filter((a) => a.campusId === campus.id || a.campusId === 'all');
  const groupsHere = SUBJECT_GROUPS.filter(
    (g) => g.ttcm?.campusId === campus.id || g.tpcm.some((p) => p.campusId === campus.id)
  );

  const cbgvnv = campus.teacherCount !== undefined && campus.staffCount !== undefined ? campus.teacherCount + campus.staffCount : null;

  return (
    <div className="space-y-5">
      <Link to="/diem-truong" className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700">
        <ArrowLeft size={15} /> Quay lại 4 điểm trường
      </Link>

      <div className="rounded-xl bg-hoa-950 text-white p-5 flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-white/10 grid place-items-center shrink-0">
          <Building2 size={26} />
        </div>
        <div>
          <p className="text-xs text-gold-400 font-semibold tracking-wide">TRUNG TÂM ĐIỀU HÀNH</p>
          <h1 className="text-xl font-bold">
            {campus.name} — {campus.formerName}
          </h1>
          <p className="text-sm text-white/60 mt-0.5">
            {head ? `${head.title}: ${head.name}` : 'Chưa bổ nhiệm Phó Hiệu trưởng phụ trách'} · Lớp ký hiệu "{campus.classLetter}"
          </p>
        </div>
      </div>

      {campus.note && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-xs px-4 py-2.5">{campus.note}</div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-black/10 bg-white p-4 text-center">
          <Users size={16} className="mx-auto text-hoa-700" />
          <p className="text-xl font-bold text-ink mt-1">{cbgvnv ?? 'Chưa cập nhật'}</p>
          <p className="text-[11px] text-ink/40">CB-GV-NV</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4 text-center">
          <UserSquare2 size={16} className="mx-auto text-hoa-700" />
          <p className="text-xl font-bold text-ink mt-1">{campus.studentCount.toLocaleString('vi-VN')}</p>
          <p className="text-[11px] text-ink/40">Học sinh ({((campus.studentCount / TOTAL_STUDENTS) * 100).toFixed(1)}% toàn trường)</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4 text-center">
          <GraduationCap size={16} className="mx-auto text-hoa-700" />
          <p className="text-xl font-bold text-ink mt-1">{campus.classCount}</p>
          <p className="text-[11px] text-ink/40">Lớp</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4 text-center">
          <Building2 size={16} className="mx-auto text-hoa-700" />
          <p className="text-xl font-bold text-ink mt-1">{groupsHere.length}</p>
          <p className="text-[11px] text-ink/40">Tổ có TTCM/TPCM tại điểm</p>
        </div>
      </div>

      {/* Student distribution by grade — real data */}
      <div className="rounded-xl border border-black/10 bg-white p-4">
        <p className="text-sm font-semibold text-ink/70 mb-3">Sĩ số theo khối (06/09/2026)</p>
        <div className="space-y-2.5">
          {grades.map((g) => {
            const gradeClasses = classes.filter((c) => c.grade === g);
            if (gradeClasses.length === 0) return null;
            const total = gradeClasses.reduce((s, c) => s + c.total, 0);
            return (
              <div key={g} className="flex items-center gap-3">
                <span className="text-xs font-medium text-ink/60 w-14 shrink-0">Khối {g}</span>
                <div className="flex-1 h-4 rounded-full bg-black/5 overflow-hidden">
                  <div
                    className={`h-full ${GRADE_COLORS[g]} rounded-full`}
                    style={{ width: `${(total / maxGradeTotal) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-ink w-24 text-right shrink-0">
                  {total} hs · {gradeClasses.length} lớp
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <p className="text-sm font-semibold text-ink/70 mb-3">Nhiệm vụ tại điểm</p>
          {scopedTasks.length === 0 ? (
            <p className="text-sm text-ink/40 py-4 text-center">Không có nhiệm vụ nào.</p>
          ) : (
            <ul className="space-y-2">
              {scopedTasks.map((t) => (
                <li key={t.id} className="text-sm text-ink/80 flex justify-between gap-2">
                  <span>{t.title}</span>
                  <span className="text-ink/40 shrink-0">{t.dueDate}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <p className="text-sm font-semibold text-ink/70 mb-3">Cảnh báo tại điểm</p>
          {scopedAlerts.length === 0 ? (
            <p className="text-sm text-ink/40 py-4 text-center">Không có cảnh báo nào.</p>
          ) : (
            <ul className="space-y-2">
              {scopedAlerts.map((a) => (
                <li key={a.id} className="text-sm text-ink/80">{a.message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4">
        <p className="text-sm font-semibold text-ink/70 mb-3">Tổ chuyên môn có TTCM/TPCM tại điểm này</p>
        <ul className="grid sm:grid-cols-2 gap-2">
          {groupsHere.map((g) => {
            const person =
              g.ttcm?.campusId === campus.id
                ? { name: g.ttcm.name, role: 'Tổ trưởng' }
                : g.tpcm.find((p) => p.campusId === campus.id)!;
            return (
              <li key={g.id} className="text-xs text-ink/70 flex justify-between border border-black/5 rounded-lg px-3 py-2">
                <span>Tổ {g.name}</span>
                <span className="text-ink/40">
                  {'role' in person ? person.role : 'Tổ phó'}: {person.name}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
