import { School } from 'lucide-react';

export function PageBanner() {
  return (
    <div className="shrink-0 bg-hoa-950 text-white px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-white/10 grid place-items-center shrink-0">
          <School size={22} />
        </div>
        <div className="min-w-0">
          <h1 className="text-base md:text-xl font-bold leading-tight truncate">TRẠM ĐIỀU HÀNH TRƯỜNG THCS 3 ĐIỂM</h1>
          <p className="hidden sm:block text-xs md:text-sm text-white/70 mt-0.5">
            01 Nhà trường thống nhất – 4 điểm trường – 01 hệ thống dữ liệu – 01 bộ máy điều hành
          </p>
        </div>
      </div>
      <div className="hidden lg:block text-right text-xs text-gold-400 italic leading-snug shrink-0">
        Chuyển đổi số – Nâng tầm quản trị
        <br />
        Kiến tạo môi trường giáo dục hiện đại
      </div>
    </div>
  );
}
