import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useGvcn } from '../../context/GvcnContext';

export function AiRemarks({ className }: { className: string }) {
  const { getClassData, updateClassData } = useGvcn();
  const data = getClassData(className);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!notes.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'gvcn-remark', notes }),
      });
      const data2 = await resp.json();
      if (!resp.ok) throw new Error(data2?.error || 'Có lỗi xảy ra');
      updateClassData(className, { aiRemark: data2.text || '' });
    } catch (e: any) {
      setError(e?.message ?? 'Không tạo được nhận xét. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-ink/60">
          Ghi chú nhanh về tình hình lớp trong tuần/tháng (học tập, nề nếp, phong trào...)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Vd: Lớp đi học đều, 2 bạn nghỉ không phép hôm thứ Ba. Tham gia tốt phong trào kế hoạch nhỏ. Còn ồn trong giờ tự học..."
          className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring resize-none"
        />
      </div>
      <button
        onClick={handleGenerate}
        disabled={loading || !notes.trim()}
        className="flex items-center gap-1.5 rounded-lg bg-hoa-950 text-white text-xs font-medium px-3 py-2 hover:bg-hoa-800 disabled:opacity-40"
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} className="text-gold-400" />}
        {loading ? 'AI đang viết...' : 'AI viết nhận xét'}
      </button>

      {error && <p className="text-xs text-signal-overdue">{error}</p>}

      {data.aiRemark && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-xs font-semibold text-emerald-800 mb-1">Nhận xét AI đề xuất</p>
          <p className="text-sm text-emerald-900 whitespace-pre-wrap leading-relaxed">{data.aiRemark}</p>
        </div>
      )}
    </div>
  );
}
