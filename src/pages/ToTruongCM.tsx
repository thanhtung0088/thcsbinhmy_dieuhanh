import { useState } from 'react';
import { CheckCircle2, ChevronLeft, RotateCcw, Send, X } from 'lucide-react';
import { SUBJECT_GROUPS, TASKS } from '../data/mockData';
import { TO_TRUONG_SECTIONS } from '../data/toTruongLibrary';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportsContext';
import { can } from '../lib/rbac';
import { OnlineMeetingButton } from '../components/shared/WorkspaceActions';
import type { Report } from '../types';

const STATUS_META: Record<Report['status'], { label: string; className: string }> = {
  cho_duyet: { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-700' },
  yeu_cau_bo_sung: { label: 'Yêu cầu bổ sung', className: 'bg-rose-100 text-rose-700' },
  da_duyet: { label: 'Đã duyệt', className: 'bg-emerald-100 text-emerald-700' },
};

function SubmitRow({ department, category }: { department: string; category: string }) {
  const { reports, submitReport, resubmitReport, reviewReport } = useReports();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [reviewNote, setReviewNote] = useState('');

  const existing = reports.find((r) => r.fromDepartment === department && r.category === category);
  const canReview = user ? can(user.role, 'chuyen_mon', 'approve') || user.role === 'hieu_truong' : false;

  function handleSubmit() {
    if (!content.trim()) return;
    if (existing && existing.status === 'yeu_cau_bo_sung') {
      resubmitReport(existing.id, content.trim(), driveLink.trim() || undefined);
    } else {
      submitReport({
        fromDepartment: department,
        toRecipient: 'Ban Giám hiệu',
        content: content.trim(),
        driveLink: driveLink.trim() || undefined,
        category,
      });
    }
    setContent('');
    setDriveLink('');
    setOpen(false);
  }

  return (
    <div className="border border-black/10 rounded-lg p-3 bg-white">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink flex-1">{category}</p>
        {existing ? (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_META[existing.status].className}`}>
            {STATUS_META[existing.status].label}
          </span>
        ) : (
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 shrink-0"
          >
            <Send size={12} /> Nộp hồ sơ
          </button>
        )}
      </div>

      {existing && (
        <div className="mt-2 text-xs text-ink/60 space-y-1">
          <p>{existing.content}</p>
          {existing.driveLink && (
            <a href={existing.driveLink} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all block">
              {existing.driveLink}
            </a>
          )}
          {existing.reviewNote && (
            <p className="text-rose-600">
              <span className="font-medium">Nhận xét BGH:</span> {existing.reviewNote}
            </p>
          )}
          {existing.status === 'yeu_cau_bo_sung' && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 mt-1"
            >
              <RotateCcw size={12} /> Chỉnh sửa &amp; trình lại
            </button>
          )}
          {canReview && existing.status === 'cho_duyet' && (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => reviewReport(existing.id, 'da_duyet', user!.name)}
                className="flex items-center gap-1 rounded-md bg-emerald-600 text-white px-2.5 py-1 text-[11px] font-medium hover:bg-emerald-700"
              >
                <CheckCircle2 size={12} /> Phê duyệt
              </button>
              <input
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Yêu cầu bổ sung gì? (tùy chọn)"
                className="flex-1 rounded-md border border-black/10 px-2 py-1 text-[11px] focus-ring"
              />
              <button
                onClick={() => reviewReport(existing.id, 'yeu_cau_bo_sung', user!.name, reviewNote || 'Cần bổ sung minh chứng.')}
                className="rounded-md border border-rose-300 text-rose-600 px-2.5 py-1 text-[11px] font-medium hover:bg-rose-50"
              >
                Yêu cầu bổ sung
              </button>
            </div>
          )}
        </div>
      )}

      {open && (
        <div className="mt-2 space-y-1.5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            placeholder="Nội dung / tóm tắt hồ sơ…"
            className="w-full rounded-md border border-black/10 px-2 py-1.5 text-xs focus-ring resize-none"
          />
          <div className="flex gap-1.5">
            <input
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              placeholder="Link Google Drive (tùy chọn)"
              className="flex-1 rounded-md border border-black/10 px-2 py-1.5 text-xs focus-ring"
            />
            <button
              onClick={handleSubmit}
              className="rounded-md bg-blue-600 text-white text-xs font-medium px-3 hover:bg-blue-700"
            >
              Gửi
            </button>
            <button onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink px-1">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ToTruongCM() {
  const [activeTo, setActiveTo] = useState(SUBJECT_GROUPS[0].id);
  const [activeSection, setActiveSection] = useState(TO_TRUONG_SECTIONS[0].id);

  const group = SUBJECT_GROUPS.find((g) => g.id === activeTo)!;
  const section = TO_TRUONG_SECTIONS.find((s) => s.id === activeSection)!;
  const department = `Tổ ${group.name}`;

  const scopedNames = [group.ttcm?.name, ...group.tpcm.map((p) => p.name)].filter(Boolean) as string[];
  const scopedTasks = TASKS.filter((t) => scopedNames.includes(t.assignee));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-blue-600">🎓 TỔ TRƯỞNG CHUYÊN MÔN</p>
          <h2 className="text-xl font-bold text-ink mt-0.5">Tổ {group.name}</h2>
          <p className="text-xs text-ink/50 mt-1">
            Tổ trưởng: {group.ttcm?.name ?? 'Chưa cập nhật'}
            {group.tpcm.length > 0 && ` · Tổ phó: ${group.tpcm.map((p) => p.name).join(', ')}`}
            {' · '}Sĩ số tổ: {group.memberCount}
          </p>
        </div>
        <OnlineMeetingButton />
      </div>

      {/* Chọn tổ */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {SUBJECT_GROUPS.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveTo(g.id)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium border ${
              activeTo === g.id ? 'bg-blue-600 text-white border-blue-600' : 'border-black/10 text-ink/60 hover:border-blue-300'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Nhiệm vụ BGH giao — liên thông thật, không nhập tay lại */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
        <p className="text-sm font-semibold text-blue-900 mb-2">Nhiệm vụ Ban Giám hiệu giao cho tổ</p>
        {scopedTasks.length === 0 ? (
          <p className="text-xs text-blue-700/50">Chưa có nhiệm vụ nào giao cho Tổ trưởng/Tổ phó tổ này.</p>
        ) : (
          <ul className="space-y-1.5">
            {scopedTasks.map((t) => (
              <li key={t.id} className="text-xs text-blue-900/80 flex justify-between gap-2">
                <span>{t.title}</span>
                <span className="text-blue-700/50 shrink-0">Hạn: {t.dueDate}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 6 nhóm nghiệp vụ */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TO_TRUONG_SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium border-b-2 ${
              activeSection === s.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-ink/50 hover:text-ink'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {section.categories.map((cat) => (
          <SubmitRow key={cat} department={department} category={cat} />
        ))}
      </div>

      <p className="text-[11px] text-ink/40 flex items-center gap-1">
        <ChevronLeft size={12} className="rotate-180" />
        Luồng: Tổ trưởng nộp → Ban Giám hiệu xem, phê duyệt hoặc yêu cầu bổ sung → tổ trưởng chỉnh sửa và trình lại.
      </p>
    </div>
  );
}
