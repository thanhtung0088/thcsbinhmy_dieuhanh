import type {
  AlertItem,
  Campus,
  DocumentItem,
  KpiSnapshot,
  Leader,
  OfficeStaffGroup,
  PartyCell,
  Report,
  SubjectGroup,
  Task,
  User,
} from '../types';

// ============================================================
// DỮ LIỆU THẬT — trích từ văn bản "Phân công chuyên môn Học kỳ I,
// Năm học 2026-2027" (UBND Xã Bình Mỹ - Trường THCS Bình Mỹ,
// 07/09/2026) do người dùng cung cấp. Không có số liệu suy diễn:
// những gì tài liệu không nêu (vd. số học sinh) được để trống và
// hiển thị "Chưa cập nhật" thay vì số liệu giả.
// Nhiệm vụ/văn bản/KPI/cảnh báo bên dưới vẫn là NỘI DUNG MINH HỌA
// cho luồng thao tác (Phase 1 demo workflow) — được gắn cho đúng
// người thật đang giữ vai trò liên quan.
// ============================================================

export const LEADERSHIP: Leader[] = [
  { id: 'l1', name: 'Trần Đỗ Phương Bình', title: 'Hiệu trưởng', campusId: 'all', concurrent: 'Bí thư Đảng bộ' },
  { id: 'l2', name: 'Nguyễn Thị Mến', title: 'Phó Hiệu trưởng phụ trách Điểm 1', campusId: 'diem1', concurrent: 'Phó Bí thư Đảng bộ' },
  { id: 'l3', name: 'Nguyễn Thanh Nhàn', title: 'Phó Hiệu trưởng phụ trách Điểm 2', campusId: 'diem2' },
];

export const CAMPUSES: Campus[] = [
  {
    id: 'chinh',
    name: 'Điểm chính',
    formerName: 'THCS Hòa Phú (cũ)',
    classLetter: 'b',
    teacherCount: 48,
    staffCount: 13, // TTVP + TPT + YTHĐ + CNTT + Nhân viên (9)
    studentCount: 1070,
    classCount: 26,
  },
  {
    id: 'diem1',
    name: 'Điểm 1',
    formerName: 'THCS Trung An (cũ)',
    classLetter: 'a',
    teacherCount: 46,
    staffCount: 6, // TPVP + Nhân viên (5)
    studentCount: 998,
    classCount: 24,
  },
  {
    id: 'diem2',
    name: 'Điểm 2',
    formerName: 'THCS Bình (cũ)',
    classLetter: 'c',
    teacherCount: 70,
    staffCount: 10, // TPVP + Nhân viên (9)
    studentCount: 1676,
    classCount: 38, // 22 lớp c chính + 16 lớp c phân hiệu (cầu Bà Đội / cầu Bà Đế)
  },
];

export const TOTAL_STUDENTS = 3744; // sĩ số đầu năm toàn trường, tính đến 06/09/2026

// Tổ trưởng/Tổ phó Văn phòng thực tế theo từng điểm
export const OFFICE_STAFF: OfficeStaffGroup[] = [
  { campusId: 'chinh', head: { name: 'Nguyễn Thị Minh Tâm', campusId: 'chinh', title: 'TTVP' }, staffCount: 12 },
  { campusId: 'diem1', head: { name: 'Dương Thị Cẩm Tú', campusId: 'diem1', title: 'TPVP' }, staffCount: 6 },
  { campusId: 'diem2', head: { name: 'Lê Khắc Hận', campusId: 'diem2', title: 'TPVP' }, staffCount: 10 },
];

// 11 tổ chuyên môn — TTCM/TPCM và sĩ số lấy từ PCCM (đếm theo môn dạy
// ở cột "Môn dạy"); tổ nào tài liệu không nêu đủ TTCM/TPCM ở cả 3
// điểm thì để trống ô đó, không suy diễn thêm người.
export const SUBJECT_GROUPS: SubjectGroup[] = [
  {
    id: 'nguvan', name: 'Ngữ Văn',
    ttcm: { name: 'Võ Thị Thống Nhất', campusId: 'chinh' },
    tpcm: [{ name: 'Võ Nguyệt Quế', campusId: 'diem1' }, { name: 'Nguyễn Thị Tuyết Ngọc', campusId: 'diem2' }],
    memberCount: 26,
  },
  {
    id: 'toan', name: 'Toán',
    ttcm: { name: 'Hồ Quang Huy', campusId: 'diem2' },
    tpcm: [{ name: 'Nguyễn Văn Thanh', campusId: 'chinh' }, { name: 'Trương Thị Hồng Hậu', campusId: 'diem1' }],
    memberCount: 25,
  },
  {
    id: 'ngoaingu', name: 'Ngoại ngữ',
    ttcm: { name: 'Lê Trung Hiếu', campusId: 'diem1' },
    tpcm: [{ name: 'Phạm Thị Lan', campusId: 'chinh' }, { name: 'Nguyễn Hoàng Sơn', campusId: 'diem2' }],
    memberCount: 21,
  },
  {
    id: 'khtn', name: 'Khoa học Tự nhiên',
    ttcm: { name: 'Trương Thị Phương Thi', campusId: 'diem2' },
    tpcm: [{ name: 'Lê Thị Hồng Anh', campusId: 'chinh' }, { name: 'Nguyễn Thị Gái', campusId: 'diem1' }],
    memberCount: 29,
  },
  {
    id: 'khxh', name: 'Khoa học Xã hội (LSĐL)',
    ttcm: { name: 'Nguyễn Thị Hồng Trinh', campusId: 'chinh' },
    tpcm: [{ name: 'Hà Văn Thường', campusId: 'diem2' }],
    memberCount: 16,
  },
  {
    id: 'gdcd', name: 'GDCD',
    ttcm: { name: 'Ngô Văn Tín', campusId: 'diem1' },
    tpcm: [{ name: 'Hà Ngọc Anh Thi', campusId: 'chinh' }],
    memberCount: 6,
  },
  {
    id: 'tinhoc', name: 'Tin học',
    ttcm: { name: 'Dương Thị Thu Ngân', campusId: 'chinh' },
    tpcm: [{ name: 'Đoàn Thị Hồng Tân', campusId: 'diem2' }],
    memberCount: 7,
  },
  {
    id: 'congnghe', name: 'Công nghệ',
    ttcm: { name: 'Phan Văn Thành', campusId: 'chinh' },
    tpcm: [{ name: 'Nguyễn Quốc Bảo', campusId: 'diem1' }],
    memberCount: 10,
  },
  {
    id: 'gdtc', name: 'GDTC',
    ttcm: { name: 'Nguyễn Thanh Hải', campusId: 'chinh' },
    tpcm: [{ name: 'Nguyễn Đức Trung', campusId: 'diem1' }, { name: 'Lê Thị Lương', campusId: 'diem2' }],
    memberCount: 12,
  },
  {
    id: 'nangkhieu', name: 'Năng khiếu (Âm nhạc - Mỹ thuật)',
    ttcm: { name: 'Trần Tài', campusId: 'diem2' },
    tpcm: [{ name: 'Lê Thị Thanh Tuyền', campusId: 'diem2' }],
    memberCount: 7,
  },
  {
    id: 'vanphong', name: 'Văn phòng',
    ttcm: { name: 'Nguyễn Thị Minh Tâm', campusId: 'chinh' },
    tpcm: [{ name: 'Dương Thị Cẩm Tú', campusId: 'diem1' }, { name: 'Lê Khắc Hận', campusId: 'diem2' }],
    memberCount: 28,
  },
];

// Đảng bộ: số chi bộ/đảng viên do người dùng cung cấp trực tiếp.
// Không có tên bí thư từng chi bộ trong tài liệu PCCM nên để trống —
// chỉ nêu Bí thư/Phó Bí thư Đảng ủy (có trong PCCM, xem LEADERSHIP).
export const PARTY_CELLS: PartyCell[] = [
  { id: 'cb-vp', name: 'Chi bộ Văn phòng', memberCount: 12 },
  { id: 'cb-khxh', name: 'Chi bộ Khoa học Xã hội', memberCount: 14 },
  { id: 'cb-nv', name: 'Chi bộ Ngữ Văn', memberCount: 12 },
  { id: 'cb-khtn', name: 'Chi bộ Khoa học Tự nhiên', memberCount: 11 },
  { id: 'cb-toan', name: 'Chi bộ Toán học', memberCount: 11 },
  { id: 'cb-nn', name: 'Chi bộ Ngoại ngữ', memberCount: 9 },
  { id: 'cb-nk', name: 'Chi bộ Năng khiếu', memberCount: 9 },
];

export const TOTAL_PARTY_MEMBERS = PARTY_CELLS.reduce((sum, c) => sum + c.memberCount, 0); // 78

// ---- Nội dung minh họa cho luồng thao tác (giao việc / văn bản /
// KPI / cảnh báo) — gắn với người thật đang giữ vai trò liên quan,
// nhưng bản thân nội dung công việc là ví dụ cho Phase 1, không phải
// số liệu đã xảy ra trong thực tế. ----
export const TASKS: Task[] = [
  { id: 't1', title: 'Chuẩn bị Hội nghị cán bộ viên chức năm học 2026-2027', assignee: 'Nguyễn Thị Minh Tâm', campusId: 'chinh', department: 'Văn phòng', dueDate: '2026-09-10', status: 'sap_den_han', priority: 'cao' },
  { id: 't2', title: 'Rà soát phân công chuyên môn học kỳ I sau điều chỉnh', assignee: 'Võ Thị Thống Nhất', campusId: 'chinh', department: 'Chuyên môn', dueDate: '2026-09-12', status: 'chua_hoan_thanh', priority: 'trung_binh' },
  { id: 't3', title: 'Kiểm kê thiết bị phòng Tin học', assignee: 'Dương Thị Thu Ngân', campusId: 'chinh', department: 'Cơ sở vật chất', dueDate: '2026-09-08', status: 'chua_hoan_thanh', priority: 'trung_binh' },
  { id: 't4', title: 'Duyệt kế hoạch chuyên môn Tổ Toán học kỳ I', assignee: 'Hồ Quang Huy', campusId: 'diem2', department: 'Chuyên môn', dueDate: '2026-09-14', status: 'cho_duyet', priority: 'trung_binh' },
  { id: 't5', title: 'Bố trí dạy thay cho các trường hợp nghỉ hậu sản/nghỉ dài', assignee: 'Nguyễn Thị Mến', campusId: 'diem1', department: 'Nhân sự', dueDate: '2026-09-09', status: 'sap_den_han', priority: 'cao' },
  { id: 't6', title: 'Kiểm tra an toàn PCCC trước năm học', assignee: 'Nguyễn Thanh Nhàn', campusId: 'diem2', department: 'Cơ sở vật chất', dueDate: '2026-08-30', status: 'qua_han', priority: 'cao' },
  { id: 't7', title: 'Tổng hợp danh sách đảng viên đầu năm học', assignee: 'Trần Đỗ Phương Bình', campusId: 'all', department: 'Công tác Đảng', dueDate: '2026-09-20', status: 'chua_hoan_thanh', priority: 'thap' },
];

export const DOCUMENTS: DocumentItem[] = [
  { id: 'd1', code: 'PCCM-260907', title: 'Phân công chuyên môn Học kỳ I, năm học 2026-2027 (áp dụng từ 07/09/2026)', type: 'di', date: '2026-09-07', status: 'da_xong' },
  { id: 'd2', code: '245/KH-THCS', title: 'Kế hoạch tổ chức Hội nghị CBVC năm học 2026-2027', type: 'di', date: '2026-09-01', status: 'dang_xu_ly' },
  { id: 'd3', code: '276/TB-THCS', title: 'Thông báo lịch kiểm tra nội bộ tháng 9', type: 'di', date: '2026-09-03', status: 'moi' },
];

// KPI chỉ mang tính minh họa giao diện (chưa có bộ chỉ số chính thức)
export const KPI_SNAPSHOTS: KpiSnapshot[] = [
  { scope: 'Toàn trường', score: 82, trend: 'up' },
  { scope: 'Điểm chính', score: 85, trend: 'up' },
  { scope: 'Điểm 1', score: 79, trend: 'flat' },
  { scope: 'Điểm 2', score: 78, trend: 'down' },
];

export const ALERTS: AlertItem[] = [
  { id: 'a1', message: '1 nhiệm vụ đã quá hạn tại Điểm 2 (kiểm tra PCCC)', level: 'do', campusId: 'diem2', createdAt: '2026-09-06T07:00:00Z' },
  { id: 'a2', message: '2 giáo viên đang nghỉ hậu sản dài hạn tại Điểm chính — cần bố trí dạy thay', level: 'cam', campusId: 'chinh', createdAt: '2026-09-06T07:00:00Z' },
  { id: 'a3', message: 'Phân công chuyên môn HK1 vừa ban hành — các tổ cần rà soát trong tuần', level: 'vang', campusId: 'all', createdAt: '2026-09-07T09:00:00Z' },
];

export const INITIAL_REPORTS: Report[] = [];

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Trần Đỗ Phương Bình',
  role: 'hieu_truong',
  campusId: 'all',
  avatarInitials: 'TB',
};

// Tài khoản demo cho RBAC — dùng đúng người thật đang giữ các vai trò này
export const DEMO_USERS: User[] = [
  CURRENT_USER,
  { id: 'u2', name: 'Nguyễn Thị Mến', role: 'pho_hieu_truong', campusId: 'diem1', avatarInitials: 'NM' },
  { id: 'u3', name: 'Nguyễn Thanh Nhàn', role: 'pho_hieu_truong', campusId: 'diem2', avatarInitials: 'NN' },
  { id: 'u4', name: 'Nguyễn Thị Minh Tâm', role: 'to_truong_vp', campusId: 'chinh', avatarInitials: 'MT' },
];
