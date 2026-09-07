import { useState } from 'react';
import { ClipboardList, FileText, Inbox, LayoutGrid } from 'lucide-react';
import { TASKS, DOCUMENTS } from '../data/mockData';
import { useReports } from '../context/ReportsContext';
import { DriveUploadButton, OnlineMeetingButton, SendReportButton } from '../components/shared/WorkspaceActions';

type TabKey = 'tong_quan' | 'cong_viec' | 'tai_lieu' | 'bao_cao';

const TABS: { key: TabKey; label: string; icon: typeof LayoutGrid }[] = [
  { key: 'tong_quan', label: 'Tổng quan', icon: LayoutGrid },
  { key: 'cong_viec', label: 'Công việc', icon: ClipboardList },
  { key: 'tai_lieu', label: 'Tài liệu', icon: FileText },
  { key: 'bao_cao', label: 'Báo cáo đã gửi', icon: Inbox },
];

export function DepartmentWorkspace({
  moduleName,
  phase,
  departmentKey,
}: {
  moduleName: string;
  phase: string;
  departmentKey?: string;
}) {
  const [tab, setTab] = useState<TabKey>('tong_quan');
  const { reports } = useReports();

  const relatedTasks = departmentKey ? TASKS.filter((t) => t.department === departmentKey) : [];
  const relatedReports = reports.filter((r) => r.fromDepartment === moduleName);

  return (
    <div className="space-y-4">
      {/* Header: this department's own workspace + its action controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-blue-600">KHÔNG GIAN LÀM VIỆC</p>
          <h2 className="text-xl font-bold text-ink mt-0.5">{moduleName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <OnlineMeetingButton />
          <DriveUploadButton />
          <SendReportButton department={moduleName} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-black/10">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm border-b-2 -mb-px transition-colors ${
              tab === key
                ? 'border-blue-600 text-blue-700 font-medium'
                : 'border-transparent text-ink/50 hover:text-ink'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'tong_quan' && (
        <div className="rounded-xl border border-black/10 bg-white p-5">
          <p className="text-sm text-ink/60">
            Đây là không gian làm việc riêng của <span className="font-medium text-ink">{moduleName}</span>. Điều
            hướng, phân quyền và các nút thao tác (họp online, tải tài liệu, gửi báo cáo) đã hoạt động ngay từ Phase
            1. Dữ liệu nghiệp vụ đầy đủ của module này (biểu mẫu, quy trình chi tiết) sẽ được xây dựng ở{' '}
            <span className="font-medium text-ink">{phase}</span> theo lộ trình.
          </p>
        </div>
      )}

      {tab === 'cong_viec' && (
        <div className="rounded-xl border border-black/10 bg-white p-4">
          {relatedTasks.length === 0 ? (
            <p className="text-sm text-ink/40 py-6 text-center">Chưa có công việc nào được giao cho bộ phận này.</p>
          ) : (
            <ul className="divide-y divide-black/5">
              {relatedTasks.map((t) => (
                <li key={t.id} className="py-2.5 flex items-center justify-between text-sm">
                  <div>
                    <p className="text-ink">{t.title}</p>
                    <p className="text-xs text-ink/40 mt-0.5">
                      Phụ trách: {t.assignee} · Hạn: {t.dueDate}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'tai_lieu' && (
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <ul className="divide-y divide-black/5">
            {DOCUMENTS.map((d) => (
              <li key={d.id} className="py-2.5 flex items-center justify-between text-sm">
                <div>
                  <p className="text-ink">{d.title}</p>
                  <p className="text-xs text-ink/40 mt-0.5">
                    Số hiệu: {d.code} · {d.type === 'den' ? 'Văn bản đến' : 'Văn bản đi'} · {d.date}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === 'bao_cao' && (
        <div className="rounded-xl border border-black/10 bg-white p-4">
          {relatedReports.length === 0 ? (
            <p className="text-sm text-ink/40 py-6 text-center">
              Chưa có báo cáo nào được gửi từ {moduleName}. Dùng nút "Gửi báo cáo về BGH" ở trên.
            </p>
          ) : (
            <ul className="divide-y divide-black/5">
              {relatedReports.map((r) => (
                <li key={r.id} className="py-2.5 text-sm">
                  <p className="text-ink">{r.content}</p>
                  <p className="text-xs text-ink/40 mt-0.5">
                    Gửi tới: {r.toRecipient} · {new Date(r.createdAt).toLocaleString('vi-VN')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
