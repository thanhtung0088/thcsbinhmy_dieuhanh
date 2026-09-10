import { useRef, useState } from 'react';
import mammoth from 'mammoth';
import {
  FileSearch,
  Plus,
  X,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  Send,
  BookOpen,
  ArrowRightCircle,
  ArrowUpDown,
  Search,
} from 'lucide-react';

interface Source {
  id: string;
  name: string;
  kind: 'image' | 'pdf' | 'docx' | 'unsupported';
  file: File;
  addedAt: number;
  extractedText?: string; // docx đã trích chữ
  base64?: string; // ảnh/pdf gửi thẳng cho Gemini
  mimeType?: string;
  summary?: string; // tóm tắt riêng của file này
  summarizing?: boolean;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const MAX_SOURCES = 5;

function classifyFile(file: File): Source['kind'] {
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

function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split('\n').filter((l) => l.trim());
  const renderBold = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="text-hoa-900">{part.slice(2, -2)}</strong>
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
            <p key={i} className="text-xs font-bold text-hoa-900 mt-3 first:mt-0">
              {l.slice(3)}
            </p>
          );
        }
        if (l.startsWith('- ') || l.startsWith('* ')) {
          return (
            <p key={i} className="text-sm text-ink/80 pl-3.5 relative before:content-['•'] before:absolute before:left-0 before:text-hoa-400">
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

export function PhanTichVanBanAi() {
  const [sources, setSources] = useState<Source[]>([]);
  const [processing, setProcessing] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const summaryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  async function handlePickFiles(list: FileList | null) {
    if (!list) return;
    const room = Math.max(0, MAX_SOURCES - sources.length);
    const picked = Array.from(list).slice(0, room);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setProcessing(true);
    setError(null);
    try {
      const newSources: Source[] = [];
      for (const file of picked) {
        const kind = classifyFile(file);
        const src: Source = { id: Math.random().toString(36).slice(2, 9), name: file.name, kind, file, addedAt: Date.now() };
        if (kind === 'docx') {
          const buf = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer: buf });
          src.extractedText = result.value;
        } else if (kind === 'image' || kind === 'pdf') {
          src.base64 = await fileToBase64(file);
          src.mimeType = file.type || (kind === 'pdf' ? 'application/pdf' : 'image/jpeg');
        }
        newSources.push(src);
      }
      setSources((prev) => [...prev, ...newSources]);
      setSummary('');
      setMessages([]);
    } catch (e: any) {
      setError(e?.message ?? 'Không đọc được tệp vừa tải lên.');
    } finally {
      setProcessing(false);
    }
  }

  function removeSource(id: string) {
    setSources((prev) => prev.filter((s) => s.id !== id));
    setSummary('');
    setMessages([]);
  }

  function payloadOf(list: Source[]) {
    const texts = list.filter((s) => s.extractedText).map((s) => s.extractedText!);
    const files = list.filter((s) => s.base64 && s.mimeType).map((s) => ({ mimeType: s.mimeType!, data: s.base64! }));
    return { texts, files };
  }

  async function handleSummarize() {
    if (sources.length === 0 || summaryLoading) return;
    setSummaryLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'notebook', isSummary: true, ...payloadOf(sources) }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Có lỗi xảy ra');
      setSummary(data.text || '');
    } catch (e: any) {
      setError(e?.message ?? 'Không tóm tắt được. Thử lại sau.');
    } finally {
      setSummaryLoading(false);
    }
  }

  // Bấm mũi tên ở 1 file: nếu file đó chưa có tóm tắt riêng thì gọi AI phân
  // tích riêng file đó, rồi cuộn xuống đúng khối tóm tắt của file này.
  async function handleJumpToFileSummary(id: string) {
    const src = sources.find((s) => s.id === id);
    if (!src) return;

    if (!src.summary && !src.summarizing) {
      setSources((prev) => prev.map((s) => (s.id === id ? { ...s, summarizing: true } : s)));
      setError(null);
      try {
        const resp = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'notebook', isSummary: true, ...payloadOf([src]) }),
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data?.error || 'Có lỗi xảy ra');
        setSources((prev) => prev.map((s) => (s.id === id ? { ...s, summary: data.text || '', summarizing: false } : s)));
      } catch (e: any) {
        setError(e?.message ?? 'Không phân tích được tệp này. Thử lại sau.');
        setSources((prev) => prev.map((s) => (s.id === id ? { ...s, summarizing: false } : s)));
        return;
      }
    }

    setTimeout(() => {
      summaryRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  async function handleAsk() {
    const q = question.trim();
    if (!q || sources.length === 0 || loading) return;
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'notebook', message: q, ...payloadOf(sources) }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Có lỗi xảy ra');
      setMessages((prev) => [...prev, { role: 'ai', text: data.text || '' }]);
    } catch (e: any) {
      setError(e?.message ?? 'Không trả lời được. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }

  const visibleSources = sources
    .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sortNewestFirst ? b.addedAt - a.addedAt : a.addedAt - b.addedAt));

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wide text-hoa-800">PHÂN TÍCH VĂN BẢN AI</p>
        <h2 className="text-xl font-bold text-ink mt-0.5">Đọc tài liệu &amp; hỏi đáp bằng AI</h2>
        <p className="text-xs text-ink/50 mt-1 max-w-xl">
          Giống NotebookLM: tải tối đa {MAX_SOURCES} tài liệu (Word, PDF, ảnh) làm "nguồn", AI phân tích sâu, chỉ
          dựa trên đúng nội dung tài liệu — không suy đoán ngoài tài liệu.
        </p>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-4">
        {/* Cột trái: danh sách nguồn */}
        <div className="rounded-xl border border-black/10 bg-white p-3 space-y-3 h-fit">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-ink/60">Nguồn tài liệu ({sources.length}/{MAX_SOURCES})</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={sources.length >= MAX_SOURCES || processing}
              className="h-7 w-7 rounded-full bg-hoa-950 text-white grid place-items-center hover:bg-hoa-800 disabled:opacity-30"
              aria-label="Thêm nguồn"
            >
              {processing ? <Loader2 size={13} className="animate-spin" /> : <Plus size={15} />}
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

          {sources.length > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex-1 flex items-center gap-1.5 rounded-lg border border-black/10 px-2 py-1.5">
                <Search size={12} className="text-ink/30 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm công văn theo tên..."
                  className="flex-1 min-w-0 text-xs focus:outline-none"
                />
              </div>
              <button
                onClick={() => setSortNewestFirst((v) => !v)}
                title={sortNewestFirst ? 'Đang xếp: Mới nhất trước' : 'Đang xếp: Cũ nhất trước'}
                className="flex items-center gap-1 rounded-lg border border-black/10 px-2 py-1.5 text-[10px] text-ink/50 hover:border-hoa-700 shrink-0"
              >
                <ArrowUpDown size={12} />
                {sortNewestFirst ? 'Mới→Cũ' : 'Cũ→Mới'}
              </button>
            </div>
          )}

          {sources.length === 0 ? (
            <p className="text-xs text-ink/30 text-center py-6">Chưa có nguồn nào. Bấm "+" để tải tài liệu lên.</p>
          ) : visibleSources.length === 0 ? (
            <p className="text-xs text-ink/30 text-center py-6">Không tìm thấy tài liệu nào khớp.</p>
          ) : (
            <ul className="space-y-1.5">
              {visibleSources.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-1.5 bg-paper rounded-lg px-2.5 py-2">
                  <span className="flex items-center gap-1.5 min-w-0 text-xs text-ink/70">
                    {s.kind === 'image' ? <ImageIcon size={13} className="shrink-0" /> : <FileText size={13} className="shrink-0" />}
                    <span className="truncate">{s.name}</span>
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleJumpToFileSummary(s.id)}
                      title="Xem AI phân tích tệp này"
                      className="text-hoa-700 hover:text-hoa-950"
                    >
                      {s.summarizing ? <Loader2 size={14} className="animate-spin" /> : <ArrowRightCircle size={14} />}
                    </button>
                    <button onClick={() => removeSource(s.id)} className="text-ink/30 hover:text-red-600">
                      <X size={13} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleSummarize}
            disabled={sources.length === 0 || summaryLoading}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-hoa-950 text-white text-xs font-medium px-3 py-2 hover:bg-hoa-800 disabled:opacity-40"
          >
            {summaryLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} className="text-gold-400" />}
            Tóm tắt tất cả nguồn
          </button>
        </div>

        {/* Cột phải: tóm tắt (tổng + từng file) + hỏi đáp */}
        <div className="rounded-xl border border-black/10 bg-white flex flex-col overflow-hidden min-h-[420px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[70vh]">
            {sources.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <BookOpen size={28} className="text-ink/20 mb-2" />
                <p className="text-sm text-ink/40 max-w-xs">
                  Tải tài liệu ở cột bên trái để bắt đầu — AI sẽ phân tích sâu và trả lời câu hỏi dựa trên đúng nội
                  dung tài liệu, không bịa thêm.
                </p>
              </div>
            )}

            {summary && (
              <div className="rounded-lg border border-hoa-100 bg-hoa-50/40 p-3">
                <p className="text-[11px] font-semibold text-hoa-800 mb-1.5 flex items-center gap-1">
                  <FileSearch size={12} /> Tóm tắt tất cả nguồn
                </p>
                <SimpleMarkdown text={summary} />
              </div>
            )}

            {sources.filter((s) => s.summary).map((s) => (
              <div
                key={s.id}
                ref={(el) => (summaryRefs.current[s.id] = el)}
                className="rounded-lg border border-blue-100 bg-blue-50/30 p-3 scroll-mt-4"
              >
                <p className="text-[11px] font-semibold text-blue-700 mb-1.5 flex items-center gap-1">
                  <FileText size={12} /> {s.name}
                </p>
                <SimpleMarkdown text={s.summary!} />
              </div>
            ))}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-paper text-ink border border-black/5'
                  }`}
                >
                  {m.role === 'ai' ? <SimpleMarkdown text={m.text} /> : m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 text-xs text-ink/40">
                <Loader2 size={13} className="animate-spin" /> AI đang đọc tài liệu...
              </div>
            )}
            {error && <p className="text-xs text-signal-overdue">{error}</p>}
          </div>

          <div className="p-2.5 border-t border-black/10 flex items-center gap-2 shrink-0 bg-white">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              disabled={sources.length === 0}
              placeholder={sources.length === 0 ? 'Tải tài liệu trước đã...' : 'Hỏi gì đó về tài liệu vừa tải...'}
              className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring disabled:bg-paper disabled:cursor-not-allowed"
            />
            <button
              onClick={handleAsk}
              disabled={!question.trim() || sources.length === 0 || loading}
              className="h-9 w-9 rounded-lg bg-blue-600 text-white grid place-items-center disabled:opacity-40"
              aria-label="Gửi"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
