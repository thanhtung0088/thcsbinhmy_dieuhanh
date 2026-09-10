import { useState } from 'react';
import { X, Send, Paperclip, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { useReports } from '../../context/ReportsContext';
import { callGeminiApi } from '../../lib/geminiClient';

interface ServiceRequestModalProps {
  groupLabel: string; // "PHỤ HUYNH - HỌC SINH"
  serviceLabel: string; // "Tuyển sinh đầu cấp"
  onClose: () => void;
}

export function ServiceRequestModal({ groupLabel, serviceLabel, onClose }: ServiceRequestModalProps) {
  const { submitReport } = useReports();
  const [requesterName, setRequesterName] = useState('');
  const [className, setClassName] = useState('');
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function handleAiDraft() {
    setAiLoading(true);
    setAiError(null);
    try {
      const data = await callGeminiApi<{ text: string }>({
        mode: 'draft',
        serviceLabel,
        groupLabel,
        requesterName,
        className,
      });
      setContent(data.text || '');
    } catch (e: any) {
      setAiError(e?.message ?? 'Không tạo được nội dung gợi ý. Bạn tự nhập giúp mình nhé.');
    } finally {
      setAiLoading(false);
    }
  }

  function handleAttach() {
    const name = window.prompt('Dán tên/đường dẫn tài liệu đính kèm (ví dụ: link Google Drive):');
    if (name?.trim()) setAttachments((prev) => [...prev, name.trim()]);
  }

  function handleSubmit() {
    if (!requesterName.trim() || !content.trim()) return;
    submitReport({
      fromDepartment: `Dịch vụ công · ${groupLabel}`,
      toRecipient: 'Ban Giám hiệu',
      content: `[${serviceLabel}] Người yêu cầu: ${requesterName.trim()}${className ? ` · Lớp: ${className}` : ''}${phone ? ` · SĐT: ${phone}` : ''} — ${content.trim()}`,
      driveLink: attachments[0],
      category: serviceLabel,
    });
    setSent(true);
    setTimeout(onClose, 1400);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        <div className="bg-blue-600 text-white px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-blue-100">{groupLabel.toUpperCase()}</p>
            <h3 className="text-base font-bold">{serviceLabel}</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-2 py-12 text-emerald-600">
            <CheckCircle2 size={32} />
            <p className="text-sm font-medium">Đã gửi yêu cầu về nhà trường</p>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            <input
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              placeholder="Họ và tên người yêu cầu *"
              className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm focus-ring"
            />
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Lớp đang học của học sinh"
              className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm focus-ring"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại liên hệ"
              className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm focus-ring"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="Nội dung / lý do cụ thể *"
              className="w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm focus-ring resize-none"
            />
            <button
              onClick={handleAiDraft}
              disabled={aiLoading}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-40"
            >
              {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
              {aiLoading ? 'AI đang soạn...' : 'Nhờ AI soạn giúp'}
            </button>
            {aiError && <p className="text-[11px] text-signal-overdue">{aiError}</p>}

            <button
              onClick={handleAttach}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              <Paperclip size={13} /> Gắn thêm tài liệu (+)
            </button>
            {attachments.length > 0 && (
              <ul className="space-y-1">
                {attachments.map((a, i) => (
                  <li key={i} className="text-[11px] text-ink/50 truncate">📎 {a}</li>
                ))}
              </ul>
            )}

            <button
              onClick={handleSubmit}
              disabled={!requesterName.trim() || !content.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white font-semibold text-sm py-3 mt-2 hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              <Send size={15} /> GỬI YÊU CẦU VỀ NHÀ TRƯỜNG
            </button>
            <p className="text-center text-[11px] text-ink/40">
              Yêu cầu sẽ được gửi về Ban Giám hiệu/Hành chính VP để xử lý.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
