import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Landmark, Users, Building2, Wallet, Wrench } from 'lucide-react';
import { CAMPUSES, LEADERSHIP, OFFICE_STAFF, PARTY_CELLS, TOTAL_PARTY_MEMBERS } from '../data/mockData';
import { NhanSuChuyenMon } from './NhanSuChuyenMon';
import { CampusOverview } from './CampusOverview';
import { DepartmentWorkspace } from './DepartmentWorkspace';
import { useAuth } from '../context/AuthContext';
import { useUnlock } from '../context/UnlockContext';
import { can, type ModuleKey } from '../lib/rbac';
import { LockedModuleScreen } from '../components/shared/LockedModuleScreen';

type Tab = 'tong_quan' | 'nhan_su_cm' | 'diem_truong' | 'tai_chinh' | 'co_so_vat_chat';

const TAB_PARAM: Record<string, Tab> = {
  'nhan-su': 'nhan_su_cm',
  'diem-truong': 'diem_truong',
  'tai-chinh': 'tai_chinh',
  'co-so-vat-chat': 'co_so_vat_chat',
};

// Mỗi tab có thể yêu cầu quyền khác nhau — vd Kế toán chỉ có quyền
// "tai_chinh", KHÔNG có quyền "quan_tri", nên phải kiểm tra riêng từng tab
// thay vì khoá cả trang theo 1 quyền duy nhất.
const TAB_MODULE_KEY: Record<Tab, ModuleKey | null> = {
  tong_quan: 'quan_tri',
  nhan_su_cm: 'quan_tri',
  diem_truong: null, // thông tin chung, ai đăng nhập cũng xem được
  tai_chinh: 'tai_chinh',
  co_so_vat_chat: 'co_so_vat_chat',
};

export function QuanTri() {
  const { user } = useAuth();
  const { unlocked } = useUnlock();
  const [searchParams] = useSearchParams();
  const paramTab = searchParams.get('tab');
  const initialTab: Tab = searchParams.get('q')
    ? 'nhan_su_cm'
    : paramTab && TAB_PARAM[paramTab]
      ? TAB_PARAM[paramTab]
      : 'tong_quan';
  const [tab, setTab] = useState<Tab>(initialTab);

  const TABS: { key: Tab; label: string; icon: typeof Landmark }[] = [
    { key: 'tong_quan', label: 'Tổng quan quản trị', icon: Landmark },
    { key: 'nhan_su_cm', label: 'Nhân sự - Chuyên môn', icon: Users },
    { key: 'diem_truong', label: '4 điểm trường', icon: Building2 },
    { key: 'tai_chinh', label: 'Tài chính', icon: Wallet },
    { key: 'co_so_vat_chat', label: 'Cơ sở vật chất', icon: Wrench },
  ];

  const requiredKey = TAB_MODULE_KEY[tab];
  const allowed =
    !requiredKey ||
    !user ||
    user.role === 'super_admin' ||
    can(user.role, requiredKey, 'view') ||
    unlocked.has(requiredKey);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600">QUẢN TRỊ NHÀ TRƯỜNG</p>
        <h2 className="text-xl font-bold text-ink mt-0.5">Quản trị</h2>
      </div>

      <div className="flex gap-1 border-b border-black/10 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm border-b-2 -mb-px shrink-0 ${tab === t.key ? 'border-blue-600 text-blue-700 font-medium' : 'border-transparent text-ink/50 hover:text-ink'}`}
          >
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {!allowed && requiredKey ? (
        <LockedModuleScreen moduleKey={requiredKey} />
      ) : (
        <>
          {tab === 'tong_quan' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-sm font-semibold text-ink/70 mb-3">Ban giám hiệu</p>
                <ul className="space-y-1.5">
                  {LEADERSHIP.map((l) => (
                    <li key={l.id} className="text-sm text-ink flex justify-between">
                      <span>{l.title}{l.concurrent ? ` (kiêm ${l.concurrent})` : ''}</span>
                      <span className="font-medium">{l.name}</span>
                    </li>
                  ))}
                  <li className="text-xs text-amber-600/80 pt-1">
                    Điểm chính và Điểm 3 hiện chưa có quyết định phân công Phó Hiệu trưởng phụ trách.
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-sm font-semibold text-ink/70 mb-3">4 điểm trường</p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {CAMPUSES.map((c) => (
                    <li key={c.id} className="text-xs text-ink/70 border border-black/5 rounded-lg px-3 py-2">
                      <span className="font-medium text-ink">{c.name}</span> — {c.formerName} · {c.classCount} lớp
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setTab('diem_truong')}
                  className="mt-3 text-xs font-medium text-blue-600 hover:underline"
                >
                  Xem chi tiết 4 điểm trường →
                </button>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-sm font-semibold text-ink/70 mb-3">Tổ Văn phòng</p>
                <ul className="space-y-1.5">
                  {OFFICE_STAFF.map((o) => (
                    <li key={o.campusId} className="text-sm text-ink/80 flex justify-between">
                      <span>{CAMPUSES.find((c) => c.id === o.campusId)?.name} — {o.head.title}</span>
                      <span className="font-medium text-ink">{o.head.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-black/10 bg-white p-4">
                <p className="text-sm font-semibold text-ink/70 mb-3">Đảng bộ — {TOTAL_PARTY_MEMBERS} đảng viên, 7 chi bộ</p>
                <ul className="grid sm:grid-cols-2 gap-1.5">
                  {PARTY_CELLS.map((c) => (
                    <li key={c.id} className="text-xs text-ink/70 flex justify-between">
                      <span>{c.name}</span>
                      <span className="text-ink/40">{c.memberCount} đảng viên</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === 'nhan_su_cm' && <NhanSuChuyenMon />}
          {tab === 'diem_truong' && <CampusOverview />}
          {tab === 'tai_chinh' && <DepartmentWorkspace moduleName="Tài chính" phase="Phase 4" />}
          {tab === 'co_so_vat_chat' && (
            <DepartmentWorkspace moduleName="Cơ sở vật chất & tài sản" phase="Phase 4" departmentKey="Cơ sở vật chất" />
          )}
        </>
      )}
    </div>
  );
}
