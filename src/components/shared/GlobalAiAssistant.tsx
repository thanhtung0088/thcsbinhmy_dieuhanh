import { useEffect, useRef, useState } from 'react';
import mammoth from 'mammoth';
import {
  Bot, X, Send, Loader2, FileText, ChevronLeft, Download, FileType, Presentation,
  Plus, Image as ImageIcon,
} from 'lucide-react';
import { useAiAssistant } from '../../context/AiAssistantContext';
import { getPersona } from '../../data/aiPersonas';
import { SimpleMarkdown } from './SimpleMarkdown';
import { GVBM_TEMPLATES, type GvbmTemplate } from '../../data/gvbmTemplates';
import { exportToDocx, exportToPdf, exportToPptx } from '../../lib/exportDoc';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  docTitle?: string; // nếu tin nhắn AI này là kết quả soạn theo mẫu -> cho phép xuất file
}

interface RefFile {
  file: File;
  kind: 'image' | 'pdf' | 'docx' | 'unsupported';
}

const DEFAULT_GREETING = 'Chào thầy/cô! Em là Trợ lý điều hành AI của Trạm Điều Hành. Thầy/cô cần hỏi gì?';
const DEFAULT_SUGGESTIONS = [
  'Tuần này có việc gì cần ưu tiên?',
  'Tổng học sinh toàn trường bao nhiêu?',
  'Có nhiệm vụ nào đang quá hạn không?',
];

function classifyFile(file: File): RefFile['kind'] {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'pdf';
  if (file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.pptx')) return 'docx';
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

function ExportMenu({ text, title }: { text: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  async function handleExport(kind: 'docx' | 'pdf' | 'pptx') {
    setBusy(kind);
    try {
      if (kind === 'docx') await exportToDocx(text, title);
      else if (kind === 'pdf') await exportToPdf(text, title);
      else await exportToPptx(text, title);
    } finally {
      setBusy(null);
      setOpen(false);
    }
  }

  return (
    <div className="relative mt-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700 hover:text-blue-900 border border-blue-200 bg-blue-50 rounded-lg px-2.5 py-1"
      >
        <Download size={12} /> Xuất file
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-1 z-20 rounded-lg border border-black/10 bg-white shadow-xl overflow-hidden w-40">
            <button onClick={() => handleExport('docx')} disabled={!!busy} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-paper disabled:opacity-40">
              {busy === 'docx' ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} className="text-blue-600" />} Word (.docx)
            </button>
            <button onClick={() => handleExport('pdf')} disabled={!!busy} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-paper disabled:opacity-40 border-t border-black/5">
              {busy === 'pdf' ? <Loader2 size={13} className="animate-spin" /> : <FileType size={13} className="text-red-600" />} PDF (.pdf)
            </button>
            <button onClick={() => handleExport('pptx')} disabled={!!busy} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-paper disabled:opacity-40 border-t border-black/5">
              {busy === 'pptx' ? <Loader2 size={13} className="animate-spin" /> : <Presentation size={13} className="text-amber-600" />} PowerPoint (.pptx)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function GvbmForm({
  template,
  onCancel,
  onSubmit,
}: {
  template: GvbmTemplate;
  onCancel: () => void;
  onSubmit: (values: Record<string, string>, refFiles: RefFile[]) => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    template.fields.forEach((f) => (init[f.key] = f.defaultValue ?? ''));
    return init;
  });
  const [refFiles, setRefFiles] = useState<RefFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePickFiles(list: FileList | null) {
    if (!list) return;
    const room = Math.max(0, 3 - refFiles.length);
    const next = Array.from(list).slice(0, room).map((file) => ({ file, kind: classifyFile(file) }));
    setRefFiles((prev) => [...prev, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-3 space-y-2.5">
      <button onClick={onCancel} className="flex items-center gap-1 text-xs text-ink/40 hover:text-ink">
        <ChevronLeft size={13} /> Chọn mẫu khác
      </button>
      <p className="text-sm font-semibold text-ink">{template.label}</p>
      <div className="space-y-2">
        {template.fields.map((f) => (
          <div key={f.key}>
            <label className="text-[11px] text-ink/50">{f.label}</label>
            {f.type === 'select' ? (
              <select
                value={values[f.key]}
                onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="mt-0.5 w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm focus-ring"
              >
                <option value="">— Chọn —</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea
                value={values[f.key]}
                onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                rows={2}
                className="mt-0.5 w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm focus-ring resize-none"
              />
            ) : (
              <input
                type={f.type === 'number' ? 'number' : 'text'}
                value={values[f.key]}
                onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="mt-0.5 w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm focus-ring"
              />
            )}
          </div>
        ))}

        <div>
          <div className="flex items-center justify-between">
            <label className="text-[11px] text-ink/50">Tài liệu mẫu tham khảo (không bắt buộc, tối đa 3 tệp)</label>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={refFiles.length >= 3}
              className="h-6 w-6 rounded-full bg-hoa-950 text-white grid place-items-center hover:bg-hoa-800 disabled:opacity-30 shrink-0"
              aria-label="Thêm tệp mẫu"
            >
              <Plus size={13} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.pdf,.pptx,image/*"
              multiple
              className="hidden"
              onChange={(e) => handlePickFiles(e.target.files)}
            />
          </div>
          {refFiles.length > 0 && (
            <ul className="mt-1.5 space-y-1">
              {refFiles.map((rf, i) => (
                <li key={i} className="flex items-center justify-between gap-2 text-[11px] text-ink/60 bg-paper rounded-md px-2 py-1">
                  <span className="flex items-center gap-1.5 min-w-0 truncate">
                    {rf.kind === 'image' ? <ImageIcon size={12} className="shrink-0" /> : <FileText size={12} className="shrink-0" />}
                    <span className="truncate">{rf.file.name}</span>
                    {rf.kind === 'unsupported' && <span className="text-signal-overdue shrink-0">(không hỗ trợ)</span>}
                  </span>
                  <button onClick={() => setRefFiles((prev) => prev.filter((_, idx) => idx !== i))} className="text-ink/30 hover:text-red-600 shrink-0">
                    <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <button
        onClick={() => onSubmit(values, refFiles)}
        className="w-full rounded-lg bg-hoa-950 text-white text-sm font-medium py-2 hover:bg-hoa-800"
      >
        AI soạn ngay
      </button>
    </div>
  );
}

export function GlobalAiAssistant() {
  const { open, persona, closeAssistant } = useAiAssistant();
  const activePersona = getPersona(persona ?? undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'ai', text: DEFAULT_GREETING }]);
  const [personaShown, setPersonaShown] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gvbmTemplate, setGvbmTemplate] = useState<GvbmTemplate | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const key = persona ?? '__default__';
    if (key !== personaShown) {
      setMessages([{ role: 'ai', text: activePersona?.greeting ?? DEFAULT_GREETING }]);
      setError(null);
      setGvbmTemplate(null);
      setPersonaShown(key);
    }
  }, [open, persona]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open, gvbmTemplate, loading]);

  async function send(text: string, docTitle?: string, files?: { mimeType: string; data: string }[], texts?: string[]) {
    const q = text.trim();
    if (!q || loading) return;
    setMessages((prev) => [...prev, { role: 'user', text: q }, { role: 'ai', text: '', docTitle }]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'ops-chat', message: q, persona: persona ?? undefined, files, texts }),
      });

      if (!resp.ok || !resp.body) {
        const raw = await resp.text().catch(() => '');
        let msg = 'Có lỗi xảy ra.';
        try {
          msg = JSON.parse(raw)?.error || msg;
        } catch {
          if (resp.status === 504 || resp.status === 502 || resp.status === 503) {
            msg = 'AI xử lý quá lâu nên máy chủ đã ngắt. Thử lại hoặc rút gọn yêu cầu.';
          }
        }
        throw new Error(msg);
      }

      // Đọc luồng SSE của Gemini, vừa nhận chữ tới đâu vừa cập nhật giao diện tới đó
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() ?? '';
        for (const chunk of chunks) {
          const line = chunk.trim();
          if (!line.startsWith('data:')) continue;
          const jsonStr = line.slice(5).trim();
          if (!jsonStr) continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = (parsed?.candidates?.[0]?.content?.parts ?? []).map((p: any) => p.text || '').join('');
            if (delta) {
              fullText += delta;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { ...next[next.length - 1], text: fullText };
                return next;
              });
            }
          } catch {
            // bỏ qua chunk lỗi định dạng, không làm gãy cả luồng
          }
        }
      }

      if (!fullText) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], text: '(Không có phản hồi)' };
          return next;
        });
      }
    } catch (e: any) {
      setError(e?.message ?? 'Không kết nối được trợ lý AI. Thử lại sau.');
      setMessages((prev) => prev.slice(0, -1)); // bỏ bong bóng AI rỗng nếu lỗi
    } finally {
      setLoading(false);
    }
  }

  async function handleGvbmSubmit(values: Record<string, string>, refFiles: RefFile[]) {
    if (!gvbmTemplate) return;
    const prompt = gvbmTemplate.buildPrompt(values);
    const docTitle = `${gvbmTemplate.label}${values.topic ? ` - ${values.topic}` : ''}`;
    setGvbmTemplate(null);

    const files: { mimeType: string; data: string }[] = [];
    const texts: string[] = [];
    for (const rf of refFiles) {
      if (rf.kind === 'unsupported') continue;
      if (rf.kind === 'docx') {
        try {
          const buf = await rf.file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer: buf });
          texts.push(result.value);
        } catch {
          // .pptx không phải docx thật -> mammoth sẽ lỗi, bỏ qua tệp đó
        }
      } else {
        const data = await fileToBase64(rf.file);
        files.push({ mimeType: rf.file.type || 'application/pdf', data });
      }
    }

    send(prompt, docTitle, files.length ? files : undefined, texts.length ? texts : undefined);
  }

  if (!open) return null;

  const headerClass = activePersona?.headerClass ?? 'bg-hoa-950';
  const title = activePersona?.label ?? 'Trợ lý điều hành AI';
  const suggestions = activePersona?.suggestions ?? DEFAULT_SUGGESTIONS;
  const Icon = activePersona?.icon ?? Bot;
  const isGvbm = persona === 'gvbm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={closeAssistant}>
      <div
        className="w-full max-w-lg h-[75vh] max-h-[640px] rounded-2xl bg-white shadow-2xl border border-black/10 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`${headerClass} text-white px-4 py-3 flex items-center gap-2 shrink-0`}>
          <Icon size={18} className="text-gold-400" />
          <div className="flex-1">
            <p className="text-sm font-bold leading-tight">{title}</p>
            <p className="text-[11px] text-white/50">Gemini 2.5 Flash · hỏi về công việc, KPI, số liệu trường</p>
          </div>
          <button onClick={closeAssistant} className="text-white/60 hover:text-white" aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-paper">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[88%] rounded-xl px-3 py-2 ${
                  m.role === 'user' ? 'bg-blue-600 text-white text-sm whitespace-pre-wrap' : 'bg-white border border-black/10 text-ink'
                }`}
              >
                {m.role === 'ai' ? (
                  m.text ? (
                    <>
                      <SimpleMarkdown text={m.text} />
                      {m.docTitle && <ExportMenu text={m.text} title={m.docTitle} />}
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5 text-ink/40 text-sm">
                      <Loader2 size={13} className="animate-spin" /> Đang soạn...
                    </span>
                  )
                ) : (
                  m.text
                )}
              </div>
            </div>
          ))}
          {error && <p className="text-[11px] text-signal-overdue px-1">{error}</p>}

          {/* GVBM: hiện thẻ chọn mẫu soạn thay vì gợi ý câu hỏi thường */}
          {isGvbm && messages.length === 1 && !gvbmTemplate && (
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] text-ink/40 px-0.5">Chọn loại tài liệu muốn soạn:</p>
              {GVBM_TEMPLATES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setGvbmTemplate(t)}
                  className="w-full text-left rounded-lg border border-black/10 bg-white px-3 py-2 hover:border-teal-500 transition-colors"
                >
                  <p className="text-xs font-semibold text-ink">{t.label}</p>
                  <p className="text-[11px] text-ink/40 mt-0.5">{t.description}</p>
                </button>
              ))}
            </div>
          )}

          {isGvbm && gvbmTemplate && (
            <GvbmForm template={gvbmTemplate} onCancel={() => setGvbmTemplate(null)} onSubmit={handleGvbmSubmit} />
          )}

          {!isGvbm && messages.length === 1 && (
            <div className="space-y-1.5 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="block w-full text-left text-xs rounded-lg border border-black/10 bg-white px-3 py-2 text-ink/70 hover:border-blue-400"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-2.5 border-t border-black/10 flex items-center gap-2 shrink-0 bg-white">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Nhập câu hỏi..."
            className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring"
            autoFocus
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="h-9 w-9 rounded-lg bg-blue-600 text-white grid place-items-center disabled:opacity-40"
            aria-label="Gửi"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
