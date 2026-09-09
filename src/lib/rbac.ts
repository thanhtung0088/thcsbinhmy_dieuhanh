import type { Permission, RoleId } from '../types';

// Module keys correspond to the 20 sidebar modules from the spec.
// Phase 1 wires up the matrix and the guard function; later phases
// gate real screens (create/edit/delete/approve actions) against it.
export type ModuleKey =
  | 'tong_quan'
  | 'quan_tri'
  | 'cong_tac_dang'
  | 'chuyen_mon'
  | 'nhan_su'
  | 'hoc_sinh'
  | 'cong_viec'
  | 'ai_agent'
  | 'kpi'
  | 'co_so_vat_chat'
  | 'tai_chinh'
  | 'van_ban'
  | 'lich_cong_tac'
  | 'kiem_tra'
  | 'thi_dua'
  | 'phan_tich'
  | 'bao_cao'
  | 'thong_bao'
  | 'cai_dat';

// Sparse matrix: a role only lists modules it can touch; anything
// omitted is view-only-if-listed-elsewhere or fully denied.
// This is intentionally conservative for Phase 1 — Đảng, nhân sự,
// tài chính stay locked down to the roles named in the brief.
const MATRIX: Partial<Record<RoleId, Partial<Record<ModuleKey, Permission[]>>>> = {
  super_admin: {
    tong_quan: ['view', 'export', 'report'],
    quan_tri: ['view', 'create', 'edit', 'delete', 'export'],
    cong_tac_dang: ['view', 'create', 'edit', 'delete', 'export'],
    chuyen_mon: ['view', 'create', 'edit', 'delete', 'assign', 'export'],
    nhan_su: ['view', 'create', 'edit', 'delete', 'export'],
    hoc_sinh: ['view', 'create', 'edit', 'delete', 'export'],
    cong_viec: ['view', 'create', 'edit', 'delete', 'assign', 'approve'],
    ai_agent: ['view', 'create', 'approve'],
    kpi: ['view', 'create', 'edit', 'export', 'report'],
    co_so_vat_chat: ['view', 'create', 'edit', 'delete', 'approve'],
    tai_chinh: ['view', 'create', 'edit', 'approve', 'export'],
    van_ban: ['view', 'create', 'edit', 'delete', 'approve'],
    lich_cong_tac: ['view', 'create', 'edit', 'delete'],
    kiem_tra: ['view', 'create', 'edit', 'report'],
    thi_dua: ['view', 'create', 'edit', 'approve'],
    phan_tich: ['view', 'export', 'report'],
    bao_cao: ['view', 'create', 'export', 'report'],
    thong_bao: ['view', 'create'],
    cai_dat: ['view', 'edit'],
  },
  hieu_truong: {
    tong_quan: ['view', 'export', 'report'],
    quan_tri: ['view', 'edit', 'approve'],
    cong_tac_dang: ['view'],
    chuyen_mon: ['view', 'approve', 'export'],
    nhan_su: ['view', 'approve', 'export'],
    hoc_sinh: ['view', 'approve', 'export'],
    cong_viec: ['view', 'create', 'assign', 'approve'],
    ai_agent: ['view', 'create', 'approve'],
    kpi: ['view', 'export', 'report'],
    co_so_vat_chat: ['view', 'approve'],
    tai_chinh: ['view', 'approve', 'export'],
    van_ban: ['view', 'approve'],
    lich_cong_tac: ['view', 'create', 'edit'],
    kiem_tra: ['view', 'approve'],
    thi_dua: ['view', 'approve'],
    phan_tich: ['view', 'export', 'report'],
    bao_cao: ['view', 'export', 'report'],
    thong_bao: ['view', 'create'],
    cai_dat: ['view'],
  },
  pho_hieu_truong: {
    tong_quan: ['view', 'export'],
    quan_tri: ['view'],
    chuyen_mon: ['view', 'approve'],
    nhan_su: ['view'],
    cong_viec: ['view', 'create', 'assign', 'approve'],
    ai_agent: ['view', 'create'],
    kpi: ['view'],
    co_so_vat_chat: ['view', 'approve'],
    van_ban: ['view', 'approve'],
    lich_cong_tac: ['view', 'create', 'edit'],
    thong_bao: ['view', 'create'],
  },
  bi_thu_dang: {
    tong_quan: ['view'],
    cong_tac_dang: ['view', 'create', 'edit', 'export', 'report'],
    thong_bao: ['view', 'create'],
  },
  to_truong_cm: {
    tong_quan: ['view'],
    chuyen_mon: ['view', 'create', 'edit', 'report'],
    cong_viec: ['view', 'create', 'assign'],
    kpi: ['view'],
    thong_bao: ['view'],
  },
  to_truong_vp: {
    tong_quan: ['view'],
    quan_tri: ['view'],
    van_ban: ['view', 'create', 'edit'],
    cong_viec: ['view', 'create', 'assign'],
    thong_bao: ['view', 'create'],
  },
  giao_vien: {
    tong_quan: ['view'],
    chuyen_mon: ['view'],
    cong_viec: ['view'],
    ai_agent: ['view', 'create'],
    kpi: ['view', 'create'],
    thong_bao: ['view'],
  },
  ke_toan: {
    tong_quan: ['view'],
    tai_chinh: ['view', 'create', 'edit', 'export', 'report'],
    thong_bao: ['view'],
  },
  van_thu: {
    tong_quan: ['view'],
    quan_tri: ['view'],
    van_ban: ['view', 'create', 'edit'],
    thong_bao: ['view', 'create'],
  },
  thiet_bi: {
    tong_quan: ['view'],
    co_so_vat_chat: ['view', 'create', 'edit'],
    thong_bao: ['view'],
  },
  thu_vien: {
    tong_quan: ['view'],
    co_so_vat_chat: ['view'],
    thong_bao: ['view'],
  },
  y_te: {
    tong_quan: ['view'],
    hoc_sinh: ['view'],
    thong_bao: ['view'],
  },
  bao_ve: {
    tong_quan: ['view'],
    co_so_vat_chat: ['view'],
    thong_bao: ['view'],
  },
  nhan_vien: {
    tong_quan: ['view'],
    thong_bao: ['view'],
  },
};

export function can(role: RoleId, module: ModuleKey, permission: Permission): boolean {
  const modulePerms = MATRIX[role]?.[module];
  return !!modulePerms?.includes(permission);
}

export const ROLE_LABELS: Record<RoleId, string> = {
  super_admin: 'Super Admin',
  hieu_truong: 'Hiệu trưởng',
  pho_hieu_truong: 'Phó Hiệu trưởng',
  to_truong_cm: 'Tổ trưởng chuyên môn',
  to_truong_vp: 'Tổ trưởng Văn phòng',
  bi_thu_dang: 'Bí thư/Phụ trách Đảng',
  giao_vien: 'Giáo viên',
  nhan_vien: 'Nhân viên',
  ke_toan: 'Kế toán',
  van_thu: 'Văn thư',
  thiet_bi: 'Thiết bị',
  thu_vien: 'Thư viện',
  y_te: 'Y tế',
  bao_ve: 'Bảo vệ',
  hoc_sinh: 'Học sinh',
  phu_huynh: 'Phụ huynh',
};
