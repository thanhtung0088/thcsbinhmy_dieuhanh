import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Report } from '../types';
import { INITIAL_REPORTS } from '../data/mockData';

interface ReportsState {
  reports: Report[];
  submitReport: (r: Omit<Report, 'id' | 'createdAt' | 'status'>) => void;
  resubmitReport: (id: string, content: string, driveLink?: string) => void;
  reviewReport: (id: string, status: 'da_duyet' | 'yeu_cau_bo_sung', reviewedBy: string, note?: string) => void;
}

const ReportsContext = createContext<ReportsState | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);

  const value = useMemo<ReportsState>(
    () => ({
      reports,
      submitReport: (r) =>
        setReports((prev) => [
          { ...r, id: `r${prev.length + 1}`, createdAt: new Date().toISOString(), status: 'cho_duyet' },
          ...prev,
        ]),
      resubmitReport: (id, content, driveLink) =>
        setReports((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, content, driveLink, status: 'cho_duyet', reviewNote: undefined, createdAt: new Date().toISOString() }
              : r
          )
        ),
      reviewReport: (id, status, reviewedBy, note) =>
        setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status, reviewedBy, reviewNote: note } : r))),
    }),
    [reports]
  );

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used within ReportsProvider');
  return ctx;
}
