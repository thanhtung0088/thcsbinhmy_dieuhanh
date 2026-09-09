import { useState } from 'react';
import { Bell, AlertTriangle, Clock, FileCheck2 } from 'lucide-react';
import { TASKS, ALERTS } from '../../data/mockData';
import { useReports } from '../../context/ReportsContext';

const LEVEL_DOT: Record<string, string> = { do: 'bg-signal-overdue', cam: 'bg-signal-soon', vang: 'bg-gold-500' };

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { reports } = useReports();

  const overdueTasks = TASKS.filter((t) => t.status === 'qua_han');
  const soonTasks = TASKS.filter((t) => t.status === 'sap_den_han');
  const pendingReports = reports.filter((r) => r.status === 'cho_duyet');
  const total = overdueTasks.length + soonTasks.length + ALERTS.length + pendingReports.length;

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative text-ink/60 hover:text-ink rounded-lg p-2 hover:bg-paper transition-colors"
        aria-label="Thông báo"
      >
        <Bell size={19} />
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-signal-overdue text-white text-[10px] font-bold grid place-items-center">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto rounded-xl border border-black/10 bg-white shadow-2xl z-50">
            <p className="px-4 py-2.5 text-xs font-semibold text-ink/50 border-b border-black/5">
              Thông báo ({total})
            </p>

            {total === 0 && <p className="px-4 py-6 text-xs text-ink/40 text-center">Không có thông báo mới.</p>}

            {overdueTasks.map((t) => (
              <div key={t.id} className="flex items-start gap-2.5 px-4 py-2.5 border-b border-black/5 hover:bg-paper">
                <AlertTriangle size={15} className="text-signal-overdue mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink truncate">{t.title}</p>
                  <p className="text-[11px] text-signal-overdue">Quá hạn · {t.assignee}</p>
                </div>
              </div>
            ))}

            {soonTasks.map((t) => (
              <div key={t.id} className="flex items-start gap-2.5 px-4 py-2.5 border-b border-black/5 hover:bg-paper">
                <Clock size={15} className="text-signal-soon mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink truncate">{t.title}</p>
                  <p className="text-[11px] text-ink/40">Sắp đến hạn {t.dueDate} · {t.assignee}</p>
                </div>
              </div>
            ))}

            {pendingReports.map((r) => (
              <div key={r.id} className="flex items-start gap-2.5 px-4 py-2.5 border-b border-black/5 hover:bg-paper">
                <FileCheck2 size={15} className="text-signal-review mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-ink truncate">{r.content}</p>
                  <p className="text-[11px] text-ink/40">Chờ duyệt · {r.fromDepartment}</p>
                </div>
              </div>
            ))}

            {ALERTS.map((a) => (
              <div key={a.id} className="flex items-start gap-2.5 px-4 py-2.5 border-b border-black/5 last:border-0 hover:bg-paper">
                <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${LEVEL_DOT[a.level]}`} />
                <p className="text-xs text-ink/70">{a.message}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
