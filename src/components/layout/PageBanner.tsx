import { School } from 'lucide-react';

export function PageBanner() {
  return (
    <div className="shrink-0 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 text-white px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-white/10 grid place-items-center shrink-0">
          <School size={22} />
        </div>
        <div className="min-w-0">
          <h1 className="text-base md:text-xl font-bold leading-tight truncate bg-gradient-to-r from-amber-300 via-gold-400 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
            TRẠM ĐIỀU HÀNH TRƯỜNG THCS BÌNH MỸ
          </h1>
          <p className="hidden sm:block text-xs md:text-sm text-white/75 mt-0.5">
            Hệ sinh thái quản trị điều hành trường học thế hệ 4.0
          </p>
        </div>
      </div>
      <div className="hidden lg:block text-right text-xs text-amber-300 italic leading-snug shrink-0">
        Chuyển đổi số – Nâng tầm quản trị
        <br />
        Kiến tạo môi trường giáo dục hiện đại
      </div>
    </div>
  );
}
