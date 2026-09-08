import {
  LayoutGrid,
  Building2,
  Landmark,
  Flag,
  GraduationCap,
  Users,
  UserSquare2,
  ClipboardList,
  Bot,
  Gauge,
  Wrench,
  Wallet,
  FileText,
  CalendarDays,
  ShieldCheck,
  Trophy,
  LineChart,
  FileBarChart2,
  Bell,
  Settings,
  Globe2,
  Map,
  BookMarked,
  GraduationCap as ToTruongIcon,
  BookOpenCheck,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
}

const NAV: NavItem[] = [
  { to: '/', label: 'Tổng quan', icon: LayoutGrid },
  { to: '/gioi-thieu', label: 'Giới thiệu', icon: Map },
  { to: '/diem-truong', label: '4 điểm trường', icon: Building2 },
  { to: '/quan-tri', label: 'Quản trị', icon: Landmark },
  { to: '/cong-tac-dang', label: 'Công tác Đảng', icon: Flag },
  { to: '/to-truong-cm', label: 'Tổ trưởng chuyên môn', icon: ToTruongIcon },
  { to: '/ke-hoach-truong', label: 'Kế hoạch trường', icon: BookOpenCheck },
  { to: '/hoc-sinh', label: 'Học sinh', icon: UserSquare2 },
  { to: '/cong-viec', label: 'Công việc', icon: ClipboardList },
  { to: '/ai-agent-kpi', label: 'AI Agent & KPI', icon: Bot },
  { to: '/co-so-vat-chat', label: 'Cơ sở vật chất', icon: Wrench },
  { to: '/tai-chinh', label: 'Tài chính', icon: Wallet },
  { to: '/van-ban', label: 'Văn bản', icon: FileText },
  { to: '/lich-cong-tac', label: 'Lịch công tác', icon: CalendarDays },
  { to: '/kiem-tra', label: 'Kiểm tra', icon: ShieldCheck },
  { to: '/thi-dua', label: 'Thi đua', icon: Trophy },
  { to: '/phan-tich', label: 'Phân tích và dự báo', icon: LineChart },
  { to: '/bao-cao', label: 'Báo cáo', icon: FileBarChart2 },
  { to: '/thong-bao', label: 'Thông báo', icon: Bell },
  { to: '/dich-vu-cong', label: 'Dịch vụ công', icon: Globe2 },
  { to: '/kho-tai-nguyen', label: 'Kho tài nguyên và tiện ích', icon: BookMarked },
  { to: '/cai-dat', label: 'Cài đặt', icon: Settings },
];

// Only these are wired to real screens in Phase 1; the rest render
// the "coming in Phase N" placeholder so the full IA is navigable
// and reviewable from day one.
export const IMPLEMENTED_ROUTES = new Set(['/', '/diem-truong']);

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Backdrop — mobile only, shown while drawer is open */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-hoa-950 text-white/90 shrink-0
          transition-transform duration-200 ease-out
          md:static md:z-auto md:flex md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-5 py-6 border-b border-white/10 flex items-center gap-3">
          <img
            src="/logo-thcs-binh-my.png"
            alt="Logo THCS Bình Mỹ"
            className="h-11 w-11 rounded-full bg-white object-contain shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] tracking-wide text-gold-400 font-semibold">TRẠM ĐIỀU HÀNH</p>
            <h1 className="text-base font-bold leading-tight">
              THCS Bình Mỹ
              <span className="block text-xs font-medium text-white/60">3 điểm trường</span>
            </h1>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng menu"
            className="md:hidden text-white/60 hover:text-white shrink-0"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-hoa-700 text-white font-medium'
                    : 'text-white/70 hover:bg-hoa-900 hover:text-white'
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-white/10 text-[11px] text-white/40">
          01 nhà trường · 03 điểm trường · 01 dữ liệu
        </div>
      </aside>
    </>
  );
}
