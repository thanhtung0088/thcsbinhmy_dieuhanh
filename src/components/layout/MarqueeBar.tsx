const MESSAGES = [
  'TRẠM ĐIỀU HÀNH TRƯỜNG THCS BÌNH MỸ — 01 nhà trường · 03 điểm trường · 01 hệ thống dữ liệu',
  'Hiệu trưởng: Trần Đỗ Phương Bình · PHT Điểm 1: Nguyễn Thị Mến · PHT Điểm 2: Nguyễn Thanh Nhàn',
  'Phân công chuyên môn Học kỳ I năm học 2026-2027 áp dụng từ 07/09/2026',
  'Thiết kế & lập trình: Nguyễn Thanh Tùng',
];

export function MarqueeBar() {
  const text = MESSAGES.join('    •    ');
  return (
    <div className="bg-blue-600 text-white overflow-hidden whitespace-nowrap">
      <div className="inline-block py-1.5 marquee-track text-xs font-medium tracking-wide">
        <span className="px-4">{text}</span>
        <span className="px-4">{text}</span>
      </div>
      <style>{`
        .marquee-track {
          display: inline-flex;
          animation: marquee-scroll 32s linear infinite;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
