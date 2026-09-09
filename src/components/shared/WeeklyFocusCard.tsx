import { useState } from 'react';
import { CalendarRange, Plus, Sparkles, Trash2, Loader2, FileText, ChevronDown, ChevronUp } from 'lucide-react';

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

interface FocusItem {
  id: string;
  text: string;
  datetime: string;
}

interface WeekData {
  items: FocusItem[];
}

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

export function WeeklyFocusCard() {
  const [week, setWeek] = useState(currentWeekNumber());
  const [dataByWeek, setDataByWeek] = useState<Record<number, WeekData>>({});
  const [draft, setDraft] = useState('');
  const [showDocBox, setShowDocBox] = useState(false);
  const [docText, setDocText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const current: WeekData = dataByWeek[week] ?? { items: [] };

  function updateWeek(patch: Partial<WeekData>) {
    setDataByWeek((prev) => ({ ...prev, [week]: { ...current, ...patch } }));
  }

  function addItem() {
    if (!draft.trim()) return;
    updateWeek({ items: [...current.items, { id: newId(), text: draft.trim(), datetime: '' }] });
    setDraft('');
  }

  function removeItem(id: string) {
    updateWeek({ items: current.items.filter((it) => it.id !== id) });
  }

  async function handleExtract() {
    if (!docText.trim() || loading) return;
    setLoading(true);
    setError(null);
    setNote(null);
    try {
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'extract-tasks', text: docText }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Có lỗi xảy ra');
      const extracted: { task: string; datetime: string }[] = data.tasks || [];
      if (extracted.length === 0) {
        setNote('AI không tìm thấy công việc cụ thể nào trong văn bản này.');
        return;
      }
      updateWeek({
        items: [...current.items, ...extracted.map((t) => ({ id: newId(), text: t.task, datetime: t.datetime }))],
      });
      setNote(`AI đã lọc ra ${extracted.length} công việc trọng tâm từ văn bản, thêm vào danh sách bên dưới.`);
      setDocText('');
      setShowDocBox(false);
    } catch (e: any) {
      setError(e?.message ?? 'Không phân tích được. Thử lại sau.');
    } finally {
      setLoading(false);
    }
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
          {current.items.map((it) => (
            <li key={it.id} className="flex items-center justify-between gap-2 text-sm text-ink/80 bg-paper rounded-lg px-3 py-1.5">
              <span className="min-w-0">
                {it.text}
                {it.datetime && <span className="ml-2 text-[11px] font-medium text-blue-700">🕒 {it.datetime}</span>}
              </span>
              <button onClick={() => removeItem(it.id)} className="text-ink/30 hover:text-red-600 shrink-0">
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

        <button
          onClick={() => setShowDocBox((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-hoa-800 hover:text-hoa-950"
        >
          <FileText size={13} />
          Dán văn bản để AI tự lọc công việc
          {showDocBox ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showDocBox && (
          <div className="space-y-2 rounded-lg border border-black/10 p-3 bg-paper/60">
            <textarea
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              rows={5}
              placeholder="Dán nội dung thông báo/công văn/kế hoạch vào đây… AI sẽ tự lọc ra việc trọng tâm và ngày giờ thực hiện."
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-xs focus-ring resize-none"
            />
            <button
              onClick={handleExtract}
              disabled={loading || !docText.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-hoa-950 text-white text-xs font-medium px-3 py-1.5 hover:bg-hoa-800 disabled:opacity-40"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} className="text-gold-400" />}
              {loading ? 'AI đang đọc...' : 'Phân tích bằng AI'}
            </button>
          </div>
        )}

        {error && <p className="text-xs text-signal-overdue">{error}</p>}
        {note && <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{note}</p>}
      </div>
    </div>
  );
}
