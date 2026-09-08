// ============================================================
// Kiểu dữ liệu cho module "AI Agent & KPI" — dựa theo cấu trúc
// "Danh mục sản phẩm chuẩn" mà trường đang dùng (điểm chuẩn ×
// hệ số độ khó × tiến độ/kết quả hoàn thành).
// ============================================================

export interface KpiTaskItem {
  id: string;
  name: string; // Tên công việc
  standardPoints: number; // Điểm chuẩn của công việc
  difficultyCoef: number; // Hệ số độ khó
  deadline?: string; // Thời hạn hoàn thành (ISO date), tuỳ chọn
  progressPct: number; // Tiến độ (0–1): đúng/trước hạn=1; trễ 1-3 ngày=0.8; trễ 4-5=0.6; trễ >5=0
  resultPct: number; // Kết quả (0–1): đạt đầy đủ=1; chỉnh sửa nhỏ=0.8; cơ bản=0.6; không đạt=0
  completedEarly?: boolean; // true nếu hoàn thành TRƯỚC hạn (để tính điều kiện "vượt tiến độ")
  note?: string;
}

export interface KpiSubmission {
  id: string;
  teacherName: string;
  subjectGroup: string; // Tổ chuyên môn
  campusName?: string;
  quarter: string; // vd "Quý II/2026"
  generalScore?: number; // Điểm nhóm tiêu chí chung (thang 30đ) — mặc định 30 nếu không ghi khác
  tasks: KpiTaskItem[];
  submittedAt: string; // ISO datetime
}
