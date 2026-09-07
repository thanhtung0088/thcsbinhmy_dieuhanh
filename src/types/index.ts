// ============================================================
// Domain types — Phase 1 (Dashboard + 3 điểm trường + Auth + RBAC)
// Extended in later phases (nhân sự, học sinh, tài chính, ...)
// ============================================================

export type CampusId = 'chinh' | 'diem1' | 'diem2' | 'diem3';

export interface Campus {
  id: CampusId;
  name: string; // tên điểm trường hiện tại
  formerName: string; // tên trường cũ trước sáp nhập
  classLetter: string; // ký hiệu lớp: b=điểm chính, a=điểm 1, c=điểm 2 & điểm 3
  teacherCount?: number; // giáo viên — chưa tách được theo điểm 3 (roster PCCM chỉ ghi "Đ2" gộp)
  staffCount?: number; // nhân viên văn phòng — chưa tách được theo điểm 3
  studentCount: number; // sĩ số đầu năm, tính đến 06/09/2026 (KH công tác tuần 1, số 14/KH-THCSBM)
  classCount: number;
  note?: string; // ghi chú minh bạch về giới hạn dữ liệu
}

export interface Leader {
  id: string;
  name: string;
  title: string; // Hiệu trưởng | Phó Hiệu trưởng phụ trách điểm 1 | ...
  campusId: CampusId | 'all';
  concurrent?: string; // chức vụ kiêm nhiệm (vd: Bí thư Đảng bộ)
}

export type SubjectGroupId =
  | 'toan'
  | 'nguvan'
  | 'ngoaingu'
  | 'khtn'
  | 'khxh'
  | 'gdcd'
  | 'tinhoc'
  | 'congnghe'
  | 'gdtc'
  | 'nangkhieu'
  | 'vanphong';

export interface SubjectGroupPerson {
  name: string;
  campusId: CampusId;
}

export interface SubjectGroup {
  id: SubjectGroupId;
  name: string;
  ttcm?: SubjectGroupPerson; // Tổ trưởng chuyên môn (toàn trường)
  tpcm: SubjectGroupPerson[]; // Tổ phó chuyên môn (thường 1 người/điểm còn lại)
  memberCount: number; // đếm thực từ PCCM HK1 2026-2027 theo môn dạy
}

export interface OfficeStaffGroup {
  campusId: CampusId;
  head: SubjectGroupPerson & { title: 'TTVP' | 'TPVP' }; // Tổ trưởng/Tổ phó Văn phòng
  staffCount: number; // nhân viên văn phòng tại điểm (không kể tổ trưởng/phó)
}

export interface PartyCell {
  id: string;
  name: string; // Chi bộ
  memberCount: number;
}

export type RoleId =
  | 'super_admin'
  | 'hieu_truong'
  | 'pho_hieu_truong'
  | 'to_truong_cm'
  | 'to_truong_vp'
  | 'bi_thu_dang'
  | 'giao_vien'
  | 'nhan_vien'
  | 'ke_toan'
  | 'van_thu'
  | 'thiet_bi'
  | 'thu_vien'
  | 'y_te'
  | 'bao_ve'
  | 'hoc_sinh'
  | 'phu_huynh';

export type Permission =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'assign'
  | 'approve'
  | 'export'
  | 'report';

export interface User {
  id: string;
  name: string;
  role: RoleId;
  campusId: CampusId | 'all';
  avatarInitials: string;
}

export type TaskStatus = 'qua_han' | 'sap_den_han' | 'chua_hoan_thanh' | 'cho_duyet' | 'hoan_thanh';

export interface Task {
  id: string;
  title: string;
  assignee: string;
  campusId: CampusId | 'all';
  department: string;
  dueDate: string; // ISO date
  status: TaskStatus;
  priority: 'cao' | 'trung_binh' | 'thap';
}

export interface DocumentItem {
  id: string;
  code: string; // số ký hiệu văn bản
  title: string;
  type: 'den' | 'di'; // văn bản đến / đi
  date: string;
  status: 'moi' | 'dang_xu_ly' | 'da_xong';
}

export interface KpiSnapshot {
  scope: string; // "Toàn trường" | tên điểm trường | tên tổ
  score: number; // 0-100
  trend: 'up' | 'down' | 'flat';
}

export interface AlertItem {
  id: string;
  message: string;
  level: 'do' | 'cam' | 'vang'; // đỏ / cam / vàng — mirrors status buckets
  campusId: CampusId | 'all';
  createdAt: string;
}

export interface Report {
  id: string;
  fromDepartment: string;
  toRecipient: string; // "Hiệu trưởng" | "Ban Giám hiệu"
  content: string;
  driveLink?: string;
  createdAt: string;
  category?: string; // loại hồ sơ, vd "Kế hoạch tổ", "Chuyên đề"
  status: 'cho_duyet' | 'yeu_cau_bo_sung' | 'da_duyet';
  reviewNote?: string; // nhận xét của BGH khi yêu cầu bổ sung / phê duyệt
  reviewedBy?: string;
}
