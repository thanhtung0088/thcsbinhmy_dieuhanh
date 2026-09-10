import { useRef, useState } from 'react';
import mammoth from 'mammoth';
import { callGeminiApi } from '../../lib/geminiClient';
import { CalendarRange, Plus, Sparkles, Trash2, Loader2, X, FileText, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';

// Năm học 2026-2027 áp dụng phân công chuyên môn từ 07/09/2026 (Thứ Hai)
// — dùng làm mốc Tuần 1 để tính ngày thật cho các tuần tiếp theo.
const WEEK1_START = new Date('2026-09-07T00:00:00');
const TOTAL_WEEKS = 35;
const WEEKDAY_NAMES = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

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
}

interface WeekData {
  items: FocusItem[];
  aiSummary: string;
}

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

interface PickedFile {
  file: File;
  kind: 'image' | 'pdf' | 'docx' | 'unsupported';
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

// Render markdown đơn giản (## tiêu đề, - gạch đầu dòng, **đậm**) thành JSX
// — đủ dùng cho văn phong AI trả lời, không cần thư viện markdown nặng.
function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split('\n').filter((l) => l.trim());
  const renderBold = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="text-blue-700">{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const l = line.trim();
        if (l.startsWith('## ')) {
          return (
            <p key={i} className="text-xs font-bold text-blue-700 mt-2.5 first:mt-0">
              {l.slice(3)}
            </p>
          );
        }
        if (l.startsWith('- ') || l.startsWith('* ')) {
          return (
            <p key={i} className="text-sm text-ink/80 pl-3.5 relative before:content-['•'] before:absolute before:left-0 before:text-blue-400">
              {renderBold(l.slice(2))}
            </p>
          );
        }
        return (
          <p key={i} className="text-sm text-ink/80">
            {renderBold(l)}
          </p>
        );
      })}
    </div>
  );
}

export function WeeklyFocusCard() {
  const [week, setWeek] = useState(currentWeekNumber());
  const [dataByWeek, setDataByWeek] = useState<Record<number, WeekData>>({});
  const [draft, setDraft] = useState('');
  const [picked, setPicked] = useState<PickedFile[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dates = weekDates(week);
  const current: WeekData = dataByWeek[week] ?? { items: [], aiSummary: '' };

  function updateWeek(patch: Partial<WeekData>) {
    setDataByWeek((prev) => ({ ...prev, [week]: { ...current, ...patch } }));
  }

  function addItem() {
    if (!draft.trim()) return;
    updateWeek({ items: [...current.items, { id: newId(), text: draft.trim() }] });
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

      const data = await callGeminiApi<{ text: string }>({ mode: 'extract-tasks', texts, files, weekDates: dates });
      updateWeek({ aiSummary: data.text || '' });
      setPicked([]);
      setShowUpload(false);
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
          Tuần {week} ({weekRangeLabel(dates, week)})
        </p>

        {/* AI: tóm tắt việc cốt lõi từ tài liệu — hiển thị thẳng, không cần parse cấu trúc */}
        {current.aiSummary && (
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
            <p className="text-[11px] font-semibold text-blue-700 mb-1.5 flex items-center gap-1">
              <Sparkles size={12} /> AI tóm tắt từ tài liệu
            </p>
            <SimpleMarkdown text={current.aiSummary} />
          </div>
        )}

        <ul className="space-y-1.5">
          {current.items.length === 0 && !current.aiSummary && <li className="text-xs text-ink/30">Chưa có công việc nào.</li>}
          {current.items.map((it) => (
            <li key={it.id} className="flex items-center justify-between gap-2 text-sm text-ink/80 bg-paper rounded-lg px-3 py-1.5">
              <span className="min-w-0">{it.text}</span>
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
            className="flex-1 min-w-0 rounded-lg border border-black/10 px-3 py-1.5 text-sm focus-ring"
          />
          <button onClick={addItem} className="rounded-lg bg-blue-600 text-white px-3 hover:bg-blue-700 shrink-0">
            <Plus size={15} />
          </button>
        </div>

        <button
          onClick={() => setShowUpload((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-hoa-800 hover:text-hoa-950"
        >
          <FileText size={13} />
          Tải tài liệu để AI tự đọc &amp; tóm tắt
          {showUpload ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showUpload && (
          <div className="rounded-lg border border-dashed border-black/15 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-ink/60">Tối đa 2 tệp — Word (.docx), PDF, hoặc ảnh</p>
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
        )}

        {error && <p className="text-xs text-signal-overdue">{error}</p>}
      </div>
    </div>
  );
}
