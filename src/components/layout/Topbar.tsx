import { Sparkles, Video, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAiAssistant } from '../../context/AiAssistantContext';
import { CAMPUSES } from '../../data/mockData';
import { ROLE_LABELS } from '../../lib/rbac';
import { GlobalSearch } from './GlobalSearch';

export function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { user, activeCampus, setActiveCampus, logout } = useAuth();
  const { openAssistant } = useAiAssistant();

  return (
    <header className="flex items-center gap-3 md:gap-4 border-b border-black/10 bg-white px-3 md:px-6 py-3 shrink-0">
      <button
        onClick={onOpenSidebar}
        aria-label="Mở menu"
        className="md:hidden shrink-0 text-ink/70 hover:text-ink rounded-lg p-1.5 hover:bg-paper"
      >
        <Menu size={20} />
      </button>

      <GlobalSearch />

      <select
        value={activeCampus}
        onChange={(e) => setActiveCampus(e.target.value as typeof activeCampus)}
        className="hidden sm:block rounded-lg border border-black/10 bg-paper px-3 py-2 text-sm focus-ring"
      >
        <option value="all">Toàn trường</option>
        {CAMPUSES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.formerName})
          </option>
        ))}
      </select>

      <a
        href="https://meet.google.com/new"
        target="_blank"
        rel="noreferrer"
        className="hidden sm:flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium text-ink/70 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
      >
        <Video size={16} />
        Họp online
      </a>

      <button
        onClick={() => openAssistant()}
        className="flex items-center gap-2 rounded-lg bg-hoa-950 px-3 md:px-3.5 py-2 text-sm font-medium text-white hover:bg-hoa-800 transition-colors shrink-0"
      >
        <Sparkles size={16} className="text-gold-400" />
        <span className="hidden sm:inline">Hỏi AI</span>
      </button>

      {user && (
        <div className="flex items-center gap-2 pl-2 md:pl-3 border-l border-black/10 shrink-0">
          <div className="h-8 w-8 rounded-full bg-hoa-800 text-white grid place-items-center text-xs font-semibold">
            {user.avatarInitials}
          </div>
          <div className="hidden lg:block leading-tight">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-ink/50">{ROLE_LABELS[user.role]}</p>
          </div>
          <button
            onClick={logout}
            title="Đăng xuất"
            className="ml-1 text-ink/40 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </header>
  );
}
