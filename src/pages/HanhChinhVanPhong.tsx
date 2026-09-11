import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { OFFICE_DEPARTMENTS } from '../data/officeDepartments';

export function HanhChinhVanPhong() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600">HÀNH CHÍNH VĂN PHÒNG</p>
        <h2 className="text-xl font-bold text-ink mt-0.5">Các bộ phận văn phòng</h2>
        <p className="text-xs text-ink/50 mt-1 max-w-xl">
          Mỗi bộ phận có không gian làm việc riêng: dán dữ liệu từ Excel, tải file lên Google Drive, họp online, và
          gửi báo cáo thẳng về Ban Giám hiệu.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {OFFICE_DEPARTMENTS.map((d) => (
          <Link
            key={d.key}
            to={`/hanh-chinh-van-phong/${d.key}`}
            className="flex items-start gap-3 rounded-xl border border-black/10 bg-white p-4 hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 grid place-items-center shrink-0">
              <d.icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{d.name}</p>
              <p className="text-xs text-ink/50 mt-0.5">{d.desc}</p>
            </div>
            <ChevronRight size={16} className="text-ink/20 shrink-0 mt-1" />
          </Link>
        ))}
      </div>
    </div>
  );
}
