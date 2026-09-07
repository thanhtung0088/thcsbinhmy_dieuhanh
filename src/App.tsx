import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CampusOverview } from './pages/CampusOverview';
import { SystemMap } from './pages/SystemMap';
import { DepartmentWorkspace } from './pages/DepartmentWorkspace';
import { HocSinhWorkspace } from './pages/HocSinhWorkspace';
import { DigitalLibrary } from './pages/DigitalLibrary';
import { ToTruongCM } from './pages/ToTruongCM';
import { KeHoachTruong } from './pages/KeHoachTruong';

const LATER_PHASE_ROUTES: { path: string; label: string; phase: string; departmentKey?: string }[] = [
  { path: '/quan-tri', label: 'Quản trị nhà trường', phase: 'Phase 2' },
  { path: '/cong-tac-dang', label: 'Công tác Đảng', phase: 'Phase 2' },
  { path: '/chuyen-mon', label: 'Quản lý chuyên môn', phase: 'Phase 2', departmentKey: 'Chuyên môn' },
  { path: '/nhan-su', label: 'Nhân sự', phase: 'Phase 2' },
  { path: '/cong-viec', label: 'Công việc / giao việc', phase: 'Phase 2' },
  { path: '/ai-agent', label: 'AI Agent', phase: 'Phase 6' },
  { path: '/kpi', label: 'KPI', phase: 'Phase 5' },
  { path: '/co-so-vat-chat', label: 'Cơ sở vật chất & tài sản', phase: 'Phase 4', departmentKey: 'Cơ sở vật chất' },
  { path: '/tai-chinh', label: 'Tài chính', phase: 'Phase 4' },
  { path: '/van-ban', label: 'Văn bản điện tử', phase: 'Phase 4' },
  { path: '/lich-cong-tac', label: 'Lịch công tác', phase: 'Phase 2' },
  { path: '/kiem-tra', label: 'Kiểm tra nội bộ', phase: 'Phase 5' },
  { path: '/thi-dua', label: 'Thi đua – khen thưởng', phase: 'Phase 5', departmentKey: 'Thi đua' },
  { path: '/phan-tich', label: 'Phân tích dữ liệu', phase: 'Phase 7' },
  { path: '/bao-cao', label: 'Báo cáo thông minh', phase: 'Phase 5' },
  { path: '/thong-bao', label: 'Thông báo', phase: 'Phase 2' },
  { path: '/dich-vu-cong', label: 'Dịch vụ công', phase: 'Phase 4' },
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
        <Route path="/so-do-he-thong" element={<SystemMap />} />
        <Route path="/hoc-sinh" element={<HocSinhWorkspace />} />
        <Route path="/kho-hoc-lieu-so" element={<DigitalLibrary />} />
        <Route path="/to-truong-cm" element={<ToTruongCM />} />
        <Route path="/ke-hoach-truong" element={<KeHoachTruong />} />
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
