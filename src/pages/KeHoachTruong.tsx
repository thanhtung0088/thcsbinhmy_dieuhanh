import { useState } from 'react';
import { CalendarClock, FileText, Gavel, GraduationCap, Users } from 'lucide-react';
import { useReports } from '../context/ReportsContext';
import { DriveUploadButton, OnlineMeetingButton } from '../components/shared/WorkspaceActions';

const TABS = [
  { id: 'Kế hoạch trường', icon: GraduationCap },
  { id: 'Kế hoạch tổ', icon: Users },
  { id: 'Kế hoạch cá nhân', icon: FileText },
  { id: 'PPCT', icon: CalendarClock },
  { id: 'Văn bản mới', icon: Gavel },
] as const;

export function KeHoachTruong() {
  const [active, setActive] = useState<(typeof TABS)[number]['id']>(TABS[0].id);
  const [content, setContent] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const { reports, submitReport } = useReports();

  const relevant = reports.filter((r) => r.fromDepartment === active);

  function handleSubmit() {
    if (!content.trim()) return;
    submitReport({
      fromDepartment: active,
      toRecipient: 'Ban Giám hiệu',
      content: content.trim(),
      driveLink: driveLink.trim() || undefined,
      category: active,
    });
    setContent('');
    setDriveLink('');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-blue-600">📚 KẾ HOẠCH TRƯỜNG</p>
          <h2 className="text-xl font-bold text-ink mt-0.5">{active}</h2>
        </div>
        <OnlineMeetingButton />
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm border-b-2 -mb-px transition-colors ${
              active === id ? 'border-blue-600 text-blue-700 font-medium' : 'border-transparent text-ink/50 hover:text-ink'
            }`}
          >
            <Icon size={14} />
            {id}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4">
        <p className="text-sm font-semibold text-ink/70 mb-3">Hồ sơ đã gửi Ban Giám hiệu</p>
        {relevant.length === 0 ? (
          <p className="text-sm text-ink/40 py-6 text-center">Chưa có hồ sơ nào cho "{active}". Nộp hồ sơ ở khung dưới.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {relevant.map((r) => (
              <li key={r.id} className="py-2.5 text-sm">
                <p className="text-ink">{r.content}</p>
                <p className="text-xs text-ink/40 mt-0.5">
                  {new Date(r.createdAt).toLocaleString('vi-VN')} ·{' '}
                  <span
                    className={
                      r.status === 'da_duyet'
                        ? 'text-emerald-600'
                        : r.status === 'yeu_cau_bo_sung'
                          ? 'text-rose-600'
                          : 'text-amber-600'
                    }
                  >
                    {r.status === 'da_duyet' ? 'Đã duyệt' : r.status === 'yeu_cau_bo_sung' ? 'Yêu cầu bổ sung' : 'Chờ duyệt'}
                  </span>
                </p>
                {r.reviewNote && <p className="text-xs text-rose-600 mt-0.5">Nhận xét BGH: {r.reviewNote}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-black/10 bg-white p-4 space-y-2">
        <p className="text-sm font-semibold text-ink/70">Nộp hồ sơ mới cho "{active}"</p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Tóm tắt nội dung kế hoạch/hồ sơ…"
          className="w-full rounded-md border border-black/10 px-3 py-2 text-sm focus-ring resize-none"
        />
        <div className="flex items-center gap-2">
          <input
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
            placeholder="Link Google Drive (tùy chọn)"
            className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm focus-ring"
          />
          <DriveUploadButton />
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 text-white text-sm font-medium px-4 py-2 hover:bg-blue-700"
          >
            Gửi Ban Giám hiệu
          </button>
        </div>
      </div>
    </div>
  );
}
