export interface GvbmField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'textarea';
  options?: string[];
  placeholder?: string;
  defaultValue?: string;
}

export interface GvbmTemplate {
  key: string;
  label: string;
  description: string;
  fields: GvbmField[];
  buildPrompt: (v: Record<string, string>) => string;
}

const AUDIENCE_OPTIONS = ['Học sinh đại trà', 'Học sinh hoà nhập', 'Học sinh khá giỏi', 'Học sinh yếu, cần củng cố'];
const GRADE_OPTIONS = ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'];

const LESSON_FIELDS: GvbmField[] = [
  { key: 'subject', label: 'Môn học', type: 'text', placeholder: 'VD: Giáo dục công dân' },
  { key: 'grade', label: 'Lớp/Khối', type: 'select', options: GRADE_OPTIONS },
  { key: 'topic', label: 'Tên bài giảng / Chủ đề', type: 'text', placeholder: 'VD: Bài 5 - Tự lập' },
  { key: 'periods', label: 'Số tiết', type: 'number', placeholder: '1' },
  { key: 'audience', label: 'Đối tượng học sinh', type: 'select', options: AUDIENCE_OPTIONS },
  { key: 'note', label: 'Ghi chú thêm (không bắt buộc)', type: 'textarea', placeholder: 'Yêu cầu riêng nếu có...' },
];

function lessonHeader(v: Record<string, string>, label: string) {
  return `${label} — Môn: ${v.subject || '(chưa ghi)'}, ${v.grade || '(chưa ghi lớp)'}, Bài/Chủ đề: "${
    v.topic || '(chưa ghi)'
  }", Số tiết: ${v.periods || '1'}, Đối tượng: ${v.audience || AUDIENCE_OPTIONS[0]}.${v.note ? `\nGhi chú thêm: ${v.note}` : ''}`;
}

export const GVBM_TEMPLATES: GvbmTemplate[] = [
  {
    key: 'khbd',
    label: 'Soạn giáo án 5512',
    description: 'Kế hoạch bài dạy theo CV 5512/BGDĐT-GDTrH',
    fields: LESSON_FIELDS,
    buildPrompt: (v) => lessonHeader(v, 'Soạn Kế hoạch bài dạy (KHBD) theo CV 5512, Phụ lục 4'),
  },
  {
    key: 'ppt',
    label: 'Soạn bài giảng điện tử (PPT)',
    description: 'Dàn ý trình chiếu, ít nhất 10 slide',
    fields: LESSON_FIELDS,
    buildPrompt: (v) => lessonHeader(v, 'Soạn dàn ý Bài giảng trình chiếu (PowerPoint)'),
  },
  {
    key: 'phieu',
    label: 'Soạn phiếu học tập',
    description: 'Câu hỏi dẫn dắt + bài tập thực hành',
    fields: LESSON_FIELDS,
    buildPrompt: (v) => lessonHeader(v, 'Soạn Phiếu học tập'),
  },
  {
    key: 'game',
    label: 'Soạn trò chơi tương tác',
    description: 'Trò chơi củng cố kiến thức trong tiết học',
    fields: LESSON_FIELDS,
    buildPrompt: (v) => lessonHeader(v, 'Soạn Trò chơi học tập tương tác'),
  },
  {
    key: 'decuong',
    label: 'Soạn đề cương ôn tập',
    description: 'Hệ thống kiến thức + bài tập phân dạng',
    fields: LESSON_FIELDS,
    buildPrompt: (v) => lessonHeader(v, 'Soạn Đề cương ôn tập'),
  },
  {
    key: 'dekiemtra',
    label: 'Soạn đề kiểm tra',
    description: 'Theo Công văn 7991, kèm ma trận + đáp án',
    fields: LESSON_FIELDS,
    buildPrompt: (v) => lessonHeader(v, 'Soạn Đề kiểm tra theo CV 7991'),
  },
  {
    key: 'skkn',
    label: 'Soạn Sáng kiến kinh nghiệm (SKKN)',
    description: 'Đề cương chi tiết đầy đủ các phần',
    fields: [
      { key: 'topic', label: 'Tên đề tài', type: 'text', placeholder: 'VD: Ứng dụng AI hỗ trợ dạy học môn GDCD' },
      { key: 'subject', label: 'Môn học', type: 'text', placeholder: 'VD: Giáo dục công dân' },
      { key: 'grade', label: 'Khối lớp áp dụng', type: 'select', options: GRADE_OPTIONS },
      { key: 'unit', label: 'Đơn vị công tác', type: 'text', defaultValue: 'THCS Bình Mỹ' },
      { key: 'year', label: 'Năm học', type: 'text', defaultValue: '2026-2027' },
      { key: 'note', label: 'Ghi chú thêm (không bắt buộc)', type: 'textarea', placeholder: 'Bối cảnh/khó khăn thực tế nếu có...' },
    ],
    buildPrompt: (v) =>
      `Soạn đề cương chi tiết đầy đủ các phần cho Sáng kiến kinh nghiệm (SKKN) — Tên đề tài: "${
        v.topic || '(chưa ghi)'
      }", Môn: ${v.subject || '(chưa ghi)'}, ${v.grade || '(chưa ghi khối)'}, Đơn vị: ${v.unit || 'THCS Bình Mỹ'}, Năm học: ${
        v.year || ''
      }.${v.note ? `\nGhi chú thêm: ${v.note}` : ''}`,
  },
];
