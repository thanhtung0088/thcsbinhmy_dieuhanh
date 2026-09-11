import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';
import { useUnlock } from '../../context/UnlockContext';
import type { ModuleKey } from '../../lib/rbac';

const MODULE_LABEL: Partial<Record<ModuleKey, string>> = {
  quan_tri: 'Quản trị',
  cong_tac_dang: 'Công tác Đảng',
  chuyen_mon: 'Chuyên môn',
  nhan_su: 'Nhân sự',
  hanh_chinh: 'Hành chính Văn phòng',
  hoc_sinh: 'Học sinh',
  cong_viec: 'Công việc',
  ai_agent: 'AI Agent & KPI',
  kpi: 'AI Agent & KPI',
  co_so_vat_chat: 'Cơ sở vật chất',
  tai_chinh: 'Tài chính',
  van_ban: 'Văn bản',
  lich_cong_tac: 'Lịch công tác',
  kiem_tra: 'Kiểm tra nội bộ',
  thi_dua: 'Thi đua',
  phan_tich: 'Phân tích và dự báo',
  bao_cao: 'Báo cáo',
  thong_bao: 'Thông báo',
  cai_dat: 'Cài đặt',
};

export function LockedModuleScreen({ moduleKey }: { moduleKey: ModuleKey }) {
  const { unlock } = useUnlock();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!code.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/verify-role-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleKey, code: code.trim() }),
      });
      const data = await resp.json();
      if (resp.ok && data.ok) {
        unlock(moduleKey);
      } else {
        setError('Mã không đúng.');
      }
    } catch {
      setError('Không kết nối được máy chủ xác thực. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="h-14 w-14 rounded-full bg-hoa-950/5 grid place-items-center mb-4">
        <Lock size={22} className="text-hoa-950" />
      </div>
      <p className="text-sm font-semibold text-ink">Khu vực "{MODULE_LABEL[moduleKey] ?? moduleKey}" đang khoá</p>
      <p className="text-xs text-ink/50 mt-1 max-w-xs">
        Tài khoản của bạn chưa được cấp quyền xem mục này. Nhập mã mở khoá của khu vực để tiếp tục.
      </p>
      <div className="flex items-center gap-2 mt-4">
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Nhập mã mở khoá"
          autoFocus
          className="rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring w-48"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !code.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-hoa-950 text-white px-3.5 py-2 text-sm font-medium hover:bg-hoa-800 disabled:opacity-40"
        >
          {loading && <Loader2 size={13} className="animate-spin" />}
          Mở khoá
        </button>
      </div>
      {error && <p className="text-xs text-signal-overdue mt-2">{error}</p>}
    </div>
  );
}
