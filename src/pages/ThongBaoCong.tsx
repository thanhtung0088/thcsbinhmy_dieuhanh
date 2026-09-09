import { Bell } from 'lucide-react';
import { PUBLIC_ANNOUNCEMENTS } from '../data/announcements';

const TAG_COLOR: Record<string, string> = {
  'Lịch học': 'bg-blue-50 text-blue-700 border-blue-200',
  'Tuyển sinh': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Học phí': 'bg-amber-50 text-amber-700 border-amber-200',
  Chung: 'bg-slate-50 text-slate-700 border-slate-200',
};

export function ThongBaoCong() {
  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600">THÔNG BÁO CHUNG</p>
        <h2 className="text-xl font-bold text-ink mt-0.5">Thông báo từ nhà trường</h2>
        <p className="text-xs text-ink/50 mt-1">Dành cho phụ huynh, học sinh và toàn thể cán bộ, giáo viên.</p>
      </div>

      <div className="space-y-3">
        {PUBLIC_ANNOUNCEMENTS.map((a) => (
          <div key={a.id} className="rounded-xl border border-black/10 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <Bell size={15} className="text-blue-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{a.title}</p>
                  <p className="text-sm text-ink/70 mt-1">{a.content}</p>
                  <p className="text-[11px] text-ink/40 mt-2">{a.date}</p>
                </div>
              </div>
              <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${TAG_COLOR[a.tag]}`}>
                {a.tag}
              </span>
            </div>
          </div>
        ))}
        {PUBLIC_ANNOUNCEMENTS.length === 0 && (
          <p className="text-xs text-ink/40 text-center py-6">Chưa có thông báo nào.</p>
        )}
      </div>
    </div>
  );
}
