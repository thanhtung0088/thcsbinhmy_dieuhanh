import { School } from 'lucide-react';

export function PageBanner() {
  return (
    <div className="rounded-xl bg-hoa-950 text-white px-6 py-5 flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-white/10 grid place-items-center shrink-0">
          <School size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">TRẠM ĐIỀU HÀNH TRƯỜNG THCS 3 ĐIỂM</h1>
          <p className="text-sm text-white/70 mt-0.5">
            01 Nhà trường thống nhất – 4 điểm trường – 01 hệ thống dữ liệu – 01 bộ máy điều hành
          </p>
        </div>
      </div>
      <div className="hidden lg:block text-right text-xs text-gold-400 italic leading-snug">
        Chuyển đổi số – Nâng tầm quản trị
        <br />
        Kiến tạo môi trường giáo dục hiện đại
      </div>
    </div>
  );
}
