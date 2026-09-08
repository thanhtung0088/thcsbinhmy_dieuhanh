import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { KpiSubmission } from '../types/kpi';
import { SEED_KPI_SUBMISSIONS } from '../data/kpiData';

interface KpiState {
  submissions: KpiSubmission[];
  addSubmission: (s: Omit<KpiSubmission, 'id' | 'submittedAt'>) => void;
}

const KpiContext = createContext<KpiState | undefined>(undefined);

export function KpiProvider({ children }: { children: ReactNode }) {
  const [submissions, setSubmissions] = useState<KpiSubmission[]>(SEED_KPI_SUBMISSIONS);

  const value = useMemo<KpiState>(
    () => ({
      submissions,
      addSubmission: (s) =>
        setSubmissions((prev) => [
          { ...s, id: `kpi-${Date.now()}`, submittedAt: new Date().toISOString() },
          ...prev,
        ]),
    }),
    [submissions]
  );

  return <KpiContext.Provider value={value}>{children}</KpiContext.Provider>;
}

export function useKpi() {
  const ctx = useContext(KpiContext);
  if (!ctx) throw new Error('useKpi phải được dùng bên trong KpiProvider');
  return ctx;
}
