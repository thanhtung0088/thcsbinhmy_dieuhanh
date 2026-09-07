import { useState } from 'react';
import { CAMPUSES, TOTAL_STUDENTS } from '../data/mockData';
import { CLASSES } from '../data/classes';
import type { CampusId } from '../types';
import { DriveUploadButton, OnlineMeetingButton, SendReportButton } from '../components/shared/WorkspaceActions';

export function HocSinhWorkspace() {
  const [campus, setCampus] = useState<CampusId | 'all'>('all');

  const classes = campus === 'all' ? CLASSES : CLASSES.filter((c) => c.campusId === campus);
  const grades = [6, 7, 8, 9] as const;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-blue-600">KHÔNG GIAN LÀM VIỆC</p>
          <h2 className="text-xl font-bold text-ink mt-0.5">Học sinh</h2>
          <p className="text-xs text-ink/50 mt-1">
            Sĩ số đầu năm toàn trường: <span className="font-medium text-ink">{TOTAL_STUDENTS.toLocaleString('vi-VN')}</span> học sinh · tính đến 06/09/2026 (KH công tác tuần 1, số 14/KH-THCSBM)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OnlineMeetingButton />
          <DriveUploadButton />
          <SendReportButton department="Học sinh" />
        </div>
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={() => setCampus('all')}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium border ${campus === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'border-black/10 text-ink/60'}`}
        >
          Toàn trường
        </button>
        {CAMPUSES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCampus(c.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium border ${campus === c.id ? 'bg-blue-600 text-white border-blue-600' : 'border-black/10 text-ink/60'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-50 text-blue-900/70 text-xs">
              <th className="text-left font-medium px-4 py-2">Lớp</th>
              <th className="text-left font-medium px-4 py-2">Điểm trường</th>
              <th className="text-right font-medium px-4 py-2">Sĩ số</th>
              <th className="text-right font-medium px-4 py-2">Nữ</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => {
              const gradeClasses = classes.filter((c) => c.grade === g);
              if (gradeClasses.length === 0) return null;
              const gradeTotal = gradeClasses.reduce((s, c) => s + c.total, 0);
              return (
                <>
                  <tr key={`k${g}`} className="bg-black/[0.03]">
                    <td colSpan={2} className="px-4 py-1.5 text-xs font-semibold text-ink/60">
                      Khối {g}
                    </td>
                    <td className="px-4 py-1.5 text-xs font-semibold text-ink/60 text-right">{gradeTotal}</td>
                    <td></td>
                  </tr>
                  {gradeClasses.map((c) => (
                    <tr key={c.name} className="border-b border-black/5 last:border-0">
                      <td className="px-4 py-1.5 text-ink">{c.name}</td>
                      <td className="px-4 py-1.5 text-ink/50">
                        {CAMPUSES.find((cp) => cp.id === c.campusId)?.name}
                      </td>
                      <td className="px-4 py-1.5 text-right text-ink">{c.total}</td>
                      <td className="px-4 py-1.5 text-right text-ink/50">{c.female}</td>
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
