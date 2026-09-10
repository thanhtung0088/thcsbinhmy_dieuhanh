import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactElement } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { useAuth } from './context/AuthContext';
import { useUnlock } from './context/UnlockContext';
import { can, type ModuleKey } from './lib/rbac';
import { LockedModuleScreen } from './components/shared/LockedModuleScreen';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CampusOverview } from './pages/CampusOverview';
import { CampusDetail } from './pages/CampusDetail';
import { SystemMap } from './pages/SystemMap';
import { DepartmentWorkspace } from './pages/DepartmentWorkspace';
import { HocSinhWorkspace } from './pages/HocSinhWorkspace';
import { DigitalLibrary } from './pages/DigitalLibrary';
import { ToTruongCM } from './pages/ToTruongCM';
import { KeHoachTruong } from './pages/KeHoachTruong';
import { QuanTri } from './pages/QuanTri';
import { DichVuCong } from './pages/DichVuCong';
import { PhanTichDuBao } from './pages/PhanTichDuBao';
import { AiAgentKpi } from './pages/AiAgentKpi';
import { GvcnList } from './pages/GvcnList';
import { GvcnWorkspace } from './pages/GvcnWorkspace';
import { PhanTichVanBanAi } from './pages/PhanTichVanBanAi';

import { ThongBaoCong } from './pages/ThongBaoCong';

// Ai đăng nhập cũng THẤY đủ menu/sidebar — chỉ khoá phần NỘI DUNG nếu chưa
// đủ quyền theo vai trò và chưa nhập đúng mã mở khoá của khu vực đó.
function RequireModule({ moduleKey, children }: { moduleKey: ModuleKey; children: ReactElement }) {
  const { user } = useAuth();
  const { unlocked } = useUnlock();
  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'super_admin') return children;
  if (can(user.role, moduleKey, 'view') || unlocked.has(moduleKey)) return children;
  return <LockedModuleScreen moduleKey={moduleKey} />;
}

const LATER_PHASE_ROUTES: { path: string; label: string; phase: string; departmentKey?: string; moduleKey: ModuleKey }[] = [
  { path: '/cong-tac-dang', label: 'Công tác Đảng', phase: 'Phase 2', moduleKey: 'cong_tac_dang' },
  { path: '/cong-viec', label: 'Công việc / giao việc', phase: 'Phase 2', moduleKey: 'cong_viec' },
  { path: '/co-so-vat-chat', label: 'Cơ sở vật chất & tài sản', phase: 'Phase 4', departmentKey: 'Cơ sở vật chất', moduleKey: 'co_so_vat_chat' },
  { path: '/tai-chinh', label: 'Tài chính', phase: 'Phase 4', moduleKey: 'tai_chinh' },
  { path: '/van-ban', label: 'Văn bản điện tử', phase: 'Phase 4', moduleKey: 'van_ban' },
  { path: '/lich-cong-tac', label: 'Lịch công tác', phase: 'Phase 2', moduleKey: 'lich_cong_tac' },
  { path: '/kiem-tra', label: 'Kiểm tra nội bộ', phase: 'Phase 5', moduleKey: 'kiem_tra' },
  { path: '/thi-dua', label: 'Thi đua – khen thưởng', phase: 'Phase 5', departmentKey: 'Thi đua', moduleKey: 'thi_dua' },
  { path: '/bao-cao', label: 'Báo cáo thông minh', phase: 'Phase 5', moduleKey: 'bao_cao' },
  { path: '/cai-dat', label: 'Cài đặt', phase: 'Phase 8', moduleKey: 'cai_dat' },
];

export default function App() {
  const { user } = useAuth();

  if (!user) {
    // Khách (chưa đăng nhập): CHỈ xem/dùng được 4 trang này — mọi đường
    // dẫn khác tự chuyển về Tổng quan. Vẫn hiển thị đủ banner/topbar
    // (AppLayout) để có nút "Đăng nhập" và có thể bấm logo 3 lần vào Admin.
    return (
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/gioi-thieu" element={<SystemMap />} />
          <Route path="/dich-vu-cong" element={<DichVuCong />} />
          <Route path="/kho-tai-nguyen" element={<DigitalLibrary />} />
          <Route path="/thong-bao" element={<ThongBaoCong />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/diem-truong" element={<CampusOverview />} />
        <Route path="/diem-truong/:campusId" element={<CampusDetail />} />
        <Route path="/gioi-thieu" element={<SystemMap />} />
        <Route path="/hoc-sinh" element={<RequireModule moduleKey="hoc_sinh"><HocSinhWorkspace /></RequireModule>} />
        <Route path="/gvcn" element={<RequireModule moduleKey="hoc_sinh"><GvcnList /></RequireModule>} />
        <Route path="/gvcn/:className" element={<RequireModule moduleKey="hoc_sinh"><GvcnWorkspace /></RequireModule>} />
        <Route path="/kho-tai-nguyen" element={<DigitalLibrary />} />
        <Route path="/to-truong-cm" element={<RequireModule moduleKey="chuyen_mon"><ToTruongCM /></RequireModule>} />
        <Route path="/ke-hoach-truong" element={<RequireModule moduleKey="chuyen_mon"><KeHoachTruong /></RequireModule>} />
        <Route path="/quan-tri" element={<RequireModule moduleKey="quan_tri"><QuanTri /></RequireModule>} />
        <Route path="/dich-vu-cong" element={<DichVuCong />} />
        <Route path="/phan-tich" element={<RequireModule moduleKey="phan_tich"><PhanTichDuBao /></RequireModule>} />
        <Route path="/ai-agent-kpi" element={<RequireModule moduleKey="ai_agent"><AiAgentKpi /></RequireModule>} />
        <Route path="/phan-tich-van-ban-ai" element={<RequireModule moduleKey="ai_agent"><PhanTichVanBanAi /></RequireModule>} />
        <Route path="/thong-bao" element={<ThongBaoCong />} />
        {/* Đường dẫn cũ trước khi gộp menu — chuyển hướng để không vỡ link đã lưu */}
        <Route path="/chuyen-mon" element={<Navigate to="/quan-tri" replace />} />
        <Route path="/nhan-su" element={<Navigate to="/quan-tri" replace />} />
        <Route path="/nhan-su-chuyen-mon" element={<Navigate to="/quan-tri" replace />} />
        <Route path="/ai-agent" element={<Navigate to="/ai-agent-kpi" replace />} />
        <Route path="/kpi" element={<Navigate to="/ai-agent-kpi" replace />} />
        {LATER_PHASE_ROUTES.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={
              <RequireModule moduleKey={r.moduleKey}>
                <DepartmentWorkspace moduleName={r.label} phase={r.phase} departmentKey={r.departmentKey} />
              </RequireModule>
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
