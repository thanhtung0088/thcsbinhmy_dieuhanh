import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../lib/rbac';

export function Login() {
  const { login, demoUsers } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-hoa-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <p className="text-[11px] tracking-wide text-gold-500 font-semibold">TRẠM ĐIỀU HÀNH</p>
        <h1 className="text-xl font-bold text-ink mt-1">THCS Bình Mỹ · 3 điểm trường</h1>
        <p className="text-sm text-ink/60 mt-2 mb-6">
          Chọn tài khoản demo để xem hệ thống theo từng vai trò (RBAC).
        </p>
        <div className="space-y-2">
          {demoUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                login(u.id);
                navigate('/');
              }}
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
      </div>
    </div>
  );
}
