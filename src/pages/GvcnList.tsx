import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Check, UserSquare2, ChevronDown } from 'lucide-react';
import { CAMPUSES } from '../data/mockData';
import { CLASSES } from '../data/classes';
import { useGvcn } from '../context/GvcnContext';

function GvcnNameEditor({ className }: { className: string }) {
  const { getClassData, updateClassData } = useGvcn();
  const data = getClassData(className);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.gvcnName);

  function save() {
    updateClassData(className, { gvcnName: draft.trim() });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          placeholder="Tên GVCN"
          autoFocus
          className="rounded-md border border-black/10 px-2 py-1 text-xs focus-ring w-32"
        />
        <button onClick={save} className="text-emerald-600 hover:text-emerald-700">
          <Check size={15} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDraft(data.gvcnName);
        setEditing(true);
      }}
      className="flex items-center gap-1.5 text-xs text-ink/50 hover:text-blue-700 shrink-0"
    >
      {data.gvcnName || 'Chưa phân công'}
      <Pencil size={11} />
    </button>
  );
}

export function GvcnList() {
  const navigate = useNavigate();
  const [activeCampus, setActiveCampus] = useState(CAMPUSES[0]?.id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');

  const classesInCampus = CLASSES.filter((cl) => cl.campusId === activeCampus);

  function handleSwitchCampus(id: (typeof CAMPUSES)[number]['id']) {
    setActiveCampus(id);
    setSelectedClass('');
    setDropdownOpen(false);
  }

  function handlePickClass(name: string) {
    setSelectedClass(name);
    setDropdownOpen(false);
    navigate(`/gvcn/${name}`);
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600">GIÁO VIÊN CHỦ NHIỆM</p>
        <h2 className="text-xl font-bold text-ink mt-0.5">Danh sách GVCN theo điểm trường</h2>
        <p className="text-xs text-ink/50 mt-1">
          Chọn điểm trường, bấm vào ô danh sách lớp để mở lớp cần xem — hồ sơ, sơ đồ lớp, biên bản họp, kế hoạch và
          nhận xét AI. Bấm biểu tượng bút cạnh tên lớp để gán GVCN.
        </p>
      </div>

      {/* 4 tab điểm trường */}
      <div className="flex gap-1 border-b border-black/10 overflow-x-auto">
        {CAMPUSES.map((c) => {
          const count = CLASSES.filter((cl) => cl.campusId === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => handleSwitchCampus(c.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-sm border-b-2 -mb-px shrink-0 ${
                activeCampus === c.id ? 'border-blue-600 text-blue-700 font-medium' : 'border-transparent text-ink/50 hover:text-ink'
              }`}
            >
              {c.name}
              <span className="text-[11px] text-ink/30">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Dropdown mở danh sách lớp/GVCN của điểm trường đang chọn */}
      <div className="relative max-w-md">
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm hover:border-blue-400"
        >
          <span className="text-ink/70">
            {selectedClass ? (
              <span className="font-medium text-ink uppercase">{selectedClass}</span>
            ) : (
              `Chọn lớp (${classesInCampus.length} lớp)`
            )}
          </span>
          <ChevronDown size={16} className={`text-ink/40 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute z-20 mt-1.5 w-full rounded-xl border border-black/10 bg-white shadow-xl max-h-80 overflow-y-auto">
            {classesInCampus.length === 0 && (
              <p className="text-xs text-ink/40 text-center py-6">Điểm trường này chưa có lớp nào.</p>
            )}
            {classesInCampus.map((cl) => (
              <div
                key={cl.name}
                onClick={() => handlePickClass(cl.name)}
                className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-black/5 last:border-0 hover:bg-paper cursor-pointer"
              >
                <span className="flex items-center gap-2.5 min-w-0 flex-1">
                  <UserSquare2 size={15} className="text-blue-600 shrink-0" />
                  <span className="text-sm font-medium text-ink uppercase">{cl.name}</span>
                  <span className="text-xs text-ink/40 shrink-0">{cl.total} HS</span>
                </span>
                <GvcnNameEditor className={cl.name} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
