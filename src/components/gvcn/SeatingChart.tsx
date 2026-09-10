import { useState } from 'react';
import { useGvcn } from '../../context/GvcnContext';

export function SeatingChart({ className, total }: { className: string; total: number }) {
  const { getClassData, updateClassData } = useGvcn();
  const data = getClassData(className);
  const [editingDesk, setEditingDesk] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const deskCount = Math.max(1, Math.ceil(total / 2)); // 2 học sinh / bàn thường
  const perColumn = Math.ceil(deskCount / 4);
  const columns = Array.from({ length: 4 }, (_, col) =>
    Array.from({ length: perColumn }, (_, row) => col * perColumn + row + 1).filter((n) => n <= deskCount)
  );

  function openDesk(deskId: string) {
    setEditingDesk(deskId);
    setDraft(data.seats[deskId] ?? '');
  }

  function saveDesk() {
    if (!editingDesk) return;
    updateClassData(className, { seats: { ...data.seats, [editingDesk]: draft.trim() } });
    setEditingDesk(null);
  }

  function saveSpecialSide(deskId: string, side: 'trai' | 'phai', value: string) {
    updateClassData(className, { seats: { ...data.seats, [`${deskId}-${side}`]: value } });
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2">
        {columns.map((col, ci) => (
          <div key={ci} className={`space-y-2 ${ci === 2 ? 'md:border-l md:border-dashed md:border-black/15 md:pl-6' : ''}`}>
            {col.map((n) => {
              const id = String(n);
              const name = data.seats[id];
              return editingDesk === id ? (
                <input
                  key={id}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveDesk()}
                  onBlur={saveDesk}
                  autoFocus
                  placeholder={`Tên HS bàn ${n}`}
                  className="w-full rounded-lg border-2 border-blue-500 px-3 py-2.5 text-xs font-semibold text-center focus:outline-none"
                />
              ) : (
                <button
                  key={id}
                  onClick={() => openDesk(id)}
                  className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-2.5 text-xs font-semibold text-center transition-colors"
                >
                  <span className="block opacity-80">BÀN {n}</span>
                  {name && <span className="block mt-0.5 normal-case font-medium truncate">{name}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 2 bàn đặc biệt góc phải — mỗi bàn chia 3 cột: tên | nhãn BÀN | tên */}
      <div className="mt-4 flex justify-end">
        <div className="grid grid-cols-2 gap-2 w-full md:w-1/2">
          {['DB1', 'DB2'].map((id, i) => (
            <div key={id} className="grid grid-cols-3 rounded-lg overflow-hidden border border-blue-200">
              <input
                value={data.seats[`${id}-trai`] ?? ''}
                onChange={(e) => saveSpecialSide(id, 'trai', e.target.value)}
                placeholder="Tên HS"
                className="min-w-0 px-1.5 py-2.5 text-[11px] text-center border-r border-blue-200 focus:outline-none focus:bg-blue-50"
              />
              <div className="bg-blue-600 text-white grid place-items-center text-[10px] font-bold px-0.5 text-center leading-tight">
                BÀN {i + 25}
              </div>
              <input
                value={data.seats[`${id}-phai`] ?? ''}
                onChange={(e) => saveSpecialSide(id, 'phai', e.target.value)}
                placeholder="Tên HS"
                className="min-w-0 px-1.5 py-2.5 text-[11px] text-center border-l border-blue-200 focus:outline-none focus:bg-blue-50"
              />
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-ink/40 mt-4">
        Bấm vào 1 bàn thường để gõ tên học sinh ngồi ở đó (mỗi bàn 2 học sinh — gõ cả 2 tên cách nhau dấu phẩy nếu
        cần). 2 bàn đặc biệt góc phải gõ trực tiếp tên vào 2 ô 2 bên.
      </p>
    </div>
  );
}
