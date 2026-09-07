import {
  School,
  Flag,
  Users2,
  Building2,
  UserCircle2,
  Monitor,
  ServerCog,
  BrainCircuit,
  Database,
  Cloud,
} from 'lucide-react';
import { CAMPUSES, LEADERSHIP, OFFICE_STAFF, PARTY_CELLS, SUBJECT_GROUPS, TOTAL_PARTY_MEMBERS } from '../data/mockData';
import { MODULE_CARDS, MODULE_COLOR_CLASSES } from '../data/moduleMap';

const CAMPUS_ACCENT: Record<string, { ring: string; badge: string; icon: string }> = {
  chinh: { ring: 'border-rose-200', badge: 'bg-rose-600', icon: 'text-rose-600' },
  diem1: { ring: 'border-blue-200', badge: 'bg-blue-600', icon: 'text-blue-600' },
  diem2: { ring: 'border-emerald-200', badge: 'bg-emerald-600', icon: 'text-emerald-600' },
};

function OrgBox({ title, sub, tone = 'ink' }: { title: string; sub?: string; tone?: 'ink' | 'gold' }) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-center shadow-sm ${
        tone === 'gold' ? 'bg-hoa-950 text-white border-hoa-950' : 'bg-white border-black/10 text-ink'
      }`}
    >
      <p className="text-xs font-semibold leading-tight">{title}</p>
      {sub && <p className="text-[10px] text-current/70 mt-0.5">{sub}</p>}
    </div>
  );
}

export function SystemMap() {
  return (
    <div className="space-y-4 -m-6 p-6 bg-[#eef1f6]">
      {/* Header banner */}
      <div className="rounded-xl bg-hoa-950 text-white px-6 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-white/10 grid place-items-center shrink-0">
            <School size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">TRẠM ĐIỀU HÀNH TRƯỜNG THCS 3 ĐIỂM</h1>
            <p className="text-sm text-white/70 mt-0.5">
              01 Nhà trường thống nhất – 03 điểm trường – 01 hệ thống dữ liệu – 01 bộ máy điều hành
            </p>
          </div>
        </div>
        <div className="hidden lg:block text-right text-xs text-gold-400 italic leading-snug">
          Chuyển đổi số – Nâng tầm quản trị
          <br />
          Kiến tạo môi trường giáo dục hiện đại
        </div>
      </div>

      {/* Row: campuses / org chart / party cells / subject groups */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.4fr_1fr_0.9fr] gap-4">
        {/* Campuses */}
        <div className="rounded-xl bg-white border border-black/10 p-4">
          <div className="flex items-center gap-2 mb-3 text-hoa-950">
            <Users2 size={16} />
            <h3 className="text-sm font-bold">ĐIỂM TRƯỜNG</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {CAMPUSES.map((c) => {
              const accent = CAMPUS_ACCENT[c.id];
              return (
                <div key={c.id} className={`rounded-lg border-2 ${accent.ring} p-2 text-center`}>
                  <div className={`mx-auto h-9 w-9 rounded-md ${accent.badge} text-white grid place-items-center mb-1.5`}>
                    <Building2 size={16} />
                  </div>
                  <p className={`text-[10px] font-bold ${accent.icon}`}>
                    {c.id === 'chinh' ? 'ĐIỂM TRƯỜNG CHÍNH' : c.name.toUpperCase()}
                  </p>
                  <p className="text-[11px] font-medium text-ink mt-1 leading-tight">{c.formerName}</p>
                  <p className="text-[10px] text-ink/40">
                    {LEADERSHIP.find((l) => l.campusId === c.id)?.name ?? 'Hiệu trưởng trực tiếp phụ trách'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Org chart */}
        <div className="rounded-xl bg-white border border-black/10 p-4">
          <div className="flex items-center gap-2 mb-3 text-hoa-950">
            <UserCircle2 size={16} />
            <h3 className="text-sm font-bold">SƠ ĐỒ TỔ CHỨC NHÀ TRƯỜNG</h3>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <OrgBox title="HIỆU TRƯỞNG" sub={LEADERSHIP.find((l) => l.title === 'Hiệu trưởng')?.name} tone="gold" />
              <OrgBox title="HỘI ĐỒNG TRƯỜNG" />
            </div>
            <div className="h-3 w-px bg-black/15" />
            <div className="grid grid-cols-2 gap-3 w-full">
              <OrgBox
                title="PHÓ HIỆU TRƯỞNG"
                sub={`Điểm 1 · ${LEADERSHIP.find((l) => l.campusId === 'diem1')?.name}`}
              />
              <OrgBox
                title="PHÓ HIỆU TRƯỞNG"
                sub={`Điểm 2 · ${LEADERSHIP.find((l) => l.campusId === 'diem2')?.name}`}
              />
            </div>
            <div className="h-3 w-px bg-black/15" />
            <div className="grid grid-cols-3 gap-2 w-full">
              <OrgBox title="Tổ chuyên môn" sub="11 tổ" />
              <OrgBox title="Tổ Văn phòng" sub={OFFICE_STAFF[0].head.name} />
              <OrgBox title="Các bộ phận chức năng" />
            </div>
          </div>
        </div>

        {/* Đảng bộ */}
        <div className="rounded-xl bg-white border border-black/10 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-rose-600 text-white">
            <Flag size={16} />
            <div>
              <h3 className="text-sm font-bold leading-tight">ĐẢNG BỘ</h3>
              <p className="text-[10px] text-white/80">Đảng bộ trường THCS Bình Mỹ · {TOTAL_PARTY_MEMBERS} đảng viên</p>
            </div>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-ink/40 border-b border-black/5">
                <th className="text-left font-medium px-4 py-1.5 w-8">STT</th>
                <th className="text-left font-medium py-1.5">Chi bộ</th>
                <th className="text-right font-medium px-4 py-1.5">Đảng viên</th>
              </tr>
            </thead>
            <tbody>
              {PARTY_CELLS.map((c, i) => (
                <tr key={c.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-1.5 text-ink/50">{i + 1}</td>
                  <td className="py-1.5 text-ink">{c.name}</td>
                  <td className="px-4 py-1.5 text-right font-medium text-ink">{c.memberCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tổ chuyên môn */}
        <div className="rounded-xl bg-white border border-black/10 p-4">
          <div className="flex items-center gap-2 mb-3 text-hoa-950">
            <Users2 size={16} />
            <h3 className="text-sm font-bold">CÁC TỔ CHUYÊN MÔN</h3>
          </div>
          <ol className="space-y-1.5">
            {SUBJECT_GROUPS.map((g, i) => (
              <li key={g.id} className="text-xs text-ink/80 flex gap-1.5">
                <span className="text-ink/40">{i + 1}.</span> Tổ {g.name}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Module grid */}
      <div className="rounded-xl bg-white border border-black/10 p-4">
        <div className="rounded-lg bg-hoa-950 text-white px-4 py-2 mb-4">
          <h3 className="text-sm font-bold">CÁC MODULE CHỨC NĂNG</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {MODULE_CARDS.map((m) => {
            const cls = MODULE_COLOR_CLASSES[m.color];
            const Icon = m.icon;
            return (
              <div key={m.no} className={`rounded-lg border border-black/10 overflow-hidden flex flex-col ${cls.tint}`}>
                <div className={`flex items-center gap-2 px-3 py-2 text-white ${cls.header}`}>
                  <Icon size={15} />
                  <p className="text-[11px] font-bold leading-tight">
                    {String(m.no).padStart(2, '0')}. {m.title.toUpperCase()}
                  </p>
                </div>
                <ul className="px-3 py-2.5 space-y-1 flex-1">
                  {m.bullets.map((b, i) => (
                    <li key={i} className="text-[11px] text-ink/70 flex gap-1.5 leading-snug">
                      <span className={`${cls.bullet} font-bold shrink-0`}>•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Architecture + footer boxes */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr_1fr] gap-4">
        <div className="rounded-xl bg-white border border-black/10 p-4">
          <div className="rounded-lg bg-hoa-950 text-white px-4 py-2 mb-4 inline-block">
            <h3 className="text-sm font-bold">KIẾN TRÚC HỆ THỐNG</h3>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            {[
              { icon: Users2, title: 'Người dùng', lines: ['Hiệu trưởng, Phó hiệu trưởng, Nhân viên, Phụ huynh...', '(Phân quyền theo vai trò)'] },
              { icon: Monitor, title: 'Frontend', lines: ['React + TypeScript', 'Vite + TailwindCSS', 'Responsive'] },
              { icon: ServerCog, title: 'API / Service Layer', lines: ['Node.js + Express', 'RESTful API', 'Authentication'] },
              { icon: BrainCircuit, title: 'AI Service', lines: ['Gemini / OpenAI', 'AI Agents', 'Vector DB (tùy chọn)'] },
              { icon: Database, title: 'Database', lines: ['PostgreSQL (Supabase/Firebase)', 'Lưu trữ an toàn, sao lưu'] },
              { icon: Cloud, title: 'Cloud Infrastructure', lines: ['Vercel / Netlify / AWS', 'Bảo mật, mở rộng'] },
            ].map((step, i, arr) => (
              <div key={step.title} className="flex items-center gap-3">
                <div className="text-center w-32">
                  <div className="mx-auto h-10 w-10 rounded-lg bg-hoa-900 text-white grid place-items-center mb-1.5">
                    <step.icon size={18} />
                  </div>
                  <p className="text-[11px] font-semibold text-ink leading-tight">{step.title}</p>
                  {step.lines.map((l) => (
                    <p key={l} className="text-[9.5px] text-ink/40 leading-tight">
                      {l}
                    </p>
                  ))}
                </div>
                {i < arr.length - 1 && <span className="text-ink/20 text-lg">→</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white border border-black/10 p-4">
          <h3 className="text-sm font-bold text-ink mb-3">DỮ LIỆU THẬT ĐÃ CẬP NHẬT</h3>
          <ul className="space-y-1.5 text-xs text-ink/70">
            <li>✓ 3 điểm trường + 11 tổ chuyên môn (PCCM HK1 2026-2027)</li>
            <li>✓ Ban giám hiệu, TTCM/TPCM, TTVP/TPVP đúng người thật</li>
            <li>✓ Sĩ số 88 lớp, tính đến 06/09/2026 (KH tuần 1)</li>
            <li>✓ Đảng bộ 7 chi bộ (78 đảng viên) — do nhà trường cung cấp</li>
            <li className="text-ink/40">○ Nhiệm vụ/văn bản/KPI mẫu — minh họa luồng thao tác</li>
          </ul>
        </div>

        <div className="rounded-xl bg-white border border-black/10 p-4">
          <h3 className="text-sm font-bold text-ink mb-3">BẢO MẬT & PHÂN QUYỀN</h3>
          <ul className="space-y-1.5 text-xs text-ink/70">
            <li>✓ RBAC theo vai trò</li>
            <li>✓ Nhật ký hệ thống (Audit log)</li>
            <li>✓ Phân quyền dữ liệu nhạy cảm</li>
            <li>✓ Xác thực 2 lớp (tùy chọn)</li>
            <li>✓ Sao lưu & khôi phục dữ liệu</li>
          </ul>
        </div>
      </div>

      <div className="rounded-lg bg-hoa-950 text-white text-center text-xs font-medium py-2.5 tracking-wide">
        TRẠM ĐIỀU HÀNH TRƯỜNG THCS 3 ĐIỂM &nbsp;–&nbsp; NỀN TẢNG QUẢN TRỊ THÔNG MINH &nbsp;|&nbsp; AN TOÀN &nbsp;|&nbsp; HIỆU QUẢ &nbsp;|&nbsp; PHÁT TRIỂN BỀN VỮNG
      </div>
    </div>
  );
}
