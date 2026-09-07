import { Building2, GraduationCap, UserSquare2, Users } from 'lucide-react';
import { CAMPUSES, LEADERSHIP } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export function CampusOverview() {
  const { setActiveCampus } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-wide text-gold-500">01 NHÀ TRƯỜNG · 03 ĐIỂM TRƯỜNG</p>
        <h2 className="text-2xl font-bold text-ink mt-0.5">3 điểm trường</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {CAMPUSES.map((c) => {
          const head = LEADERSHIP.find((l) => l.campusId === c.id);
          return (
            <div key={c.id} className="rounded-xl border border-black/10 bg-white p-5 flex flex-col">
              <div className="flex items-center gap-2 text-hoa-700">
                <Building2 size={18} />
                <p className="text-xs font-semibold uppercase tracking-wide">{c.name}</p>
              </div>
              <h3 className="text-lg font-bold text-ink mt-1">{c.formerName}</h3>
              <p className="text-xs text-ink/50 mt-0.5">
                Lớp ký hiệu "{c.classLetter}" · {head ? `${head.title.replace('Phó Hiệu trưởng phụ trách ', 'PHT ')}: ${head.name}` : 'Phụ trách trực tiếp: Hiệu trưởng'}
              </p>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center">
                  <Users size={15} className="mx-auto text-ink/40" />
                  <p className="text-sm font-semibold text-ink mt-1">{c.teacherCount + c.staffCount}</p>
                  <p className="text-[11px] text-ink/40">CB-GV-NV</p>
                </div>
                <div className="text-center">
                  <UserSquare2 size={15} className="mx-auto text-ink/40" />
                  <p className="text-sm font-semibold text-ink mt-1">{c.studentCount.toLocaleString('vi-VN')}</p>
                  <p className="text-[11px] text-ink/40">Học sinh</p>
                </div>
                <div className="text-center">
                  <GraduationCap size={15} className="mx-auto text-ink/40" />
                  <p className="text-sm font-semibold text-ink mt-1">{c.classCount}</p>
                  <p className="text-[11px] text-ink/40">Lớp</p>
                </div>
              </div>

              <button
                onClick={() => setActiveCampus(c.id)}
                className="mt-5 rounded-lg border border-hoa-700 text-hoa-700 text-sm font-medium py-2 hover:bg-hoa-950 hover:text-white hover:border-hoa-950 transition-colors"
              >
                Xem Trung tâm điều hành của điểm này
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
