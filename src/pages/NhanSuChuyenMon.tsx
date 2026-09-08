import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Users, GraduationCap } from 'lucide-react';
import { STAFF } from '../data/staff';
import { CAMPUSES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { PasteExcelButton, PastedTableView, type PastedTable } from '../components/shared/PasteExcel';
import type { CampusId } from '../types';

const CAMPUS_LABEL: Record<CampusId, string> = {
  chinh: 'Điểm chính', diem1: 'Điểm 1', diem2: 'Điểm 2', diem3: 'Điểm 3',
};

type Tab = 'nhan_su' | 'chuyen_mon';

export function NhanSuChuyenMon() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>('nhan_su');
  const [campusFilter, setCampusFilter] = useState<CampusId | 'all'>('all');
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [pasted, setPasted] = useState<PastedTable | null>(null);

  // GV/NV chỉ xem — không thấy nút dán Excel để nạp/ghi đè danh sách
  const canEdit = user ? !['giao_vien', 'nhan_vien', 'hoc_sinh', 'phu_huynh'].includes(user.role) : false;

  const rows = STAFF.filter((s) => {
    if (campusFilter !== 'all' && s.campusId !== campusFilter) return false;
    if (tab === 'chuyen_mon' && !s.subject) return false;
    if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600">QUẢN LÝ NHÂN SỰ - CHUYÊN MÔN</p>
        <h2 className="text-xl font-bold text-ink mt-0.5">
          {tab === 'nhan_su' ? 'Nhân sự toàn trường' : 'Phân công chuyên môn'}
        </h2>
        <p className="text-xs text-ink/50 mt-1">196 CB-GV-NV thật, trích PCCM Học kỳ I 2026-2027.</p>
      </div>

      <div className="flex gap-1 border-b border-black/10">
        <button
          onClick={() => setTab('nhan_su')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-sm border-b-2 -mb-px ${tab === 'nhan_su' ? 'border-blue-600 text-blue-700 font-medium' : 'border-transparent text-ink/50 hover:text-ink'}`}
        >
          <Users size={14} /> Nhân sự
        </button>
        <button
          onClick={() => setTab('chuyen_mon')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-sm border-b-2 -mb-px ${tab === 'chuyen_mon' ? 'border-blue-600 text-blue-700 font-medium' : 'border-transparent text-ink/50 hover:text-ink'}`}
        >
          <GraduationCap size={14} /> Phân công chuyên môn
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/30" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm tên…"
            className="w-full rounded-lg border border-black/10 pl-8 pr-3 py-1.5 text-xs focus-ring"
          />
        </div>
        <select
          value={campusFilter}
          onChange={(e) => setCampusFilter(e.target.value as CampusId | 'all')}
          className="rounded-lg border border-black/10 px-2.5 py-1.5 text-xs"
        >
          <option value="all">Toàn trường</option>
          {CAMPUSES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {canEdit && <PasteExcelButton onPaste={setPasted} />}
        {!canEdit && (
          <span className="text-[11px] text-ink/40 italic">Chế độ chỉ xem (theo phân quyền tài khoản)</span>
        )}
      </div>

      {pasted && <PastedTableView table={pasted} onClear={() => setPasted(null)} />}

      <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-blue-50 text-blue-900/70">
                <th className="text-left font-medium px-3 py-2 w-10">STT</th>
                <th className="text-left font-medium px-3 py-2">Họ và tên</th>
                <th className="text-left font-medium px-3 py-2">Chức vụ</th>
                <th className="text-left font-medium px-3 py-2">Điểm trường</th>
                {tab === 'chuyen_mon' && <th className="text-left font-medium px-3 py-2">Môn</th>}
                <th className="text-left font-medium px-3 py-2">{tab === 'chuyen_mon' ? 'Phân công (lớp/tiết)' : 'Công tác'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.stt} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                  <td className="px-3 py-1.5 text-ink/40">{s.stt}</td>
                  <td className="px-3 py-1.5 text-ink font-medium">{s.name}</td>
                  <td className="px-3 py-1.5 text-ink/70">{s.title}</td>
                  <td className="px-3 py-1.5 text-ink/50">{CAMPUS_LABEL[s.campusId]}</td>
                  {tab === 'chuyen_mon' && <td className="px-3 py-1.5 text-ink/70">{s.subject}</td>}
                  <td className="px-3 py-1.5 text-ink/50 max-w-xs truncate" title={s.assignment}>{s.assignment}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-ink/40 py-6">Không có kết quả phù hợp.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[11px] text-ink/40">Hiển thị {rows.length} / {STAFF.length} người.</p>
    </div>
  );
}
