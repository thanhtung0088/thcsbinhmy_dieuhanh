import type { KpiSubmission, KpiTaskItem } from '../types/kpi';

export interface TaskCalc {
  task: KpiTaskItem;
  maxConverted: number; // (5) Điểm quy đổi tối đa = Điểm chuẩn × Hệ số độ khó
  performed: number; // (8) Điểm thực hiện = Điểm chuẩn × {30%×Tiến độ + 70%×Kết quả}
  actualConverted: number; // (9) Điểm quy đổi thực tế = Điểm thực hiện × Hệ số độ khó
}

export interface SubmissionCalc {
  rows: TaskCalc[];
  totalA: number; // Tổng điểm quy đổi tối đa
  totalB: number; // Tổng điểm quy đổi thực tế
  kpiPct: number; // KPI% = B/A (100% nếu không có nhiệm vụ nào)
  scoreB: number; // Điểm phần B = KPI% × 70
  generalScore: number; // Điểm phần A (nhóm tiêu chí chung, mặc định 30)
  totalScore: number; // Tổng điểm = A + B (thang 100)
  earlyRatio: number; // Tỉ lệ nhiệm vụ hoàn thành TRƯỚC hạn / tổng nhiệm vụ
  overdueCount: number; // Số nhiệm vụ có tiến độ < 100% (tức có trễ hạn)
  classification: string;
}

export function calcTask(t: KpiTaskItem): TaskCalc {
  const maxConverted = t.standardPoints * t.difficultyCoef;
  const performed = t.standardPoints * (0.3 * t.progressPct + 0.7 * t.resultPct);
  const actualConverted = performed * t.difficultyCoef;
  return { task: t, maxConverted, performed, actualConverted };
}

// Ngưỡng phân loại: hệ thống đề xuất tham khảo dựa trên khung 4 mức trong
// mẫu (Xuất sắc / Tốt / Hoàn thành / Không hoàn thành). Điều kiện "> 30%
// nhiệm vụ vượt tiến độ" cho mức Xuất sắc lấy đúng theo ghi chú trong mẫu;
// các mốc điểm số (90/80/65) do hệ thống đề xuất, có thể điều chỉnh khi
// nhà trường có hướng dẫn chấm điểm chính thức khác.
export function classify(totalScore: number, earlyRatio: number): string {
  if (totalScore >= 90 && earlyRatio > 0.3) return 'Hoàn thành xuất sắc nhiệm vụ';
  if (totalScore >= 80) return 'Hoàn thành tốt nhiệm vụ';
  if (totalScore >= 65) return 'Hoàn thành nhiệm vụ';
  return 'Không hoàn thành nhiệm vụ';
}

export function calcSubmission(sub: KpiSubmission): SubmissionCalc {
  const rows = sub.tasks.map(calcTask);
  const totalA = rows.reduce((s, r) => s + r.maxConverted, 0);
  const totalB = rows.reduce((s, r) => s + r.actualConverted, 0);
  const kpiPct = totalA > 0 ? Math.min(1, totalB / totalA) : 1; // không có nhiệm vụ → 100%
  const scoreB = kpiPct * 70;
  const generalScore = sub.generalScore ?? 30;
  const totalScore = generalScore + scoreB;
  const total = sub.tasks.length;
  const earlyCount = sub.tasks.filter((t) => t.completedEarly).length;
  const earlyRatio = total > 0 ? earlyCount / total : 0;
  const overdueCount = sub.tasks.filter((t) => t.progressPct < 1).length;
  const classification = classify(totalScore, earlyRatio);
  return { rows, totalA, totalB, kpiPct, scoreB, generalScore, totalScore, earlyRatio, overdueCount, classification };
}
