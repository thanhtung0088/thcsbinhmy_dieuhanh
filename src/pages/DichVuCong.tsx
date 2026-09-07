import { useState } from 'react';
import { Landmark, GraduationCap, Users2, type LucideIcon } from 'lucide-react';
import {
  UserPlus, ArrowLeftRight, ArrowRightLeft, FileCheck2, BookOpenText, ClipboardX,
  RotateCcw, CreditCard, FileWarning, Home, CalendarClock, ShieldCheck,
  FileSignature, Award, BadgeCheck, UserCog, FileStack, HeartHandshake, Building,
} from 'lucide-react';

interface ServiceItem {
  label: string;
  icon: LucideIcon;
}

const TABS: { id: string; label: string; icon: LucideIcon; items: ServiceItem[] }[] = [
  {
    id: 'truong-lop',
    label: 'Trường lớp',
    icon: Landmark,
    items: [
      { label: 'Đăng ký sử dụng cơ sở vật chất, hội trường', icon: Building },
      { label: 'Đăng ký lịch họp / sự kiện chung', icon: CalendarClock },
      { label: 'Công khai thông tin trường, lớp theo quy định', icon: FileStack },
      { label: 'Đề nghị xác nhận thông tin đơn vị trường học', icon: FileCheck2 },
      { label: 'Đăng ký hoạt động ngoại khóa, thiện nguyện', icon: HeartHandshake },
    ],
  },
  {
    id: 'phu-huynh-hoc-sinh',
    label: 'Phụ huynh - Học sinh',
    icon: Users2,
    items: [
      { label: 'Tuyển sinh đầu cấp', icon: UserPlus },
      { label: 'Thủ tục chuyển trường đi', icon: ArrowLeftRight },
      { label: 'Thủ tục chuyển trường đến', icon: ArrowRightLeft },
      { label: 'Cấp Giấy xác nhận đang học / đã học', icon: FileCheck2 },
      { label: 'Cấp lại bảng điểm, học bạ', icon: BookOpenText },
      { label: 'Đơn xin nghỉ học có phép', icon: ClipboardX },
      { label: 'Đơn xin học lại / bảo lưu kết quả', icon: RotateCcw },
      { label: 'Đơn xin miễn, giảm học phí', icon: CreditCard },
      { label: 'Đơn xin cấp lại học bạ/bằng TN bị thất lạc', icon: FileWarning },
    ],
  },
  {
    id: 'giao-vien-nhan-vien',
    label: 'Giáo viên - Nhân viên',
    icon: GraduationCap,
    items: [
      { label: 'Đơn xin nghỉ phép / việc riêng', icon: ClipboardX },
      { label: 'Đơn xin chuyển công tác / thuyên chuyển', icon: UserCog },
      { label: 'Hồ sơ xét nâng lương, nâng ngạch', icon: Award },
      { label: 'Hồ sơ xét thi đua, khen thưởng', icon: BadgeCheck },
      { label: 'Đơn xin cấp Giấy xác nhận công tác', icon: FileSignature },
      { label: 'Đăng ký bồi dưỡng chuyên môn, tập huấn', icon: GraduationCap },
      { label: 'Minh chứng đánh giá chuẩn nghề nghiệp', icon: ShieldCheck },
      { label: 'Đơn xin thôi việc / nghỉ hưu', icon: Home },
    ],
  },
];

export function DichVuCong() {
  const [tab, setTab] = useState(TABS[0].id);
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div className="space-y-4">
      <div className="rounded-xl overflow-hidden border border-black/10">
        <div className="bg-blue-600 text-white px-5 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/15 grid place-items-center shrink-0">
            <Landmark size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-100">DỊCH VỤ CÔNG TRỰC TUYẾN</p>
            <h2 className="text-lg font-bold leading-tight">Trường THCS Bình Mỹ</h2>
          </div>
        </div>
        <div className="flex bg-white border-b border-black/10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold uppercase tracking-wide border-b-2 ${
                tab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-ink/40 hover:text-ink'
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
        <div className="bg-paper p-4 grid sm:grid-cols-2 gap-3">
          {active.items.map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 text-left hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 grid place-items-center shrink-0">
                <item.icon size={16} />
              </div>
              <span className="text-sm font-medium text-ink">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-ink/40">
        Danh mục thủ tục mang tính tổng hợp theo các quy định phổ biến hiện hành ở cấp THCS — nộp/xử lý hồ sơ trực
        tuyến (form + đính kèm) sẽ được xây dựng ở Phase 4 theo lộ trình.
      </p>
    </div>
  );
}
