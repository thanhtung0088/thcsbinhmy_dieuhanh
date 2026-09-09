import { useState } from 'react';
import { ShieldAlert, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ADMIN_USER = {
  id: 'admin',
  name: 'Quản trị hệ thống',
  role: 'super_admin' as const,
  campusId: 'all' as const,
  avatarInitials: 'AD',
};

export function AdminAccessModal({ onClose }: { onClose: () => void }) {
  const { loginAs } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!code.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch('/api/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await resp.json();
      if (resp.ok && data.ok) {
        loginAs(ADMIN_USER);
        onClose();
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-hoa-950">
            <ShieldAlert size={18} />
            <p className="text-sm font-bold">Truy cập Quản trị hệ thống</p>
          </div>
          <button onClick={onClose} className="text-ink/40 hover:text-ink" aria-label="Đóng">
            <X size={16} />
          </button>
        </div>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Nhập mã truy cập"
          autoFocus
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring"
        />
        {error && <p className="text-xs text-signal-overdue mt-1.5">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading || !code.trim()}
          className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-lg bg-hoa-950 text-white py-2 text-sm font-medium hover:bg-hoa-800 disabled:opacity-40"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Xác nhận
        </button>
      </div>
    </div>
  );
}
