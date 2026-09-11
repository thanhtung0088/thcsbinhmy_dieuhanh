import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { OFFICE_DEPARTMENTS } from '../data/officeDepartments';
import { DepartmentWorkspace } from './DepartmentWorkspace';

export function OfficeDeptWorkspace() {
  const { deptKey } = useParams<{ deptKey: string }>();
  const dept = OFFICE_DEPARTMENTS.find((d) => d.key === deptKey);

  if (!dept) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-ink/50">Không tìm thấy bộ phận này.</p>
        <Link to="/hanh-chinh-van-phong" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
          ← Quay lại Hành chính Văn phòng
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Link to="/hanh-chinh-van-phong" className="flex items-center gap-1 text-xs text-ink/40 hover:text-ink">
        <ChevronLeft size={13} /> Hành chính Văn phòng
      </Link>
      <DepartmentWorkspace moduleName={dept.name} departmentKey={dept.name} />
    </div>
  );
}
