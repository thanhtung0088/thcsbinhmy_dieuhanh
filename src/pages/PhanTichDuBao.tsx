import { useState } from 'react';
import { Bot, Send, TrendingUp, BarChart3 } from 'lucide-react';
import { CAMPUSES, KPI_SNAPSHOTS, TOTAL_STUDENTS, TASKS } from '../data/mockData';
import { CLASSES } from '../data/classes';
import { SendReportButton } from '../components/shared/WorkspaceActions';

const GRADE_COLORS: Record<number, string> = { 6: 'bg-blue-500', 7: 'bg-emerald-500', 8: 'bg-amber-500', 9: 'bg-rose-500' };

function answerFromData(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('học sinh') && (q.includes('bao nhiêu') || q.includes('sĩ số') || q.includes('tổng'))) {
    return `Toàn trường hiện có ${TOTAL_STUDENTS.toLocaleString('vi-VN')} học sinh (tính đến 06/09/2026), phân bố tại 4 điểm trường: ${CAMPUSES.map((c) => `${c.name} ${c.studentCount.toLocaleString('vi-VN')}`).join(', ')}.`;
  }
  if (q.includes('kpi')) {
    const overall = KPI_SNAPSHOTS.find((k) => k.scope === 'Toàn trường');
    return overall
      ? `KPI toàn trường (minh họa) hiện ở mức ${overall.score}/100, xu hướng ${overall.trend === 'up' ? 'tăng' : overall.trend === 'down' ? 'giảm' : 'ổn định'}.`
      : 'Chưa có dữ liệu để kết luận.';
  }
  if (q.includes('quá hạn')) {
    const overdue = TASKS.filter((t) => t.status === 'qua_han');
    return overdue.length === 0
      ? 'Hiện không có nhiệm vụ nào quá hạn.'
      : `Có ${overdue.length} nhiệm vụ quá hạn: ${overdue.map((t) => t.title).join('; ')}.`;
  }
  if (q.includes('lớp') && q.includes('nhiều')) {
    const byCampus = CAMPUSES.map((c) => ({ name: c.name, count: c.classCount })).sort((a, b) => b.count - a.count);
    return `${byCampus[0].name} có nhiều lớp nhất (${byCampus[0].count} lớp). Chi tiết: ${byCampus.map((c) => `${c.name} ${c.count}`).join(', ')}.`;
  }
  if (q.includes('giáo viên') || q.includes('nhân sự')) {
    return 'Chưa có dữ liệu để kết luận về tổng nhân sự theo Điểm 2/Điểm 3 tách riêng — PCCM hiện chỉ ghi gộp theo "Đ2". Xem chi tiết tại menu Quản lý nhân sự - Chuyên môn.';
  }
  return 'Chưa có dữ liệu để kết luận. Hãy hỏi cụ thể hơn về học sinh, lớp, KPI, hoặc nhiệm vụ quá hạn.';
}

export function PhanTichDuBao() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const grades = [6, 7, 8, 9] as const;
  const maxGrade = Math.max(...grades.map((g) => CLASSES.filter((c) => c.grade === g).reduce((s, c) => s + c.total, 0)));

  function handleAsk() {
    if (!input.trim()) return;
    const question = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: question }, { role: 'ai', text: answerFromData(question) }]);
    setInput('');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-blue-600">PHÂN TÍCH VÀ DỰ BÁO</p>
          <h2 className="text-xl font-bold text-ink mt-0.5">Tình hình toàn trường</h2>
        </div>
        <SendReportButton department="Phân tích và dự báo" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold text-ink/70 mb-3 flex items-center gap-1.5">
              <BarChart3 size={14} /> Sĩ số theo khối — toàn trường
            </p>
            <div className="space-y-2.5">
              {grades.map((g) => {
                const total = CLASSES.filter((c) => c.grade === g).reduce((s, c) => s + c.total, 0);
                return (
                  <div key={g} className="flex items-center gap-3">
                    <span className="text-xs font-medium text-ink/60 w-14 shrink-0">Khối {g}</span>
                    <div className="flex-1 h-4 rounded-full bg-black/5 overflow-hidden">
                      <div className={`h-full ${GRADE_COLORS[g]} rounded-full`} style={{ width: `${(total / maxGrade) * 100}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-ink w-16 text-right shrink-0">{total} hs</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold text-ink/70 mb-3 flex items-center gap-1.5">
              <TrendingUp size={14} /> KPI theo phạm vi (minh họa)
            </p>
            <div className="space-y-2.5">
              {KPI_SNAPSHOTS.map((k) => (
                <div key={k.scope} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-ink/60 w-24 shrink-0 truncate">{k.scope}</span>
                  <div className="flex-1 h-4 rounded-full bg-black/5 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${k.score}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-ink w-10 text-right shrink-0">{k.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold text-ink/70 mb-3">Học sinh theo điểm trường</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CAMPUSES.map((c) => (
                <div key={c.id} className="rounded-lg bg-blue-50 p-3 text-center">
                  <p className="text-lg font-bold text-blue-900">{c.studentCount.toLocaleString('vi-VN')}</p>
                  <p className="text-[11px] text-blue-700/60">{c.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Agent panel */}
        <div className="rounded-xl border border-black/10 bg-white flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-hoa-950 text-white shrink-0">
            <Bot size={16} className="text-gold-400" />
            <p className="text-sm font-semibold">AI Agent phân tích</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[240px] max-h-[400px]">
            {messages.length === 0 && (
              <p className="text-xs text-ink/40 text-center py-6">
                Hỏi ví dụ: "Tổng học sinh bao nhiêu?", "Việc nào quá hạn?", "Điểm nào nhiều lớp nhất?"
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`text-xs rounded-lg px-3 py-2 max-w-[90%] ${m.role === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-paper text-ink/80'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-black/10 flex gap-1.5 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Hỏi AI về dữ liệu trường…"
              className="flex-1 rounded-lg border border-black/10 px-3 py-1.5 text-xs focus-ring"
            />
            <button onClick={handleAsk} className="rounded-lg bg-blue-600 text-white px-3 hover:bg-blue-700">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-ink/40">
        AI Agent ở đây chỉ tính toán trực tiếp trên dữ liệu đã có trong hệ thống (quy tắc cố định) — chưa nối mô hình
        sinh ngôn ngữ thật (Gemini/OpenAI). Xem phần giải thích cách kết nối AI thật bên dưới cuộc trò chuyện.
      </p>
    </div>
  );
}
