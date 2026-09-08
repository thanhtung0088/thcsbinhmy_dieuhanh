import { Landmark, GraduationCap, Users2, type LucideIcon } from 'lucide-react';
import {
  UserPlus, ArrowLeftRight, ArrowRightLeft, FileCheck2, BookOpenText, ClipboardX,
  RotateCcw, CreditCard, FileWarning, Home, CalendarClock, ShieldCheck,
  FileSignature, Award, BadgeCheck, UserCog, FileStack, HeartHandshake, Building,
} from 'lucide-react';

export interface ServiceItem {
  label: string;
  icon: LucideIcon;
}

export interface ServiceTab {
  id: string;
  label: string;
  icon: LucideIcon;
  items: ServiceItem[];
}

// Danh mục thủ tục mang tính tổng hợp theo các quy định phổ biến hiện
// hành ở cấp THCS (không phải toàn văn quy định — chỉ là danh mục điều
// hướng để tạo yêu cầu gửi về BGH/Hành chính VP xử lý).
export const DICH_VU_CONG_TABS: ServiceTab[] = [
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
