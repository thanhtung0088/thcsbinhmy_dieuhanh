import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AiPersonaKey } from '../data/aiPersonas';

interface AiAssistantState {
  open: boolean;
  persona: AiPersonaKey | null;
  openAssistant: (persona?: AiPersonaKey) => void;
  closeAssistant: () => void;
}

const AiAssistantContext = createContext<AiAssistantState | undefined>(undefined);

export function AiAssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [persona, setPersona] = useState<AiPersonaKey | null>(null);

  return (
    <AiAssistantContext.Provider
      value={{
        open,
        persona,
        openAssistant: (p) => {
          setPersona(p ?? null);
          setOpen(true);
        },
        closeAssistant: () => setOpen(false),
      }}
    >
      {children}
    </AiAssistantContext.Provider>
  );
}

export function useAiAssistant() {
  const ctx = useContext(AiAssistantContext);
  if (!ctx) throw new Error('useAiAssistant phải được dùng bên trong AiAssistantProvider');
  return ctx;
}
