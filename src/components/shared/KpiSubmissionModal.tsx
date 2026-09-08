import { useState } from 'react';
import { X, Plus, Trash2, Send } from 'lucide-react';
import { useKpi } from '../../context/KpiContext';
import type { KpiTaskItem } from '../../types/kpi';

const PROGRESS_OPTIONS = [
  { value: 1, label: 'Đúng hoặc trước hạn (100%)' },
  { value: 0.8, label: 'Chậm 1–3 ngày làm việc (80%)' },
  { value: 0.6, label: 'Chậm 4–5 ngày làm việc (60%)' },
  { value: 0, label: 'Chậm trên 5 ngày làm việc (0%)' },
];

const RESULT_OPTIONS = [
  { value: 1, label: 'Đạt đầy đủ yêu cầu (100%)' },
  { value: 0.8, label: 'Đạt yêu cầu, chỉnh sửa nhỏ (80%)' },
  { value: 0.6, label: 'Hoàn thành cơ bản (60%)' },
  { value: 0, label: 'Không đạt yêu cầu (0%)' },
];

function emptyTask(): KpiTaskItem {
  return {
    id: `task-${Math.random().toString(36).slice(2, 9)}`,
    name: '',
    standardPoints: 10,
    difficultyCoef: 1,
    progressPct: 1,
    resultPct: 1,
    completedEarly: false,
  };
}

export function KpiSubmissionModal({ onClose }: { onClose: () => void }) {
  const { addSubmission } = useKpi();
  const [teacherName, setTeacherName] = useState('');
  const [subjectGroup, setSubjectGroup] = useState('');
  const [campusName, setCampusName] = useState('');
  const [quarter, setQuarter] = useState('Quý III/2026');
  const [generalScore, setGeneralScore] = useState(30);
  const [tasks, setTasks] = useState<KpiTaskItem[]>([emptyTask()]);
  const [error, setError] = useState<string | null>(null);

  function updateTask(id: string, patch: Partial<KpiTaskItem>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function handleSubmit() {
    if (!teacherName.trim() || !subjectGroup.trim()) {
      setError('Vui lòng nhập tên giáo viên và tổ chuyên môn.');
      return;
    }
    const validTasks = tasks.filter((t) => t.name.trim());
    if (validTasks.length === 0) {
      setError('Vui lòng nhập ít nhất 1 công việc.');
      return;
    }
    addSubmission({ teacherName, subjectGroup, campusName, quarter, generalScore, tasks: validTasks });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[88vh] rounded-2xl bg-white shadow-2xl border border-black/10 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 shrink-0">
          <p className="text-sm font-bold text-ink">Nộp bản tự đánh giá KPI</p>
          <button onClick={onClose} className="text-ink/40 hover:text-ink" aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Họ và tên giáo viên *"
              className="rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring"
            />
            <input
              value={subjectGroup}
              onChange={(e) => setSubjectGroup(e.target.value)}
              placeholder="Tổ chuyên môn *"
              className="rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring"
            />
            <input
              value={campusName}
              onChange={(e) => setCampusName(e.target.value)}
              placeholder="Điểm trường"
              className="rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring"
            />
            <input
              value={quarter}
              onChange={(e) => setQuarter(e.target.value)}
              placeholder="Quý đánh giá, vd: Quý III/2026"
              className="rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-ink/60">
              Điểm nhóm tiêu chí chung (thang 30đ — phẩm chất, đạo đức, tự phê bình...)
            </label>
            <input
              type="number"
              min={0}
              max={30}
              value={generalScore}
              onChange={(e) => setGeneralScore(Number(e.target.value))}
              className="mt-1 w-28 rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink/70">Danh sách công việc trong quý</p>
              <button
                onClick={() => setTasks((prev) => [...prev, emptyTask()])}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <Plus size={13} /> Thêm công việc
              </button>
            </div>

            {tasks.map((t, idx) => (
              <div key={t.id} className="rounded-xl border border-black/10 p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-semibold text-ink/40 mt-2 shrink-0 w-4">{idx + 1}.</span>
                  <input
                    value={t.name}
                    onChange={(e) => updateTask(t.id, { name: e.target.value })}
                    placeholder="Tên công việc"
                    className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring"
                  />
                  <button
                    onClick={() => setTasks((prev) => prev.filter((x) => x.id !== t.id))}
                    className="text-ink/30 hover:text-signal-overdue shrink-0 mt-1.5"
                    aria-label="Xoá công việc"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pl-6">
                  <div>
                    <label className="text-[10px] text-ink/40">Điểm chuẩn</label>
                    <input
                      type="number"
                      min={0}
                      value={t.standardPoints}
                      onChange={(e) => updateTask(t.id, { standardPoints: Number(e.target.value) })}
                      className="w-full rounded-lg border border-black/10 px-2 py-1.5 text-xs focus-ring"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-ink/40">Hệ số độ khó</label>
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={t.difficultyCoef}
                      onChange={(e) => updateTask(t.id, { difficultyCoef: Number(e.target.value) })}
                      className="w-full rounded-lg border border-black/10 px-2 py-1.5 text-xs focus-ring"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[10px] text-ink/40">Tiến độ</label>
                    <select
                      value={t.progressPct}
                      onChange={(e) => updateTask(t.id, { progressPct: Number(e.target.value) })}
                      className="w-full rounded-lg border border-black/10 px-2 py-1.5 text-xs focus-ring"
                    >
                      {PROGRESS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[10px] text-ink/40">Kết quả</label>
                    <select
                      value={t.resultPct}
                      onChange={(e) => updateTask(t.id, { resultPct: Number(e.target.value) })}
                      className="w-full rounded-lg border border-black/10 px-2 py-1.5 text-xs focus-ring"
                    >
                      {RESULT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-1.5 pl-6 text-[11px] text-ink/60">
                  <input
                    type="checkbox"
                    checked={!!t.completedEarly}
                    onChange={(e) => updateTask(t.id, { completedEarly: e.target.checked })}
                  />
                  Hoàn thành trước hạn (tính vào điều kiện xét "Hoàn thành xuất sắc")
                </label>
              </div>
            ))}
          </div>

          {error && <p className="text-xs text-signal-overdue">{error}</p>}
        </div>

        <div className="p-3 border-t border-black/10 shrink-0">
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white py-2.5 text-sm font-semibold hover:bg-blue-700"
          >
            <Send size={15} /> Nộp bản tự đánh giá
          </button>
        </div>
      </div>
    </div>
  );
}
