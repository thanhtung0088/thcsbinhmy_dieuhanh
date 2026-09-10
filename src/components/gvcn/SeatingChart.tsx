import { useState } from 'react';
import { useGvcn } from '../../context/GvcnContext';

export function SeatingChart({ className, total }: { className: string; total: number }) {
  const { getClassData, updateClassData } = useGvcn();
  const data = getClassData(className);
  const [editingDesk, setEditingDesk] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  const deskCount = Math.max(1, Math.ceil(total / 2)); // 2 học sinh / bàn
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
      <p className="text-[11px] text-ink/40 mt-4">
        Bấm vào 1 bàn để gõ tên học sinh ngồi ở đó (mỗi bàn 2 học sinh — gõ cả 2 tên cách nhau dấu phẩy nếu cần).
      </p>
    </div>
  );
}
