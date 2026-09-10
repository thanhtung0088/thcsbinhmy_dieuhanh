import { useGvcn } from '../../context/GvcnContext';

const PER_COLUMN = 6;
const COLUMN_COUNT = 4;
const DESK_COUNT = PER_COLUMN * COLUMN_COUNT; // 24 bàn = 6 bàn/dãy x 4 dãy

function DeskCell({ n, left, right, onChange }: { n: number; left: string; right: string; onChange: (side: 'trai' | 'phai', value: string) => void }) {
  return (
    <div className="grid grid-cols-[1fr_26px_1fr] rounded-lg overflow-hidden border border-blue-200 bg-white shrink-0">
      <input
        value={left}
        onChange={(e) => onChange('trai', e.target.value)}
        placeholder="Tên HS"
        className="min-w-0 w-full px-1.5 py-2.5 text-[11px] text-center focus:outline-none focus:bg-blue-50"
      />
      <div className="bg-blue-600 text-white flex items-center justify-center text-[8px] font-bold leading-[1.1] px-0.5 text-center select-none">
        Bàn
        <br />
        {n}
      </div>
      <input
        value={right}
        onChange={(e) => onChange('phai', e.target.value)}
        placeholder="Tên HS"
        className="min-w-0 w-full px-1.5 py-2.5 text-[11px] text-center focus:outline-none focus:bg-blue-50"
      />
    </div>
  );
}

export function SeatingChart({ className }: { className: string; total: number }) {
  const { getClassData, updateClassData } = useGvcn();
  const data = getClassData(className);

  function setSeat(deskId: string, side: 'trai' | 'phai', value: string) {
    updateClassData(className, { seats: { ...data.seats, [`${deskId}-${side}`]: value } });
  }

  const columns = Array.from({ length: COLUMN_COUNT }, (_, col) =>
    Array.from({ length: PER_COLUMN }, (_, row) => col * PER_COLUMN + row + 1)
  );

  return (
    <div>
      {/* Kéo ngang trên điện thoại thay vì bị dồn xuống 2 dãy */}
      <div className="overflow-x-auto pb-2 -mx-1 px-1">
        <div className="flex gap-6 min-w-[760px]">
          {columns.map((col, ci) => (
            <div key={ci} className={`flex-1 space-y-2 ${ci === 2 ? 'border-l border-dashed border-black/15 pl-6' : ''}`}>
              {col.map((n) => (
                <DeskCell
                  key={n}
                  n={n}
                  left={data.seats[`${n}-trai`] ?? ''}
                  right={data.seats[`${n}-phai`] ?? ''}
                  onChange={(side, value) => setSeat(String(n), side, value)}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Bàn giáo viên — góc dưới cùng bên phải */}
        <div className="min-w-[760px] flex justify-end mt-4">
          <div className="w-full max-w-[calc(25%-1.125rem)] rounded-lg overflow-hidden border border-gold-400">
            <div className="bg-gold-500 text-hoa-950 text-center text-[11px] font-bold py-1.5">BÀN GIÁO VIÊN</div>
            <input
              value={data.seats['gv-note'] ?? ''}
              onChange={(e) => updateClassData(className, { seats: { ...data.seats, 'gv-note': e.target.value } })}
              placeholder="Ghi chú (không bắt buộc)"
              className="w-full px-2 py-2 text-[11px] text-center focus:outline-none focus:bg-amber-50"
            />
          </div>
        </div>
      </div>

      <p className="text-[11px] text-ink/40 mt-3">
        {DESK_COUNT} bàn, mỗi bàn 2 học sinh — gõ trực tiếp tên vào 2 ô 2 bên mỗi bàn. Trên điện thoại, vuốt/kéo
        ngang để xem hết các dãy bàn.
      </p>
    </div>
  );
}
