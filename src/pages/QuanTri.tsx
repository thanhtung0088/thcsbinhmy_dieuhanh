import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Landmark, Users } from 'lucide-react';
import { CAMPUSES, LEADERSHIP, OFFICE_STAFF, PARTY_CELLS, TOTAL_PARTY_MEMBERS } from '../data/mockData';
import { NhanSuChuyenMon } from './NhanSuChuyenMon';

type Tab = 'tong_quan' | 'nhan_su_cm';

export function QuanTri() {
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>(searchParams.get('q') ? 'nhan_su_cm' : 'tong_quan');

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600">QUẢN TRỊ NHÀ TRƯỜNG</p>
        <h2 className="text-xl font-bold text-ink mt-0.5">Quản trị</h2>
      </div>

      <div className="flex gap-1 border-b border-black/10">
        <button
          onClick={() => setTab('tong_quan')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-sm border-b-2 -mb-px ${tab === 'tong_quan' ? 'border-blue-600 text-blue-700 font-medium' : 'border-transparent text-ink/50 hover:text-ink'}`}
        >
          <Landmark size={14} /> Tổng quan quản trị
        </button>
        <button
          onClick={() => setTab('nhan_su_cm')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-sm border-b-2 -mb-px ${tab === 'nhan_su_cm' ? 'border-blue-600 text-blue-700 font-medium' : 'border-transparent text-ink/50 hover:text-ink'}`}
        >
          <Users size={14} /> Nhân sự - Chuyên môn
        </button>
      </div>

      {tab === 'tong_quan' ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold text-ink/70 mb-3">Ban giám hiệu</p>
            <ul className="space-y-1.5">
              {LEADERSHIP.map((l) => (
                <li key={l.id} className="text-sm text-ink flex justify-between">
                  <span>{l.title}{l.concurrent ? ` (kiêm ${l.concurrent})` : ''}</span>
                  <span className="font-medium">{l.name}</span>
                </li>
              ))}
              <li className="text-xs text-amber-600/80 pt-1">
                Điểm chính và Điểm 3 hiện chưa có quyết định phân công Phó Hiệu trưởng phụ trách.
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold text-ink/70 mb-3">4 điểm trường</p>
            <ul className="grid sm:grid-cols-2 gap-2">
              {CAMPUSES.map((c) => (
                <li key={c.id} className="text-xs text-ink/70 border border-black/5 rounded-lg px-3 py-2">
                  <span className="font-medium text-ink">{c.name}</span> — {c.formerName} · {c.classCount} lớp
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold text-ink/70 mb-3">Tổ Văn phòng</p>
            <ul className="space-y-1.5">
              {OFFICE_STAFF.map((o) => (
                <li key={o.campusId} className="text-sm text-ink/80 flex justify-between">
                  <span>{CAMPUSES.find((c) => c.id === o.campusId)?.name} — {o.head.title}</span>
                  <span className="font-medium text-ink">{o.head.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-black/10 bg-white p-4">
            <p className="text-sm font-semibold text-ink/70 mb-3">Đảng bộ — {TOTAL_PARTY_MEMBERS} đảng viên, 7 chi bộ</p>
            <ul className="grid sm:grid-cols-2 gap-1.5">
              {PARTY_CELLS.map((c) => (
                <li key={c.id} className="text-xs text-ink/70 flex justify-between">
                  <span>{c.name}</span>
                  <span className="text-ink/40">{c.memberCount} đảng viên</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <NhanSuChuyenMon />
      )}
    </div>
  );
}
