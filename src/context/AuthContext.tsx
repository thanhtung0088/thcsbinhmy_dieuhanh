import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CampusId, User } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface AuthState {
  user: User | null;
  activeCampus: CampusId | 'all';
  login: (userId: string) => void;
  logout: () => void;
  setActiveCampus: (id: CampusId | 'all') => void;
  demoUsers: User[];
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeCampus, setActiveCampus] = useState<CampusId | 'all'>('all');

  const value = useMemo<AuthState>(
    () => ({
      user,
      activeCampus,
      login: (userId: string) => {
        const found = DEMO_USERS.find((u) => u.id === userId);
        if (found) setUser(found);
      },
      logout: () => setUser(null),
      setActiveCampus,
      demoUsers: DEMO_USERS,
    }),
    [user, activeCampus]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
