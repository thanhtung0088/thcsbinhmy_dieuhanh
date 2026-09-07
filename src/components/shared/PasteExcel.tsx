import { useState } from 'react';
import { ClipboardPaste, X } from 'lucide-react';

export interface PastedTable {
  headers: string[];
  rows: string[][];
}

export function parseExcelPaste(text: string): PastedTable | null {
  const lines = text.replace(/\r/g, '').split('\n').filter((l) => l.length > 0);
  if (lines.length === 0) return null;
  const rows = lines.map((l) => l.split('\t'));
  const [headers, ...body] = rows;
  return { headers, rows: body };
}

export function PasteExcelButton({ onPaste }: { onPaste: (table: PastedTable) => void }) {
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState('');

  function handleApply() {
    const table = parseExcelPaste(raw);
    if (table) {
      onPaste(table);
      setOpen(false);
      setRaw('');
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-ink/70 hover:border-blue-400 hover:text-blue-700 transition-colors"
      >
        <ClipboardPaste size={13} />
        Dán từ Excel
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-96 rounded-xl border border-black/10 bg-white p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-ink/70">Dán bảng đã copy từ Excel (Ctrl+V)</p>
            <button onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink">
              <X size={14} />
            </button>
          </div>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onPaste={(e) => {
              const text = e.clipboardData.getData('text/plain');
              if (text) setRaw(text);
            }}
            rows={5}
            placeholder="Bôi đen vùng dữ liệu trong Excel, Ctrl+C rồi dán vào đây…"
            className="w-full rounded-md border border-black/10 px-2 py-1.5 text-xs focus-ring resize-none font-mono"
          />
          <p className="text-[10px] text-ink/40 mt-1">Dòng đầu tiên được coi là tiêu đề cột.</p>
          <button
            onClick={handleApply}
            disabled={!raw.trim()}
            className="mt-2 w-full rounded-md bg-blue-600 text-white text-xs font-medium py-1.5 hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Hiển thị bảng
          </button>
        </div>
      )}
    </div>
  );
}

export function PastedTableView({ table, onClear }: { table: PastedTable; onClear: () => void }) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/40 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-blue-100/60">
        <p className="text-xs font-semibold text-blue-900">Bảng vừa dán từ Excel</p>
        <button onClick={onClear} className="text-blue-700/60 hover:text-blue-900">
          <X size={14} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-blue-200">
              {table.headers.map((h, i) => (
                <th key={i} className="text-left font-medium px-3 py-1.5 text-blue-900 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri} className="border-b border-blue-100 last:border-0">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-1.5 text-ink/80 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
