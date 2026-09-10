import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export interface SeatAssignment {
  [deskId: string]: string; // deskId (vd "1") -> tên học sinh
}

export interface StudentRow {
  [column: string]: string;
}

export interface MeetingNote {
  id: string;
  title: string;
  date: string;
  content: string;
}

export interface PlanItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ClassGvcnData {
  gvcnName: string;
  seats: SeatAssignment;
  studentHeaders: string[];
  students: StudentRow[];
  notes: MeetingNote[];
  plans: PlanItem[];
  aiRemark: string;
}

const EMPTY: ClassGvcnData = {
  gvcnName: '',
  seats: {},
  studentHeaders: [],
  students: [],
  notes: [],
  plans: [],
  aiRemark: '',
};

interface GvcnState {
  dataByClass: Record<string, ClassGvcnData>;
  getClassData: (className: string) => ClassGvcnData;
  updateClassData: (className: string, patch: Partial<ClassGvcnData>) => void;
}

const GvcnContext = createContext<GvcnState | undefined>(undefined);

export function GvcnProvider({ children }: { children: ReactNode }) {
  const [dataByClass, setDataByClass] = useState<Record<string, ClassGvcnData>>({});

  const value = useMemo<GvcnState>(
    () => ({
      dataByClass,
      getClassData: (className) => dataByClass[className] ?? EMPTY,
      updateClassData: (className, patch) =>
        setDataByClass((prev) => ({
          ...prev,
          [className]: { ...(prev[className] ?? EMPTY), ...patch },
        })),
    }),
    [dataByClass]
  );

  return <GvcnContext.Provider value={value}>{children}</GvcnContext.Provider>;
}

export function useGvcn() {
  const ctx = useContext(GvcnContext);
  if (!ctx) throw new Error('useGvcn phải được dùng bên trong GvcnProvider');
  return ctx;
}
