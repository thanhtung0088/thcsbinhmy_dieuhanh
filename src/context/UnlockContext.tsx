import { createContext, useContext, useState, type ReactNode } from 'react';
import type { ModuleKey } from '../lib/rbac';

interface UnlockState {
  unlocked: Set<ModuleKey>;
  unlock: (m: ModuleKey) => void;
}

const UnlockContext = createContext<UnlockState | undefined>(undefined);

export function UnlockProvider({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState<Set<ModuleKey>>(new Set());

  return (
    <UnlockContext.Provider
      value={{
        unlocked,
        unlock: (m) => setUnlocked((prev) => new Set(prev).add(m)),
      }}
    >
      {children}
    </UnlockContext.Provider>
  );
}

export function useUnlock() {
  const ctx = useContext(UnlockContext);
  if (!ctx) throw new Error('useUnlock phải được dùng bên trong UnlockProvider');
  return ctx;
}
