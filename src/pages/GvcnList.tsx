import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Check, UserSquare2 } from 'lucide-react';
import { CAMPUSES } from '../data/mockData';
import { CLASSES } from '../data/classes';
import { useGvcn } from '../context/GvcnContext';

function ClassRow({ className, total }: { className: string; total: number }) {
  const { getClassData, updateClassData } = useGvcn();
  const data = getClassData(className);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.gvcnName);

  function save() {
    updateClassData(className, { gvcnName: draft.trim() });
    setEditing(false);
  }

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-black/5 last:border-0">
      <Link to={`/gvcn/${className}`} className="flex items-center gap-2.5 min-w-0 flex-1 hover:text-blue-700">
        <UserSquare2 size={15} className="text-blue-600 shrink-0" />
        <span className="text-sm font-medium text-ink uppercase">{className}</span>
        <span className="text-xs text-ink/40 shrink-0">{total} HS</span>
      </Link>

      {editing ? (
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
      ) : (
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
      )}
    </div>
  );
}

export function GvcnList() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600">GIÁO VIÊN CHỦ NHIỆM</p>
        <h2 className="text-xl font-bold text-ink mt-0.5">Danh sách GVCN theo điểm trường</h2>
        <p className="text-xs text-ink/50 mt-1">
          Bấm vào tên lớp để mở hồ sơ, sơ đồ lớp, biên bản họp, kế hoạch và nhận xét AI. Bấm biểu tượng bút để gán
          tên GVCN cho lớp.
        </p>
      </div>

      {CAMPUSES.map((c) => {
        const classes = CLASSES.filter((cl) => cl.campusId === c.id);
        if (classes.length === 0) return null;
        return (
          <div key={c.id} className="rounded-xl border border-black/10 bg-white overflow-hidden">
            <p className="text-sm font-semibold text-ink/70 px-4 py-2.5 bg-paper border-b border-black/5">
              {c.name} <span className="text-ink/40 font-normal">({classes.length} lớp)</span>
            </p>
            {classes.map((cl) => (
              <ClassRow key={cl.name} className={cl.name} total={cl.total} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
