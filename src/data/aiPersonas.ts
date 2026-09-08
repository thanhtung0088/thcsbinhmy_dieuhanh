import { Crown, UserCog, Users, Wallet, UserSquare2, type LucideIcon } from 'lucide-react';

export type AiPersonaKey = 'hieu-truong' | 'pho-ht' | 'to-truong-cm' | 'ke-toan' | 'gvcn';

export interface AiPersona {
  key: AiPersonaKey;
  label: string;
  icon: LucideIcon;
  // Tailwind classes riêng cho từng vai trò để phân biệt màu sắc
  chipClass: string;
  headerClass: string;
  greeting: string;
  suggestions: string[];
}

export const AI_PERSONAS: AiPersona[] = [
  {
    key: 'hieu-truong',
    label: 'Trợ lý Hiệu trưởng AI',
    icon: Crown,
    chipClass: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:border-indigo-400',
    headerClass: 'bg-indigo-950',
    greeting: 'Chào Hiệu trưởng! Em có thể tổng hợp tình hình chung, cảnh báo cần xử lý, hoặc KPI toàn trường. Thầy/cô cần gì?',
    suggestions: ['Tuần này có gì cần Hiệu trưởng duyệt gấp?', 'Tổng hợp nhanh tình hình toàn trường', 'Tổ nào đang có nhiều việc trễ hạn nhất?'],
  },
  {
    key: 'pho-ht',
    label: 'Trợ lý Phó HT AI',
    icon: UserCog,
    chipClass: 'bg-violet-50 border-violet-200 text-violet-700 hover:border-violet-400',
    headerClass: 'bg-violet-950',
    greeting: 'Chào Phó Hiệu trưởng! Em hỗ trợ theo dõi công việc được phân công, tiến độ các tổ, và nhắc việc. Cần em giúp gì?',
    suggestions: ['Việc nào đang chờ tôi duyệt?', 'Tiến độ các tổ chuyên môn thế nào?', 'Có cảnh báo nào mới không?'],
  },
  {
    key: 'to-truong-cm',
    label: 'Trợ lý Tổ trưởng CM AI',
    icon: Users,
    chipClass: 'bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-400',
    headerClass: 'bg-amber-900',
    greeting: 'Chào Tổ trưởng chuyên môn! Em hỗ trợ việc sinh hoạt tổ, hồ sơ chuyên môn, và nộp báo cáo. Cần hỏi gì?',
    suggestions: ['Tổ tôi còn hồ sơ nào chưa nộp?', 'Việc Ban Giám hiệu giao cho tổ tuần này?', 'Gợi ý nội dung sinh hoạt chuyên đề'],
  },
  {
    key: 'ke-toan',
    label: 'Trợ lý kế toán AI',
    icon: Wallet,
    chipClass: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-400',
    headerClass: 'bg-emerald-900',
    greeting: 'Chào kế toán trường! Em hỗ trợ tra cứu số liệu tài chính, nhắc hạn nộp báo cáo, và soạn thảo văn bản tài chính. Cần gì ạ?',
    suggestions: ['Tình hình tài chính hiện tại thế nào?', 'Sắp tới có hạn nộp báo cáo nào?', 'Soạn giúp mẫu đề xuất mua sắm thiết bị'],
  },
  {
    key: 'gvcn',
    label: 'Trợ lý GVCN AI',
    icon: UserSquare2,
    chipClass: 'bg-rose-50 border-rose-200 text-rose-700 hover:border-rose-400',
    headerClass: 'bg-rose-900',
    greeting: 'Chào Giáo viên chủ nhiệm! Em hỗ trợ tra cứu sĩ số lớp, soạn thông báo phụ huynh, và nhắc việc chủ nhiệm. Cần gì ạ?',
    suggestions: ['Lớp tôi có bao nhiêu học sinh?', 'Soạn giúp thông báo họp phụ huynh', 'Việc chủ nhiệm cần làm tuần này?'],
  },
];

export function getPersona(key?: AiPersonaKey | null) {
  return AI_PERSONAS.find((p) => p.key === key);
}
