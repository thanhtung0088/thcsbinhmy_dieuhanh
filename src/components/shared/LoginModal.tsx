import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Crown, GraduationCap, Users, Heart, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../lib/rbac';
import type { RoleId } from '../../types';

const GROUPS: { key: string; label: string; icon: typeof Crown; roles: RoleId[] }[] = [
  { key: 'bgh', label: 'BGH', icon: Crown, roles: ['hieu_truong', 'pho_hieu_truong', 'cntt', 'to_truong_vp'] },
  { key: 'to_truong_cm', label: 'Tổ trưởng CM', icon: Users, roles: ['to_truong_cm', 'bi_thu_dang'] },
  { key: 'giao_vien', label: 'Giáo viên', icon: GraduationCap, roles: ['giao_vien'] },
  {
    key: 'nhan_vien',
    label: 'Nhân viên',
    icon: Users,
    roles: ['ke_toan', 'van_thu', 'thiet_bi', 'thu_vien', 'y_te', 'bao_ve', 'nhan_vien'],
  },
  { key: 'ph', label: 'Phụ huynh HS', icon: Heart, roles: [] },
];

export function LoginModal({ onClose }: { onClose: () => void }) {
  const { login, demoUsers } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('bgh');
  const [verifiedGroups, setVerifiedGroups] = useState<Set<string>>(new Set());
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeGroup = GROUPS.find((g) => g.key === tab)!;
  const usersInGroup = demoUsers.filter((u) => activeGroup.roles.includes(u.role));
  const needsCode = activeGroup.key !== 'ph' && !verifiedGroups.has(activeGroup.key);

  function switchTab(key: string) {
    setTab(key);
    setCode('');
    setError(null);
  }

  async function handleVerifyCode() {
    if (!code.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/verify-group-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group: activeGroup.key, code: code.trim() }),
      });
      const data = await resp.json();
      if (resp.ok && data.ok) {
        setVerifiedGroups((prev) => new Set(prev).add(activeGroup.key));
        setCode('');
      } else {
        setError('Mã không đúng.');
      }
    } catch {
      setError('Không kết nối được máy chủ xác thực. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  }

  function handlePick(userId: string) {
    login(userId);
    onClose();
    navigate('/');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-hoa-950 text-white">
          <p className="text-sm font-bold">Đăng nhập hệ thống</p>
          <button onClick={onClose} className="text-white/60 hover:text-white" aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-black/10 overflow-x-auto">
          {GROUPS.map((g) => (
            <button
              key={g.key}
              onClick={() => switchTab(g.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1 text-[10px] font-medium border-b-2 transition-colors shrink-0 min-w-[64px] ${
                tab === g.key ? 'border-hoa-700 text-hoa-950' : 'border-transparent text-ink/40 hover:text-ink/70'
              }`}
            >
              <g.icon size={16} />
              {g.label}
            </button>
          ))}
        </div>

        <div className="p-4 max-h-[50vh] overflow-y-auto">
          {tab === 'ph' ? (
            <div className="text-center py-4 space-y-3">
              <Heart size={28} className="mx-auto text-rose-400" />
              <p className="text-sm text-ink/70">
                Phụ huynh không cần đăng nhập — có thể dùng ngay trang <b>Dịch vụ công</b> để gửi yêu cầu, hỏi thủ
                tục, không cần tài khoản.
              </p>
              <button
                onClick={() => {
                  onClose();
                  navigate('/dich-vu-cong');
                }}
                className="rounded-lg bg-rose-600 text-white px-4 py-2 text-sm font-medium hover:bg-rose-700"
              >
                Vào Dịch vụ công
              </button>
            </div>
          ) : needsCode ? (
            <div className="space-y-3 py-2">
              <p className="text-xs text-ink/60 text-center">
                Nhập mã dùng chung của nhóm <b>{activeGroup.label}</b> để xem danh sách tài khoản.
              </p>
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyCode()}
                placeholder="Nhập mã nhóm"
                autoFocus
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring text-center"
              />
              {error && <p className="text-xs text-signal-overdue text-center">{error}</p>}
              <button
                onClick={handleVerifyCode}
                disabled={loading || !code.trim()}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-hoa-950 text-white py-2 text-sm font-medium hover:bg-hoa-800 disabled:opacity-40"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Xác nhận
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {usersInGroup.length === 0 && (
                <p className="text-xs text-ink/40 text-center py-4">Chưa có tài khoản demo cho nhóm này.</p>
              )}
              {usersInGroup.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handlePick(u.id)}
                  className="w-full flex items-center gap-3 rounded-lg border border-black/10 px-3 py-2.5 text-left hover:border-hoa-700 hover:bg-paper transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-hoa-900 text-white grid place-items-center text-xs font-semibold shrink-0">
                    {u.avatarInitials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{u.name}</p>
                    <p className="text-xs text-ink/50">{ROLE_LABELS[u.role]}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
