import { useRef, useState } from 'react';
import {
  LayoutGrid,
  Building2,
  Landmark,
  Flag,
  UserSquare2,
  ClipboardList,
  Bot,
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
  UsersRound,
  FileSearch,
  Lock,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUnlock } from '../../context/UnlockContext';
import { can, type ModuleKey } from '../../lib/rbac';
import { AdminAccessModal } from '../shared/AdminAccessModal';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  moduleKey?: ModuleKey; // bỏ trống = mục công khai/dùng chung, không bao giờ khoá
}

const NAV: NavItem[] = [
  { to: '/', label: 'Tổng quan', icon: LayoutGrid },
  { to: '/gioi-thieu', label: 'Giới thiệu', icon: Map },
  { to: '/quan-tri', label: 'Quản trị', icon: Landmark, moduleKey: 'quan_tri' },
  { to: '/cong-tac-dang', label: 'Công tác Đảng', icon: Flag, moduleKey: 'cong_tac_dang' },
  { to: '/to-truong-cm', label: 'Tổ trưởng chuyên môn', icon: ToTruongIcon, moduleKey: 'chuyen_mon' },
  { to: '/ke-hoach-truong', label: 'Kế hoạch trường', icon: BookOpenCheck, moduleKey: 'chuyen_mon' },
  { to: '/cong-viec', label: 'Công việc', icon: ClipboardList, moduleKey: 'cong_viec' },
  { to: '/ai-agent-kpi', label: 'AI Agent & KPI', icon: Bot, moduleKey: 'ai_agent' },
  { to: '/phan-tich-van-ban-ai', label: 'Phân tích văn bản AI', icon: FileSearch, moduleKey: 'ai_agent' },
  { to: '/van-ban', label: 'Văn bản', icon: FileText, moduleKey: 'van_ban' },
  { to: '/lich-cong-tac', label: 'Lịch công tác', icon: CalendarDays, moduleKey: 'lich_cong_tac' },
  { to: '/kiem-tra', label: 'Kiểm tra', icon: ShieldCheck, moduleKey: 'kiem_tra' },
  { to: '/thi-dua', label: 'Thi đua', icon: Trophy, moduleKey: 'thi_dua' },
  { to: '/phan-tich', label: 'Phân tích và dự báo', icon: LineChart, moduleKey: 'phan_tich' },
  { to: '/bao-cao', label: 'Báo cáo', icon: FileBarChart2, moduleKey: 'bao_cao' },
  { to: '/thong-bao', label: 'Thông báo', icon: Bell },
  { to: '/dich-vu-cong', label: 'Dịch vụ công', icon: Globe2 },
  { to: '/hoc-sinh', label: 'Học sinh', icon: UserSquare2, moduleKey: 'hoc_sinh' },
  { to: '/gvcn', label: 'Giáo viên chủ nhiệm', icon: UsersRound, moduleKey: 'hoc_sinh' },
  { to: '/kho-tai-nguyen', label: 'Kho tài nguyên và tiện ích', icon: BookMarked },
  { to: '/cai-dat', label: 'Cài đặt', icon: Settings, moduleKey: 'cai_dat' },
];

// Khách chưa đăng nhập (phụ huynh, học sinh, người ngoài trường): CHỈ được
// xem/dùng đúng 4 trang này — mọi mục khác trên Sidebar hiện khoá với họ,
// kể cả những mục vốn "công khai" với người đã đăng nhập (vd Giới thiệu).
const GUEST_ALLOWED_PATHS = new Set(['/', '/gioi-thieu', '/dich-vu-cong', '/kho-tai-nguyen', '/thong-bao']);

export const IMPLEMENTED_ROUTES = new Set(['/', '/diem-truong']);

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const { unlocked } = useUnlock();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const clickCount = useRef(0);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleLogoClick() {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      setShowAdminModal(true);
      return;
    }
    clickTimer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 1200);
  }

  function isLocked(item: NavItem) {
    if (!user) return !GUEST_ALLOWED_PATHS.has(item.to);
    if (user.role === 'super_admin') return false;
    if (item.to === '/quan-tri') {
      // Quản trị giờ gộp cả 4 điểm trường/Tài chính/CSVC — chỉ coi là khoá
      // nếu KHÔNG có quyền với bất kỳ tab con nào bên trong.
      const keys: ModuleKey[] = ['quan_tri', 'tai_chinh', 'co_so_vat_chat'];
      const hasAny = keys.some((k) => can(user.role, k, 'view') || unlocked.has(k));
      return !hasAny;
    }
    if (!item.moduleKey) return false;
    return !can(user.role, item.moduleKey, 'view') && !unlocked.has(item.moduleKey);
  }

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-hoa-950 text-white/90 shrink-0
          transition-transform duration-200 ease-out
          md:static md:z-auto md:flex md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="px-5 py-6 border-b border-white/10 flex items-center gap-3">
          <button
            onClick={handleLogoClick}
            title=""
            className="h-11 w-11 rounded-full bg-white shrink-0 overflow-hidden focus:outline-none"
          >
            <img
              src="/logo-thcs-binh-my.png"
              alt="Logo THCS Bình Mỹ"
              className="h-full w-full object-contain pointer-events-none select-none"
            />
          </button>
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
          {!user && (
            <p className="px-3 py-2 text-[11px] text-white/40 leading-relaxed">
              Đăng nhập để mở các mục bên dưới theo đúng vai trò. Chưa đăng nhập chỉ dùng được Tổng quan, Dịch vụ
              công, Kho tài nguyên và Thông báo chung.
            </p>
          )}
          {NAV.map((item) => {
            const locked = isLocked(item);
            const guestBlocked = locked && !user;
            return (
              <NavLink
                key={item.to}
                to={guestBlocked ? '#' : item.to}
                end={item.to === '/'}
                onClick={(e) => {
                  if (guestBlocked) {
                    e.preventDefault();
                    return;
                  }
                  onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive && !locked
                      ? 'bg-hoa-700 text-white font-medium'
                      : locked
                        ? 'text-white/35 hover:bg-hoa-900/60 hover:text-white/60'
                        : 'text-white/70 hover:bg-hoa-900 hover:text-white'
                  }`
                }
              >
                <item.icon size={17} strokeWidth={2} />
                <span className="truncate flex-1">{item.label}</span>
                {locked && <Lock size={12} className="shrink-0 opacity-60" />}
              </NavLink>
            );
          })}
        </nav>
        <div className="px-4 py-3 border-t border-white/10 text-[11px] text-white/40">
          01 nhà trường · 03 điểm trường · 01 dữ liệu
        </div>
      </aside>

      {showAdminModal && <AdminAccessModal onClose={() => setShowAdminModal(false)} />}
    </>
  );
}
