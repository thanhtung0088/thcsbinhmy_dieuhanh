import { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { useAiAssistant } from '../../context/AiAssistantContext';
import { getPersona } from '../../data/aiPersonas';
import { callGeminiApi } from '../../lib/geminiClient';
import { SimpleMarkdown } from './SimpleMarkdown';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const DEFAULT_GREETING = 'Chào thầy/cô! Em là Trợ lý điều hành AI của Trạm Điều Hành. Thầy/cô cần hỏi gì?';
const DEFAULT_SUGGESTIONS = [
  'Tuần này có việc gì cần ưu tiên?',
  'Tổng học sinh toàn trường bao nhiêu?',
  'Có nhiệm vụ nào đang quá hạn không?',
];

export function GlobalAiAssistant() {
  const { open, persona, closeAssistant } = useAiAssistant();
  const activePersona = getPersona(persona ?? undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'ai', text: DEFAULT_GREETING }]);
  const [personaShown, setPersonaShown] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mỗi lần mở với 1 vai trò khác trước đó → làm mới cuộc trò chuyện với
  // lời chào đúng vai trò đó
  useEffect(() => {
    if (!open) return;
    const key = persona ?? '__default__';
    if (key !== personaShown) {
      setMessages([{ role: 'ai', text: activePersona?.greeting ?? DEFAULT_GREETING }]);
      setError(null);
      setPersonaShown(key);
    }
  }, [open, persona]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      const data = await callGeminiApi<{ text: string }>({ mode: 'ops-chat', message: q, persona: persona ?? undefined });
      setMessages((prev) => [...prev, { role: 'ai', text: data.text || '(Không có phản hồi)' }]);
    } catch (e: any) {
      setError(e?.message ?? 'Không kết nối được trợ lý AI. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const headerClass = activePersona?.headerClass ?? 'bg-hoa-950';
  const title = activePersona?.label ?? 'Trợ lý điều hành AI';
  const suggestions = activePersona?.suggestions ?? DEFAULT_SUGGESTIONS;
  const Icon = activePersona?.icon ?? Bot;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={closeAssistant}>
      <div
        className="w-full max-w-lg h-[75vh] max-h-[600px] rounded-2xl bg-white shadow-2xl border border-black/10 flex flex-col overflow-hidden"
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
                className={`max-w-[85%] rounded-xl px-3 py-2 ${
                  m.role === 'user' ? 'bg-blue-600 text-white text-sm whitespace-pre-wrap' : 'bg-white border border-black/10 text-ink'
                }`}
              >
                {m.role === 'ai' ? <SimpleMarkdown text={m.text} /> : m.text}
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

          {messages.length === 1 && (
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
