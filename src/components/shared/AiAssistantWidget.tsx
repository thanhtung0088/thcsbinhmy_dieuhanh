import { useRef, useState, useEffect } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

const SUGGESTIONS = [
  'Hồ sơ tuyển sinh đầu cấp cần giấy tờ gì?',
  'Thủ tục xin chuyển trường đến gồm những bước nào?',
  'Muốn xin cấp lại học bạ thì làm sao?',
];

export function AiAssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Chào bạn! Mình là trợ lý ảo Dịch vụ công của trường. Bạn cần hỏi thủ tục gì?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'chat', message: q }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Có lỗi xảy ra');
      setMessages((prev) => [...prev, { role: 'ai', text: data.text || '(Không có phản hồi)' }]);
    } catch (e: any) {
      setError(e?.message ?? 'Không kết nối được trợ lý AI. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Nút nổi mở khung chat */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg grid place-items-center hover:bg-blue-700 transition-colors"
        aria-label="Mở trợ lý AI"
      >
        {open ? <X size={22} /> : <Sparkles size={22} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[92vw] max-w-sm h-[70vh] max-h-[520px] rounded-2xl bg-white shadow-2xl border border-black/10 flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-3 flex items-center gap-2 shrink-0">
            <Sparkles size={16} />
            <div>
              <p className="text-sm font-bold leading-tight">Trợ lý Dịch vụ công</p>
              <p className="text-[11px] text-blue-100">Trả lời tự động bằng AI · chỉ mang tính tham khảo</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-paper">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-black/10 text-ink'
                  }`}
                >
                  {m.text}
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
                {SUGGESTIONS.map((s) => (
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
      )}
    </>
  );
}
