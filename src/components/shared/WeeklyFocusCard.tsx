import { useMemo, useState } from 'react';
import { CalendarRange, Paperclip, Plus, Sparkles, Trash2, X } from 'lucide-react';

// Năm học 2026-2027 áp dụng phân công chuyên môn từ 07/09/2026 (Thứ Hai)
// — dùng làm mốc Tuần 1 để tính ngày thật cho các tuần tiếp theo.
const WEEK1_START = new Date('2026-09-07T00:00:00');
const TOTAL_WEEKS = 35;

function weekRange(week: number) {
  const start = new Date(WEEK1_START);
  start.setDate(start.getDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  return `${fmt(start)} - ${fmt(end)}/${end.getFullYear()}`;
}

function currentWeekNumber() {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - WEEK1_START.getTime()) / 86400000);
  const w = Math.floor(diffDays / 7) + 1;
  return Math.min(Math.max(w, 1), TOTAL_WEEKS);
}

interface WeekData {
  items: string[];
  files: string[];
}

export function WeeklyFocusCard() {
  const [week, setWeek] = useState(currentWeekNumber());
  const [dataByWeek, setDataByWeek] = useState<Record<number, WeekData>>({});
  const [draft, setDraft] = useState('');
  const [analysisNote, setAnalysisNote] = useState<string | null>(null);

  const current: WeekData = dataByWeek[week] ?? { items: [], files: [] };

  function updateWeek(patch: Partial<WeekData>) {
    setDataByWeek((prev) => ({ ...prev, [week]: { ...current, ...patch } }));
  }

  function addItem() {
    if (!draft.trim()) return;
    updateWeek({ items: [...current.items, draft.trim()] });
    setDraft('');
  }

  function removeItem(i: number) {
    updateWeek({ items: current.items.filter((_, idx) => idx !== i) });
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const names = Array.from(fileList)
      .slice(0, Math.max(0, 5 - current.files.length))
      .map((f) => f.name);
    updateWeek({ files: [...current.files, ...names] });
  }

  function handleAnalyze() {
    if (current.items.length === 0 && current.files.length === 0) {
      setAnalysisNote('Chưa có dữ liệu để phân tích — hãy nhập công việc hoặc đính kèm tài liệu trước.');
      return;
    }
    if (current.files.length > 0 && current.items.length === 0) {
      setAnalysisNote(
        `Đã lưu ${current.files.length} tệp làm minh chứng. Hệ thống hiện chưa nối AI thật để tự đọc nội dung file (cần backend, xem Phase 6) — vui lòng nhập tay các công việc trọng tâm để hiển thị ngay.`
      );
      return;
    }
    setAnalysisNote(
      `Gợi ý tự động (rule-based, chưa phải AI thật): ${current.items.length} công việc đã liệt kê cho Tuần ${week}. Việc có từ khóa "gấp/hạn/khẩn" nên ưu tiên xử lý trước.`
    );
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-3 bg-blue-600 text-white">
        <div className="flex items-center gap-2">
          <CalendarRange size={16} />
          <p className="text-sm font-semibold">Công việc trọng tâm trong tuần</p>
        </div>
        <select
          value={week}
          onChange={(e) => setWeek(Number(e.target.value))}
          className="rounded-md bg-white/15 text-white text-xs px-2 py-1 border border-white/20 focus:outline-none"
        >
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map((w) => (
            <option key={w} value={w} className="text-ink">
              Tuần {w}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-xs text-ink/50">
          Tuần {week} ({weekRange(week)})
        </p>

        <ul className="space-y-1.5">
          {current.items.length === 0 && <li className="text-xs text-ink/30">Chưa có công việc nào.</li>}
          {current.items.map((it, i) => (
            <li key={i} className="flex items-center justify-between gap-2 text-sm text-ink/80 bg-paper rounded-lg px-3 py-1.5">
              <span>{it}</span>
              <button onClick={() => removeItem(i)} className="text-ink/30 hover:text-red-600 shrink-0">
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>

        <div className="flex gap-1.5">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="Gõ công việc trọng tâm rồi Enter…"
            className="flex-1 rounded-lg border border-black/10 px-3 py-1.5 text-sm focus-ring"
          />
          <button onClick={addItem} className="rounded-lg bg-blue-600 text-white px-3 hover:bg-blue-700">
            <Plus size={15} />
          </button>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
            <Paperclip size={13} />
            Nạp tài liệu (tối đa 5 · Word/PDF/ảnh)
            <input
              type="file"
              multiple
              accept=".doc,.docx,.pdf,image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={current.files.length >= 5}
            />
          </label>
          <button
            onClick={handleAnalyze}
            className="flex items-center gap-1.5 rounded-lg bg-hoa-950 text-white text-xs font-medium px-3 py-1.5 hover:bg-hoa-800"
          >
            <Sparkles size={13} className="text-gold-400" /> Phân tích
          </button>
        </div>

        {current.files.length > 0 && (
          <ul className="space-y-1">
            {current.files.map((f, i) => (
              <li key={i} className="flex items-center justify-between text-[11px] text-ink/50">
                <span className="truncate">📎 {f}</span>
                <button
                  onClick={() => updateWeek({ files: current.files.filter((_, idx) => idx !== i) })}
                  className="text-ink/30 hover:text-red-600 shrink-0"
                >
                  <X size={12} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {analysisNote && <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">{analysisNote}</p>}
      </div>
    </div>
  );
}
