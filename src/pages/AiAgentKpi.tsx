import { useState } from 'react';
import { Bot, Plus, Sparkles, Loader2, Gauge, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { useKpi } from '../context/KpiContext';
import { calcSubmission } from '../lib/kpiCalc';
import { KpiSubmissionModal } from '../components/shared/KpiSubmissionModal';

function StatCard({ icon: Icon, label, value, sub }: { icon: typeof Users; label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-blue-700/60">{label}</p>
        <Icon size={16} className="text-blue-600" />
      </div>
      <p className="mt-2 text-2xl font-bold text-blue-950">{value}</p>
      {sub && <p className="text-xs text-blue-700/40 mt-0.5">{sub}</p>}
    </div>
  );
}

const CLASSIFICATION_COLOR: Record<string, string> = {
  'Hoàn thành xuất sắc nhiệm vụ': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Hoàn thành tốt nhiệm vụ': 'bg-blue-50 text-blue-700 border-blue-200',
  'Hoàn thành nhiệm vụ': 'bg-amber-50 text-amber-700 border-amber-200',
  'Không hoàn thành nhiệm vụ': 'bg-rose-50 text-rose-700 border-rose-200',
};

export function AiAgentKpi() {
  const { submissions } = useKpi();
  const [showForm, setShowForm] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const calcs = submissions.map((s) => ({ sub: s, calc: calcSubmission(s) }));
  const avgScore = calcs.length ? calcs.reduce((sum, c) => sum + c.calc.totalScore, 0) / calcs.length : 0;
  const excellentCount = calcs.filter((c) => c.calc.classification === 'Hoàn thành xuất sắc nhiệm vụ').length;
  const overdueTotal = calcs.reduce((sum, c) => sum + c.calc.overdueCount, 0);
  const needAttention = calcs.filter((c) => c.calc.totalScore < 65).length;

  async function handleAiSummary() {
    setAiLoading(true);
    setAiError(null);
    setAiText(null);
    try {
      const payload = calcs.map(({ sub, calc }) => ({
        teacherName: sub.teacherName,
        subjectGroup: sub.subjectGroup,
        quarter: sub.quarter,
        totalScore: Math.round(calc.totalScore * 10) / 10,
        classification: calc.classification,
        taskCount: sub.tasks.length,
        overdueCount: calc.overdueCount,
        earlyRatioPct: Math.round(calc.earlyRatio * 100),
      }));
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'kpi-summary', submissions: payload }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Có lỗi xảy ra');
      setAiText(data.text || '(Không có phản hồi)');
    } catch (e: any) {
      setAiError(e?.message ?? 'Không tổng hợp được. Thử lại sau.');
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-blue-600">AI AGENT &amp; KPI</p>
          <h2 className="text-xl font-bold text-ink mt-0.5">Tổng hợp tự đánh giá &amp; xếp loại KPI</h2>
          <p className="text-xs text-ink/50 mt-1 max-w-xl">
            Giáo viên nộp bản tự đánh giá theo quý; hệ thống tự tính điểm theo đúng công thức (điểm chuẩn × hệ số độ
            khó × tiến độ/kết quả), AI Agent tổng hợp thành báo cáo trình Hiệu trưởng.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 text-white px-3.5 py-2 text-sm font-medium hover:bg-blue-700 shrink-0"
        >
          <Plus size={15} /> Nộp bản tự đánh giá
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Đã nộp" value={submissions.length} sub="bản tự đánh giá" />
        <StatCard icon={Gauge} label="Điểm KPI trung bình" value={avgScore ? avgScore.toFixed(1) : '—'} sub="/ 100" />
        <StatCard icon={TrendingUp} label="Xuất sắc" value={excellentCount} sub="giáo viên đề xuất xuất sắc" />
        <StatCard icon={AlertTriangle} label="Cần lưu ý" value={needAttention} sub={`${overdueTotal} nhiệm vụ trễ hạn`} />
      </div>

      {/* AI Agent tổng hợp */}
      <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-hoa-950 text-white">
          <div className="flex items-center gap-2">
            <Bot size={16} className="text-gold-400" />
            <p className="text-sm font-semibold">AI Agent — Tổng hợp trình Hiệu trưởng</p>
          </div>
          <button
            onClick={handleAiSummary}
            disabled={aiLoading || submissions.length === 0}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium disabled:opacity-40"
          >
            {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
            {aiLoading ? 'Đang tổng hợp...' : 'Tổng hợp bằng AI'}
          </button>
        </div>
        <div className="p-4">
          {aiError && <p className="text-xs text-signal-overdue mb-2">{aiError}</p>}
          {aiText ? (
            <p className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">{aiText}</p>
          ) : (
            <p className="text-xs text-ink/40">
              Bấm "Tổng hợp bằng AI" để AI Agent đọc {submissions.length} bản tự đánh giá bên dưới và viết báo cáo
              tổng hợp: nhận định chung, cá nhân nổi bật, cá nhân cần hỗ trợ, và đề xuất hành động cho Hiệu trưởng.
            </p>
          )}
        </div>
      </div>

      {/* Bảng danh sách */}
      <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
        <p className="text-sm font-semibold text-ink/70 px-4 pt-3 pb-2">Danh sách bản tự đánh giá</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink/40 border-y border-black/5">
                <th className="px-4 py-2 font-medium">Giáo viên</th>
                <th className="px-4 py-2 font-medium">Tổ chuyên môn</th>
                <th className="px-4 py-2 font-medium">Số việc</th>
                <th className="px-4 py-2 font-medium">Trễ hạn</th>
                <th className="px-4 py-2 font-medium">Điểm KPI</th>
                <th className="px-4 py-2 font-medium">Xếp loại đề xuất</th>
              </tr>
            </thead>
            <tbody>
              {calcs
                .sort((a, b) => b.calc.totalScore - a.calc.totalScore)
                .map(({ sub, calc }) => (
                  <tr key={sub.id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-2.5 font-medium text-ink">{sub.teacherName}</td>
                    <td className="px-4 py-2.5 text-ink/60">{sub.subjectGroup}</td>
                    <td className="px-4 py-2.5 text-ink/60">{sub.tasks.length}</td>
                    <td className="px-4 py-2.5 text-ink/60">
                      {calc.overdueCount > 0 ? (
                        <span className="text-signal-overdue font-medium">{calc.overdueCount}</span>
                      ) : (
                        '0'
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-ink">{calc.totalScore.toFixed(1)}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${CLASSIFICATION_COLOR[calc.classification]}`}
                      >
                        {calc.classification}
                      </span>
                    </td>
                  </tr>
                ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-xs text-ink/40">
                    Chưa có bản tự đánh giá nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[11px] text-ink/40">
        Điểm KPI do hệ thống tự tính theo công thức trong "Danh mục sản phẩm chuẩn" của trường (không do AI tính).
        AI Agent chỉ đọc kết quả đã tính sẵn để viết báo cáo tổng hợp. Ngưỡng xếp loại (90/80/65 điểm, &gt;30% việc
        vượt tiến độ để đạt "Xuất sắc") là đề xuất của hệ thống — điều chỉnh lại khi trường có hướng dẫn chấm điểm
        chính thức khác.
      </p>

      {showForm && <KpiSubmissionModal onClose={() => setShowForm(false)} />}
    </div>
  );
}
