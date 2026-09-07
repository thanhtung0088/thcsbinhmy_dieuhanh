import { useState } from 'react';
import { Send, Link2, Video, X, CheckCircle2 } from 'lucide-react';
import { useReports } from '../../context/ReportsContext';

export function SendReportButton({ department }: { department: string }) {
  const { submitReport } = useReports();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [recipient, setRecipient] = useState<'Hiệu trưởng' | 'Ban Giám hiệu'>('Ban Giám hiệu');
  const [sent, setSent] = useState(false);

  function handleSend() {
    if (!content.trim()) return;
    submitReport({ fromDepartment: department, toRecipient: recipient, content: content.trim() });
    setSent(true);
    setContent('');
    setTimeout(() => {
      setSent(false);
      setOpen(false);
    }, 1200);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
      >
        <Send size={13} />
        Gửi báo cáo về BGH
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-black/10 bg-white p-3 shadow-lg">
          {sent ? (
            <div className="flex items-center gap-2 py-4 justify-center text-emerald-600 text-sm font-medium">
              <CheckCircle2 size={16} /> Đã gửi báo cáo
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-ink/70">Gửi báo cáo nhanh</p>
                <button onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink">
                  <X size={14} />
                </button>
              </div>
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value as typeof recipient)}
                className="w-full mb-2 rounded-md border border-black/10 px-2 py-1.5 text-xs focus-ring"
              >
                <option>Ban Giám hiệu</option>
                <option>Hiệu trưởng</option>
              </select>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                placeholder={`Nội dung báo cáo từ ${department}…`}
                className="w-full rounded-md border border-black/10 px-2 py-1.5 text-xs focus-ring resize-none"
              />
              <button
                onClick={handleSend}
                className="mt-2 w-full rounded-md bg-blue-600 text-white text-xs font-medium py-1.5 hover:bg-blue-700 transition-colors"
              >
                Gửi báo cáo
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function DriveUploadButton() {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');
  const [files, setFiles] = useState<string[]>([]);

  function handleAdd() {
    if (!link.trim()) return;
    setFiles((prev) => [link.trim(), ...prev]);
    setLink('');
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-ink/70 hover:border-blue-400 hover:text-blue-700 transition-colors"
      >
        <Link2 size={13} />
        Tải lên (Google Drive)
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-black/10 bg-white p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-ink/70">Dán liên kết Google Drive</p>
            <button onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink">
              <X size={14} />
            </button>
          </div>
          <div className="flex gap-1.5">
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://drive.google.com/…"
              className="flex-1 rounded-md border border-black/10 px-2 py-1.5 text-xs focus-ring"
            />
            <button
              onClick={handleAdd}
              className="rounded-md bg-blue-600 text-white text-xs font-medium px-2.5 hover:bg-blue-700 transition-colors"
            >
              Thêm
            </button>
          </div>
          {files.length > 0 && (
            <ul className="mt-2 space-y-1 max-h-28 overflow-y-auto">
              {files.map((f, i) => (
                <li key={i}>
                  <a
                    href={f}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-600 hover:underline break-all"
                  >
                    {f}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="text-[10px] text-ink/40 mt-2">
            Tệp vẫn lưu trên Google Drive của người tải lên — hệ thống chỉ lưu liên kết truy cập.
          </p>
        </div>
      )}
    </div>
  );
}

export function OnlineMeetingButton() {
  return (
    <a
      href="https://meet.google.com/new"
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-ink/70 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
    >
      <Video size={13} />
      Họp online
    </a>
  );
}
