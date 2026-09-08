import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Circle } from 'lucide-react';
import { LEADERSHIP, DEMO_USERS } from '../../data/mockData';

const VISIT_KEY = 'thcsbm_session_visits';

function useSessionVisitCount() {
  const [count, setCount] = useState(1);
  useEffect(() => {
    try {
      const current = Number(sessionStorage.getItem(VISIT_KEY) ?? '0') + 1;
      sessionStorage.setItem(VISIT_KEY, String(current));
      setCount(current);
    } catch {
      // sessionStorage unavailable (e.g. private mode) — keep default
    }
  }, []);
  return count;
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Footer() {
  const visits = useSessionVisitCount();
  const now = useClock();
  // Số người "đang online" là minh họa cho UI trong Phase 1 (chưa nối
  // backend/WebSocket) — hiển thị số tài khoản demo đang sẵn sàng,
  // không phải số kết nối thực tế trên toàn hệ thống.
  const onlineDemoCount = DEMO_USERS.length;

  return (
    <footer className="border-t border-black/10 bg-hoa-950 text-white/80 text-xs">
      <div className="px-6 py-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-bold text-white">THCS Bình Mỹ</p>
          <p className="mt-1 text-white/50">01 nhà trường · 03 điểm trường · 01 hệ thống dữ liệu</p>
          <ul className="mt-2 space-y-0.5 text-white/60">
            {LEADERSHIP.map((l) => (
              <li key={l.id}>
                {l.title.replace('Phó Hiệu trưởng phụ trách ', 'PHT ')}: {l.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Liên kết nhanh</p>
          <ul className="mt-2 space-y-1 text-white/60">
            <li><Link to="/" className="hover:text-white">Trung tâm điều hành</Link></li>
            <li><Link to="/diem-truong" className="hover:text-white">3 điểm trường</Link></li>
            <li><Link to="/gioi-thieu" className="hover:text-white">Giới thiệu</Link></li>
            <li><Link to="/kho-tai-nguyen" className="hover:text-white">Kho tài nguyên và tiện ích</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Trạng thái hệ thống</p>
          <div className="mt-2 flex items-center gap-1.5 text-emerald-400">
            <Circle size={8} className="fill-current" />
            <span>{onlineDemoCount} tài khoản demo đang sẵn sàng</span>
          </div>
          <p className="mt-1 text-white/40">Lượt truy cập phiên này: {visits}</p>
          <p className="mt-1 text-white/40">
            {now.toLocaleDateString('vi-VN')} · {now.toLocaleTimeString('vi-VN')}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Bản quyền</p>
          <p className="mt-2 text-white/50">© {now.getFullYear()} Trường THCS Bình Mỹ</p>
          <p className="mt-1 text-white/50">Thiết kế &amp; lập trình: Nguyễn Thanh Tùng</p>
        </div>
      </div>
    </footer>
  );
}
