import type { LucideIcon } from 'lucide-react';
import {
  Landmark,
  Flag,
  GraduationCap,
  CalendarClock,
  Users,
  ClipboardList,
  Bot,
  Gauge,
  Wrench,
  Wallet,
  UserSquare2,
  HeartHandshake,
  FileText,
  CalendarDays,
  Trophy,
  ShieldCheck,
  MessageSquareText,
  FileBarChart2,
  LineChart,
  Sparkles,
  BadgeCheck,
  Globe2,
} from 'lucide-react';

export interface ModuleCard {
  no: number;
  title: string;
  icon: LucideIcon;
  color: string; // tailwind color stem, e.g. "blue"
  bullets: string[];
}

export const MODULE_CARDS: ModuleCard[] = [
  { no: 1, title: 'Quản trị nhà trường', icon: Landmark, color: 'blue', bullets: ['Thông tin trường, cơ cấu tổ chức', '3 điểm trường, Ban Giám hiệu', 'Hội đồng, quy chế, lịch công tác', 'Kế hoạch năm/tháng/tuần'] },
  { no: 2, title: 'Công tác Đảng', icon: Flag, color: 'rose', bullets: ['Đảng bộ, chi bộ, đảng viên', 'Nghị quyết, kế hoạch, báo cáo', 'Theo dõi sinh hoạt, kiểm tra, giám sát', 'Đánh giá, phát triển Đảng'] },
  { no: 3, title: 'Quản lý chuyên môn', icon: GraduationCap, color: 'emerald', bullets: ['Kế hoạch giáo dục, TKB, phân công', 'Hồ sơ chuyên môn, học liệu, dự kiểm tra', 'Theo dõi chất lượng, chuyên cần', 'Sinh hoạt chuyên môn'] },
  { no: 4, title: 'Thời khóa biểu & phân công', icon: CalendarClock, color: 'amber', bullets: ['Phân công chuyên môn thông minh', 'Phát hiện trùng tiết, thiếu tiết', 'Quản lý phòng học, giáo viên', 'Tối ưu lịch dạy học'] },
  { no: 5, title: 'Quản lý nhân sự', icon: Users, color: 'violet', bullets: ['Cán bộ, giáo viên, nhân viên', 'Hợp đồng, vị trí việc làm', 'Đào tạo, bồi dưỡng, thi đua', 'Đánh giá, khen thưởng, kỷ luật'] },
  { no: 6, title: 'Quản lý công việc', icon: ClipboardList, color: 'cyan', bullets: ['Tạo nhiệm vụ, giao việc', 'Theo dõi tiến độ, nhắc việc', 'Đánh giá kết quả, báo cáo', 'Quản lý theo trạng thái'] },
  { no: 7, title: 'AI Agent điều hành', icon: Bot, color: 'indigo', bullets: ['Trợ lý Hiệu trưởng số', 'Tự động tạo nhiệm vụ, phân công', 'Theo dõi, nhắc việc, báo cáo', '10 AI Agents chuyên biệt'] },
  { no: 8, title: 'KPI', icon: Gauge, color: 'sky', bullets: ['KPI nhà trường, điểm trường', 'KPI cá nhân, tổ chuyên môn', 'Phân tích, cảnh báo, đề xuất', 'Tùy chỉnh trọng số'] },
  { no: 9, title: 'Cơ sở vật chất', icon: Wrench, color: 'orange', bullets: ['Phòng học, phòng chức năng', 'Thiết bị, tài sản, bảo trì', 'Báo hỏng, theo dõi sửa chữa', 'An toàn, PCCC, camera, internet'] },
  { no: 10, title: 'Tài chính', icon: Wallet, color: 'green', bullets: ['Dự toán, thu/chi, mua sắm', 'Thanh toán, công nợ, hợp đồng', 'Báo cáo tài chính quản trị', 'Phân tích, cảnh báo (không giao dịch)'] },
  { no: 11, title: 'Học sinh', icon: UserSquare2, color: 'pink', bullets: ['Hồ sơ học sinh, lớp, điểm trường', 'Kết quả học tập, rèn luyện', 'Cảnh báo nguy cơ bỏ học', 'Thành tích, khen thưởng, kỷ luật'] },
  { no: 12, title: 'Phụ huynh', icon: HeartHandshake, color: 'teal', bullets: ['Thông báo, lịch học, chuyên cần', 'Kết quả học tập, rèn luyện', 'Trao đổi, khảo sát', 'Chỉ xem dữ liệu con mình'] },
  { no: 13, title: 'Văn bản điện tử', icon: FileText, color: 'indigo', bullets: ['Văn bản đến/đi, quyết định, kế hoạch', 'Tìm kiếm, lọc, gắn thẻ', 'AI tóm tắt, xác định nhiệm vụ', 'Quản lý quy trình xử lý'] },
  { no: 14, title: 'Lịch công tác', icon: CalendarDays, color: 'purple', bullets: ['Lịch ngày, tuần, tháng, năm học', 'Cuộc họp, dự giờ, kiểm tra, sự kiện', 'Kéo thả, đồng bộ Google Calendar', 'Nhắc việc tự động'] },
  { no: 15, title: 'Thi đua – khen thưởng', icon: Trophy, color: 'amber', bullets: ['Tiêu chí, minh chứng, điểm thi đua', 'Đề xuất, xét duyệt', 'Thống kê thành tích', 'Tổng hợp minh chứng (AI hỗ trợ)'] },
  { no: 16, title: 'Kiểm tra nội bộ', icon: ShieldCheck, color: 'slate', bullets: ['Kế hoạch kiểm tra, nội dung', 'Biên bản, kết luận, kiến nghị', 'Theo dõi khắc phục', 'Đánh giá hiệu quả'] },
  { no: 17, title: 'Khảo sát & phản hồi', icon: MessageSquareText, color: 'fuchsia', bullets: ['Giáo viên, học sinh, phụ huynh', 'Mức độ hài lòng, vấn đề nổi bật', 'Tổng hợp, đề xuất cải thiện', 'Phân tích xu hướng'] },
  { no: 18, title: 'Báo cáo thông minh', icon: FileBarChart2, color: 'teal', bullets: ['Hỏi bằng ngôn ngữ tự nhiên', 'Tạo báo cáo tự động', 'Phân tích dữ liệu đa chiều', 'Dự báo xu hướng'] },
  { no: 19, title: 'Phân tích dữ liệu', icon: LineChart, color: 'blue', bullets: ['Nhân sự, học sinh, chuyên cần', 'Công việc, KPI, tài chính, tài sản', 'Biểu đồ, dashboard, so sánh', 'Dự báo, cảnh báo'] },
  { no: 20, title: 'Trợ lý AI cho giáo viên', icon: Sparkles, color: 'violet', bullets: ['Soạn giáo án, đề kiểm tra', 'Tạo câu hỏi, rubric, học liệu', 'Phân tích kết quả học tập', 'Lập kế hoạch cá nhân'] },
  { no: 21, title: 'Trợ lý AI cho Ban giám hiệu', icon: BadgeCheck, color: 'green', bullets: ['Hôm nay cần biết gì?', 'Ưu tiên, quá hạn, sắp đến hạn', 'Đề xuất giải pháp', 'Hỗ trợ ra quyết định'] },
  { no: 22, title: 'Dịch vụ công', icon: Globe2, color: 'sky', bullets: ['Đăng ký tuyển sinh trực tuyến', 'Tra cứu, cấp lại học bạ, giấy chứng nhận', 'Tiếp nhận & xử lý hồ sơ hành chính trực tuyến', 'Tra cứu thủ tục, biểu mẫu giáo dục'] },
];

// Tailwind needs full, static class names to keep them in the build —
// a template-built class like `bg-${color}-600` gets purged. This map
// is the safelist for every color stem used above.
export const MODULE_COLOR_CLASSES: Record<string, { header: string; tint: string; bullet: string }> = {
  blue: { header: 'bg-blue-600', tint: 'bg-blue-50', bullet: 'text-blue-600' },
  rose: { header: 'bg-rose-600', tint: 'bg-rose-50', bullet: 'text-rose-600' },
  emerald: { header: 'bg-emerald-600', tint: 'bg-emerald-50', bullet: 'text-emerald-600' },
  amber: { header: 'bg-amber-600', tint: 'bg-amber-50', bullet: 'text-amber-600' },
  violet: { header: 'bg-violet-600', tint: 'bg-violet-50', bullet: 'text-violet-600' },
  cyan: { header: 'bg-cyan-600', tint: 'bg-cyan-50', bullet: 'text-cyan-600' },
  indigo: { header: 'bg-indigo-600', tint: 'bg-indigo-50', bullet: 'text-indigo-600' },
  sky: { header: 'bg-sky-600', tint: 'bg-sky-50', bullet: 'text-sky-600' },
  orange: { header: 'bg-orange-600', tint: 'bg-orange-50', bullet: 'text-orange-600' },
  green: { header: 'bg-green-600', tint: 'bg-green-50', bullet: 'text-green-600' },
  pink: { header: 'bg-pink-600', tint: 'bg-pink-50', bullet: 'text-pink-600' },
  teal: { header: 'bg-teal-600', tint: 'bg-teal-50', bullet: 'text-teal-600' },
  purple: { header: 'bg-purple-600', tint: 'bg-purple-50', bullet: 'text-purple-600' },
  slate: { header: 'bg-slate-600', tint: 'bg-slate-50', bullet: 'text-slate-600' },
  fuchsia: { header: 'bg-fuchsia-600', tint: 'bg-fuchsia-50', bullet: 'text-fuchsia-600' },
};
