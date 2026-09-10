const MESSAGES = [
  'Chào mừng quý Thầy/Cô, quý Phụ huynh học sinh đến với TRẠM ĐIỀU HÀNH TRƯỜNG THCS BÌNH MỸ',
  'Mọi thắc mắc, yêu cầu về tài khoản, mã truy cập vui lòng liên hệ Văn phòng nhà trường',
  'Đăng nhập bằng đúng tài khoản cá nhân được cấp để đảm bảo an toàn dữ liệu',
  'Thiết kế & lập trình: Nguyễn Thanh Tùng',
];

export function MarqueeBar() {
  const text = MESSAGES.join('    •    ');
  return (
    <div className="bg-white text-red-700 border-b border-black/5 overflow-hidden whitespace-nowrap">
      <div className="inline-block py-1.5 marquee-track text-xs font-semibold tracking-wide">
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
