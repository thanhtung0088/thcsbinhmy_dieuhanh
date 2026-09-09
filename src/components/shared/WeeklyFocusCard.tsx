import { useRef, useState } from 'react';
import mammoth from 'mammoth';
import { CalendarRange, Plus, Sparkles, Trash2, Loader2, X, FileText, Image as ImageIcon } from 'lucide-react';

// Năm học 2026-2027 áp dụng phân công chuyên môn từ 07/09/2026 (Thứ Hai)
// — dùng làm mốc Tuần 1 để tính ngày thật cho các tuần tiếp theo.
const WEEK1_START = new Date('2026-09-07T00:00:00');
const TOTAL_WEEKS = 35;
const WEEKDAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const NO_DAY = 'Chưa rõ ngày';

function weekDates(week: number) {
  const start = new Date(WEEK1_START);
  start.setDate(start.getDate() + (week - 1) * 7);
  const fmt = (d: Date) => d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return { label: `${WEEKDAY_NAMES[d.getDay()]} (${fmt(d)})`, date: fmt(d) };
  });
}

function weekRangeLabel(dates: { date: string }[], week: number) {
  return `${dates[0].date} - ${dates[6].date}/${new Date(WEEK1_START).getFullYear() + (week > 17 ? 1 : 0)}`;
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
  day: string; // nhãn ngày (vd "Thứ Ba (09/09)") hoặc NO_DAY
  time: string;
}

interface WeekData {
  items: FocusItem[];
}

interface PickedFile {
  file: File;
  kind: 'image' | 'pdf' | 'docx' | 'unsupported';
}

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

function classifyFile(file: File): PickedFile['kind'] {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'pdf';
  if (file.name.toLowerCase().endsWith('.docx')) return 'docx';
  return 'unsupported';
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '');
    reader.onerror = () => reject(new Error('Không đọc được tệp'));
    reader.readAsDataURL(file);
  });
}

export function WeeklyFocusCard() {
  const [week, setWeek] = useState(currentWeekNumber());
  const [dataByWeek, setDataByWeek] = useState<Record<number, WeekData>>({});
  const [draft, setDraft] = useState('');
  const [draftDay, setDraftDay] = useState('');
  const [picked, setPicked] = useState<PickedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dates = weekDates(week);
  const current: WeekData = dataByWeek[week] ?? { items: [] };

  function updateWeek(patch: Partial<WeekData>) {
    setDataByWeek((prev) => ({ ...prev, [week]: { ...current, ...patch } }));
  }

  function addItem() {
    if (!draft.trim()) return;
    updateWeek({ items: [...current.items, { id: newId(), text: draft.trim(), day: draftDay, time: '' }] });
    setDraft('');
  }

  function removeItem(id: string) {
    updateWeek({ items: current.items.filter((it) => it.id !== id) });
  }

  function handlePickFiles(list: FileList | null) {
    if (!list) return;
    const room = Math.max(0, 2 - picked.length);
    const next = Array.from(list)
      .slice(0, room)
      .map((file) => ({ file, kind: classifyFile(file) }));
    setPicked((prev) => [...prev, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleAnalyze() {
    if (picked.length === 0 || loading) return;
    setLoading(true);
    setError(null);
    setNote(null);
    try {
      const unsupported = picked.find((p) => p.kind === 'unsupported');
      if (unsupported) {
        throw new Error(`Tệp "${unsupported.file.name}" không đọc được — chỉ hỗ trợ Word (.docx), PDF, hoặc ảnh.`);
      }

      const texts: string[] = [];
      const files: { mimeType: string; data: string }[] = [];

      for (const p of picked) {
        if (p.kind === 'docx') {
          const buf = await p.file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer: buf });
          texts.push(result.value);
        } else {
          const data = await fileToBase64(p.file);
          files.push({ mimeType: p.file.type || (p.kind === 'pdf' ? 'application/pdf' : 'image/jpeg'), data });
        }
      }

      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'extract-tasks', texts, files, weekDates: dates }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Có lỗi xảy ra');
      const extracted: { task: string; day: string; time: string }[] = data.tasks || [];
      if (extracted.length === 0) {
        setNote('AI không tìm thấy công việc cụ thể nào trong tài liệu này.');
        return;
      }
      const validLabels = new Set(dates.map((d) => d.label));
      updateWeek({
        items: [
          ...current.items,
          ...extracted.map((t) => ({
            id: newId(),
            text: t.task,
            day: validLabels.has(t.day) ? t.day : '',
            time: t.time,
          })),
        ],
      });
      setNote(`AI đã lọc ra ${extracted.length} công việc trọng tâm từ tài liệu, xếp theo từng ngày bên dưới.`);
      setPicked([]);
    } catch (e: any) {
      setError(e?.message ?? 'Không phân tích được. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }

  // Nhóm công việc theo ngày để hiển thị
  const grouped = [...dates.map((d) => d.label), NO_DAY].map((label) => ({
    label,
    items: current.items.filter((it) => (it.day || NO_DAY) === label),
  }));

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
          Tuần {week} ({weekRangeLabel(dates, week)})
        </p>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {grouped.map((g) =>
            g.items.length === 0 ? null : (
              <div key={g.label}>
                <p className="text-[11px] font-semibold text-blue-700 mb-1">{g.label}</p>
                <ul className="space-y-1.5">
                  {g.items.map((it) => (
                    <li key={it.id} className="flex items-center justify-between gap-2 text-sm text-ink/80 bg-paper rounded-lg px-3 py-1.5">
                      <span className="min-w-0">
                        {it.text}
                        {it.time && <span className="ml-2 text-[11px] font-medium text-blue-700">🕒 {it.time}</span>}
                      </span>
                      <button onClick={() => removeItem(it.id)} className="text-ink/30 hover:text-red-600 shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
          {current.items.length === 0 && <p className="text-xs text-ink/30">Chưa có công việc nào.</p>}
        </div>

        <div className="flex gap-1.5">
          <select
            value={draftDay}
            onChange={(e) => setDraftDay(e.target.value)}
            className="rounded-lg border border-black/10 px-2 py-1.5 text-xs focus-ring shrink-0 max-w-[110px]"
          >
            <option value="">Chưa rõ ngày</option>
            {dates.map((d) => (
              <option key={d.label} value={d.label}>
                {d.label.split(' (')[0]}
              </option>
            ))}
          </select>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="Gõ công việc trọng tâm rồi Enter…"
            className="flex-1 min-w-0 rounded-lg border border-black/10 px-3 py-1.5 text-sm focus-ring"
          />
          <button onClick={addItem} className="rounded-lg bg-blue-600 text-white px-3 hover:bg-blue-700 shrink-0">
            <Plus size={15} />
          </button>
        </div>

        <div className="rounded-lg border border-dashed border-black/15 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-ink/60">Tải tài liệu để AI tự lọc việc (tối đa 2 tệp)</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={picked.length >= 2}
              className="h-7 w-7 rounded-full bg-hoa-950 text-white grid place-items-center hover:bg-hoa-800 disabled:opacity-30 shrink-0"
              aria-label="Thêm tệp"
            >
              <Plus size={15} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.pdf,image/*"
              multiple
              className="hidden"
              onChange={(e) => handlePickFiles(e.target.files)}
            />
          </div>

          {picked.length > 0 && (
            <ul className="space-y-1">
              {picked.map((p, i) => (
                <li key={i} className="flex items-center justify-between gap-2 text-[11px] text-ink/60 bg-paper rounded-md px-2 py-1">
                  <span className="flex items-center gap-1.5 min-w-0 truncate">
                    {p.kind === 'image' ? <ImageIcon size={12} className="shrink-0" /> : <FileText size={12} className="shrink-0" />}
                    <span className="truncate">{p.file.name}</span>
                    {p.kind === 'unsupported' && <span className="text-signal-overdue shrink-0">(không hỗ trợ)</span>}
                  </span>
                  <button onClick={() => setPicked((prev) => prev.filter((_, idx) => idx !== i))} className="text-ink/30 hover:text-red-600 shrink-0">
                    <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || picked.length === 0}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-hoa-950 text-white text-xs font-medium px-3 py-2 hover:bg-hoa-800 disabled:opacity-40"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} className="text-gold-400" />}
            {loading ? 'AI đang đọc tài liệu...' : 'Phân tích bằng AI'}
          </button>
        </div>

        {error && <p className="text-xs text-signal-overdue">{error}</p>}
        {note && <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">{note}</p>}
      </div>
    </div>
  );
}
