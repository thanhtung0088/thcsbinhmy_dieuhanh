import { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Loader2, FileText, ChevronLeft, Download, FileType, Presentation } from 'lucide-react';
import { useAiAssistant } from '../../context/AiAssistantContext';
import { getPersona } from '../../data/aiPersonas';
import { callGeminiApi } from '../../lib/geminiClient';
import { SimpleMarkdown } from './SimpleMarkdown';
import { GVBM_TEMPLATES, type GvbmTemplate } from '../../data/gvbmTemplates';
import { exportToDocx, exportToPdf, exportToPptx } from '../../lib/exportDoc';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  docTitle?: string; // nếu tin nhắn AI này là kết quả soạn theo mẫu -> cho phép xuất file
}

const DEFAULT_GREETING = 'Chào thầy/cô! Em là Trợ lý điều hành AI của Trạm Điều Hành. Thầy/cô cần hỏi gì?';
const DEFAULT_SUGGESTIONS = [
  'Tuần này có việc gì cần ưu tiên?',
  'Tổng học sinh toàn trường bao nhiêu?',
  'Có nhiệm vụ nào đang quá hạn không?',
];

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
            <button
              onClick={() => handleExport('docx')}
              disabled={!!busy}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-paper disabled:opacity-40"
            >
              {busy === 'docx' ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} className="text-blue-600" />} Word (.docx)
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={!!busy}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-paper disabled:opacity-40 border-t border-black/5"
            >
              {busy === 'pdf' ? <Loader2 size={13} className="animate-spin" /> : <FileType size={13} className="text-red-600" />} PDF (.pdf)
            </button>
            <button
              onClick={() => handleExport('pptx')}
              disabled={!!busy}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-paper disabled:opacity-40 border-t border-black/5"
            >
              {busy === 'pptx' ? <Loader2 size={13} className="animate-spin" /> : <Presentation size={13} className="text-amber-600" />} PowerPoint (.pptx)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function GvbmForm({ template, onCancel, onSubmit }: { template: GvbmTemplate; onCancel: () => void; onSubmit: (values: Record<string, string>) => void }) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    template.fields.forEach((f) => (init[f.key] = f.defaultValue ?? ''));
    return init;
  });

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
                  <option key={o} value={o}>
                    {o}
                  </option>
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
      </div>
      <button
        onClick={() => onSubmit(values)}
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
  const [lastDocTitle, setLastDocTitle] = useState<string | null>(null);
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
  }, [messages, open, gvbmTemplate]);

  async function send(text: string, docTitle?: string) {
    const q = text.trim();
    if (!q || loading) return;
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      const data = await callGeminiApi<{ text: string }>({ mode: 'ops-chat', message: q, persona: persona ?? undefined });
      setMessages((prev) => [...prev, { role: 'ai', text: data.text || '(Không có phản hồi)', docTitle }]);
    } catch (e: any) {
      setError(e?.message ?? 'Không kết nối được trợ lý AI. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }

  function handleGvbmSubmit(values: Record<string, string>) {
    if (!gvbmTemplate) return;
    const prompt = gvbmTemplate.buildPrompt(values);
    const docTitle = `${gvbmTemplate.label}${values.topic ? ` - ${values.topic}` : ''}`;
    setGvbmTemplate(null);
    send(prompt, docTitle);
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
                  <>
                    <SimpleMarkdown text={m.text} />
                    {m.docTitle && <ExportMenu text={m.text} title={m.docTitle} />}
                  </>
                ) : (
                  m.text
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl px-3 py-2 text-sm bg-white border border-black/10 text-ink/50 flex items-center gap-1.5">
                <Loader2 size={13} className="animate-spin" /> Đang trả lời...
              </div>
            </div>
          )}
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
