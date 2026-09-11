import type { LucideIcon } from 'lucide-react';
import { Cpu, BookOpenCheck, Wallet, HeartPulse, Library, Eye, Brain, ShieldCheck, Sparkles } from 'lucide-react';

export interface OfficeDept {
  key: string;
  name: string;
  icon: LucideIcon;
  desc: string;
}

export const OFFICE_DEPARTMENTS: OfficeDept[] = [
  { key: 'cntt', name: 'Công nghệ thông tin (CNTT)', icon: Cpu, desc: 'Hạ tầng mạng, thiết bị, phần mềm quản lý trường học.' },
  { key: 'hoc-vu', name: 'Học vụ', icon: BookOpenCheck, desc: 'Hồ sơ học sinh, điểm số, xếp lớp, chuyển trường.' },
  { key: 'ke-toan', name: 'Kế toán', icon: Wallet, desc: 'Thu chi, học phí, lương, dự toán ngân sách.' },
  { key: 'y-te', name: 'Y tế học đường', icon: HeartPulse, desc: 'Sức khoẻ học sinh, sơ cấp cứu, phòng dịch.' },
  { key: 'thu-vien', name: 'Thư viện', icon: Library, desc: 'Sách giáo khoa, tài liệu tham khảo, mượn-trả.' },
  { key: 'giam-thi', name: 'Giám thị', icon: Eye, desc: 'Nề nếp, chuyên cần, kỷ luật học sinh.' },
  { key: 'tu-van-tam-ly', name: 'Tư vấn tâm lý học đường', icon: Brain, desc: 'Hỗ trợ tâm lý, tư vấn học sinh và phụ huynh.' },
  { key: 'bao-ve', name: 'Bảo vệ', icon: ShieldCheck, desc: 'An ninh trật tự, trực cổng, tài sản nhà trường.' },
  { key: 'phuc-vu', name: 'Phục vụ', icon: Sparkles, desc: 'Vệ sinh, hậu cần, phục vụ chung các điểm trường.' },
];
