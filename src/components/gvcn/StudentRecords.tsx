import { useState } from 'react';
import { ClipboardPaste, Trash2 } from 'lucide-react';
import { useGvcn } from '../../context/GvcnContext';

export function StudentRecords({ className }: { className: string }) {
  const { getClassData, updateClassData } = useGvcn();
  const data = getClassData(className);
  const [pasteText, setPasteText] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleImport() {
    setError(null);
    const rows = pasteText
      .split(/\r?\n/)
      .map((r) => r.trim())
      .filter(Boolean);
    if (rows.length < 2) {
      setError('Cần dán ít nhất 1 dòng tiêu đề + 1 dòng dữ liệu (copy trực tiếp từ Excel, giữ nguyên dấu Tab).');
      return;
    }
    const headers = rows[0].split('\t').map((h) => h.trim() || 'Cột');
    const students = rows.slice(1).map((r) => {
      const cells = r.split('\t');
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => (obj[h] = (cells[i] ?? '').trim()));
      return obj;
    });
    updateClassData(className, { studentHeaders: headers, students });
    setPasteText('');
  }

  function clearAll() {
    updateClassData(className, { studentHeaders: [], students: [] });
  }

  return (
    <div className="space-y-4">
      {data.students.length === 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-ink/60">
            Mở file Excel danh sách lớp → bôi đen (kể cả dòng tiêu đề) → Ctrl+C → dán nguyên khối vào ô bên dưới.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={8}
            placeholder="Dán dữ liệu copy từ Excel vào đây…"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-xs font-mono focus-ring resize-none"
          />
          {error && <p className="text-xs text-signal-overdue">{error}</p>}
          <button
            onClick={handleImport}
            disabled={!pasteText.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium px-3 py-2 hover:bg-blue-700 disabled:opacity-40"
          >
            <ClipboardPaste size={13} /> Nhập danh sách
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-ink/50">{data.students.length} học sinh</p>
            <button onClick={clearAll} className="flex items-center gap-1 text-xs text-ink/40 hover:text-red-600">
              <Trash2 size={12} /> Xoá & dán lại
            </button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-black/10">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-paper text-left">
                  {data.studentHeaders.map((h) => (
                    <th key={h} className="px-3 py-2 font-medium text-ink/60 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.students.map((s, i) => (
                  <tr key={i} className="border-t border-black/5">
                    {data.studentHeaders.map((h) => (
                      <td key={h} className="px-3 py-1.5 whitespace-nowrap text-ink/80">
                        {s[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
