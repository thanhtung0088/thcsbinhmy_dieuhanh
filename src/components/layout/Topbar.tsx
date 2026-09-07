import { Search, Sparkles, Video, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CAMPUSES } from '../../data/mockData';
import { ROLE_LABELS } from '../../lib/rbac';

export function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { user, activeCampus, setActiveCampus, logout } = useAuth();

  return (
    <header className="flex items-center gap-3 md:gap-4 border-b border-black/10 bg-white px-3 md:px-6 py-3">
      <button
        onClick={onOpenSidebar}
        aria-label="Mở menu"
        className="md:hidden shrink-0 text-ink/70 hover:text-ink rounded-lg p-1.5 hover:bg-paper"
      >
        <Menu size={20} />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          type="text"
          placeholder="Tìm giáo viên, học sinh, văn bản, công việc…"
          className="w-full rounded-lg border border-black/10 bg-paper py-2 pl-9 pr-3 text-sm focus-ring focus:outline-none"
        />
      </div>

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

      <button className="flex items-center gap-2 rounded-lg bg-hoa-950 px-3 md:px-3.5 py-2 text-sm font-medium text-white hover:bg-hoa-800 transition-colors shrink-0">
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
