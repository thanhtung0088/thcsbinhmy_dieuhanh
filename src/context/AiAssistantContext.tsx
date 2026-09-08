import { createContext, useContext, useState, type ReactNode } from 'react';

interface AiAssistantState {
  open: boolean;
  openAssistant: () => void;
  closeAssistant: () => void;
}

const AiAssistantContext = createContext<AiAssistantState | undefined>(undefined);

export function AiAssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <AiAssistantContext.Provider
      value={{ open, openAssistant: () => setOpen(true), closeAssistant: () => setOpen(false) }}
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
