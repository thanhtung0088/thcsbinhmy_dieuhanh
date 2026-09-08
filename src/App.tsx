import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { useAuth } from './context/AuthContext';
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

const LATER_PHASE_ROUTES: { path: string; label: string; phase: string; departmentKey?: string }[] = [
  { path: '/cong-tac-dang', label: 'Công tác Đảng', phase: 'Phase 2' },
  { path: '/cong-viec', label: 'Công việc / giao việc', phase: 'Phase 2' },
  { path: '/co-so-vat-chat', label: 'Cơ sở vật chất & tài sản', phase: 'Phase 4', departmentKey: 'Cơ sở vật chất' },
  { path: '/tai-chinh', label: 'Tài chính', phase: 'Phase 4' },
  { path: '/van-ban', label: 'Văn bản điện tử', phase: 'Phase 4' },
  { path: '/lich-cong-tac', label: 'Lịch công tác', phase: 'Phase 2' },
  { path: '/kiem-tra', label: 'Kiểm tra nội bộ', phase: 'Phase 5' },
  { path: '/thi-dua', label: 'Thi đua – khen thưởng', phase: 'Phase 5', departmentKey: 'Thi đua' },
  { path: '/bao-cao', label: 'Báo cáo thông minh', phase: 'Phase 5' },
  { path: '/thong-bao', label: 'Thông báo', phase: 'Phase 2' },
  { path: '/cai-dat', label: 'Cài đặt', phase: 'Phase 8' },
];

export default function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
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
        <Route path="/hoc-sinh" element={<HocSinhWorkspace />} />
        <Route path="/kho-tai-nguyen" element={<DigitalLibrary />} />
        <Route path="/to-truong-cm" element={<ToTruongCM />} />
        <Route path="/ke-hoach-truong" element={<KeHoachTruong />} />
        <Route path="/quan-tri" element={<QuanTri />} />
        <Route path="/dich-vu-cong" element={<DichVuCong />} />
        <Route path="/phan-tich" element={<PhanTichDuBao />} />
        <Route path="/ai-agent-kpi" element={<AiAgentKpi />} />
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
            element={<DepartmentWorkspace moduleName={r.label} phase={r.phase} departmentKey={r.departmentKey} />}
          />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
