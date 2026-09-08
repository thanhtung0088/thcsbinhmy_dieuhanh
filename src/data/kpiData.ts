import type { KpiSubmission } from '../types/kpi';

// Bản #1 lấy đúng theo "Danh mục sản phẩm chuẩn Quý II/2026" (Bảng 1) trong
// file thầy đã gửi — môn Giáo dục công dân. Giữ nguyên tên công việc, điểm
// chuẩn, hệ số độ khó, tiến độ/kết quả như trong file gốc.
export const SEED_KPI_SUBMISSIONS: KpiSubmission[] = [
  {
    id: 'kpi-001',
    teacherName: 'Nguyễn Thanh Tùng',
    subjectGroup: 'Tổ Giáo dục công dân',
    campusName: 'Điểm chính',
    quarter: 'Quý II/2026',
    generalScore: 30,
    submittedAt: '2026-07-02T00:00:00.000Z',
    tasks: [
      { id: 't1', name: 'Giảng dạy (soạn giảng, lên lớp) môn Giáo dục công dân', standardPoints: 10, difficultyCoef: 1, deadline: '2026-05-15', progressPct: 1, resultPct: 1, completedEarly: false },
      { id: 't2', name: 'Kiểm tra, đánh giá kết quả học tập học sinh', standardPoints: 10, difficultyCoef: 1, deadline: '2026-06-20', progressPct: 0.8, resultPct: 0.8, completedEarly: false, note: 'trễ 1–3 ngày' },
      { id: 't3', name: 'Bồi dưỡng học sinh giỏi môn GDCD', standardPoints: 12, difficultyCoef: 1.2, deadline: '2026-05-25', progressPct: 0.6, resultPct: 0.8, completedEarly: false, note: 'trễ 4–5 ngày' },
      { id: 't4', name: 'Sinh hoạt, dự giờ, chuyên đề Tổ chuyên môn', standardPoints: 10, difficultyCoef: 1, deadline: '2026-05-20', progressPct: 1, resultPct: 1, completedEarly: false },
      { id: 't5', name: 'Hồ sơ chuyên môn', standardPoints: 10, difficultyCoef: 1, deadline: '2026-06-30', progressPct: 1, resultPct: 1, completedEarly: false },
      { id: 't6', name: 'Tham gia phong trào thi đua dạy tốt - học tốt / hội giảng', standardPoints: 12, difficultyCoef: 1, deadline: '2026-05-10', progressPct: 0.8, resultPct: 0.6, completedEarly: false, note: 'trễ 1–3 ngày, hoàn thành cơ bản' },
      { id: 't7', name: 'Công tác đột xuất khác theo phân công của Tổ/BGH', standardPoints: 12, difficultyCoef: 1, deadline: '2026-06-05', progressPct: 0.6, resultPct: 0.8, completedEarly: false, note: 'trễ 4–5 ngày' },
    ],
  },
  // 2 bản dưới đây là DỮ LIỆU MINH HỌA (chưa phải người thật) để trang có
  // dữ liệu nhiều giáo viên minh hoạ tính năng tổng hợp — thầy xoá/thay
  // bằng bản thật khi giáo viên nộp qua trang này.
  {
    id: 'kpi-002',
    teacherName: 'Trần Thị Mai (minh họa)',
    subjectGroup: 'Tổ Toán',
    campusName: 'Điểm chính',
    quarter: 'Quý II/2026',
    generalScore: 30,
    submittedAt: '2026-07-01T00:00:00.000Z',
    tasks: [
      { id: 't1', name: 'Giảng dạy, soạn giảng môn Toán', standardPoints: 10, difficultyCoef: 1, progressPct: 1, resultPct: 1, completedEarly: true, note: 'trước hạn' },
      { id: 't2', name: 'Bồi dưỡng học sinh giỏi Toán', standardPoints: 12, difficultyCoef: 1.2, progressPct: 1, resultPct: 1, completedEarly: true, note: 'trước hạn' },
      { id: 't3', name: 'Sinh hoạt chuyên đề Tổ Toán', standardPoints: 10, difficultyCoef: 1, progressPct: 1, resultPct: 1, completedEarly: true, note: 'trước hạn' },
      { id: 't4', name: 'Hồ sơ chuyên môn', standardPoints: 10, difficultyCoef: 1, progressPct: 1, resultPct: 0.8, completedEarly: false },
    ],
  },
  {
    id: 'kpi-003',
    teacherName: 'Lê Văn Hùng (minh họa)',
    subjectGroup: 'Tổ Ngữ văn',
    campusName: 'Điểm 1',
    quarter: 'Quý II/2026',
    generalScore: 28,
    submittedAt: '2026-06-30T00:00:00.000Z',
    tasks: [
      { id: 't1', name: 'Giảng dạy, soạn giảng môn Ngữ văn', standardPoints: 10, difficultyCoef: 1, progressPct: 0.6, resultPct: 0.6, completedEarly: false, note: 'trễ 4–5 ngày, hoàn thành cơ bản' },
      { id: 't2', name: 'Chấm thi, kiểm tra học kỳ', standardPoints: 10, difficultyCoef: 1, progressPct: 0, resultPct: 0.6, completedEarly: false, note: 'trễ trên 5 ngày' },
      { id: 't3', name: 'Hồ sơ chuyên môn', standardPoints: 10, difficultyCoef: 1, progressPct: 0.8, resultPct: 0.8, completedEarly: false },
    ],
  },
];
