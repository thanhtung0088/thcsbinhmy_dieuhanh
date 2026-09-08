import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, GraduationCap } from 'lucide-react';
import { STAFF } from '../../data/staff';
import { CLASSES } from '../../data/classes';
import { CAMPUSES } from '../../data/mockData';

interface SearchResult {
  type: 'staff' | 'class';
  label: string;
  sub: string;
  to: string;
}

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];

    const staffResults: SearchResult[] = STAFF.filter((s) => s.name.toLowerCase().includes(q))
      .slice(0, 6)
      .map((s) => ({
        type: 'staff',
        label: s.name,
        sub: `${s.title}${s.subject ? ` · ${s.subject}` : ''} · ${CAMPUSES.find((c) => c.id === s.campusId)?.name}`,
        to: `/quan-tri?q=${encodeURIComponent(s.name)}`,
      }));

    const classResults: SearchResult[] = CLASSES.filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 6)
      .map((c) => ({
        type: 'class',
        label: `Lớp ${c.name}`,
        sub: `${CAMPUSES.find((cp) => cp.id === c.campusId)?.name} · ${c.total} học sinh (${c.female} nữ)`,
        to: `/hoc-sinh?class=${encodeURIComponent(c.name)}`,
      }));

    return [...staffResults, ...classResults];
  }, [query]);

  function handleSelect(r: SearchResult) {
    setQuery('');
    setOpen(false);
    navigate(r.to);
  }

  return (
    <div className="relative flex-1 max-w-md">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Tìm giáo viên, nhân viên, lớp học…"
        className="w-full rounded-lg border border-black/10 bg-paper py-2 pl-9 pr-3 text-sm focus-ring focus:outline-none"
      />
      {open && results.length > 0 && (
        <div className="absolute left-0 top-full mt-1 w-full max-h-80 overflow-y-auto rounded-lg border border-black/10 bg-white shadow-lg z-30">
          {results.map((r) => (
            <button
              key={r.type + r.label}
              onClick={() => handleSelect(r)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-paper transition-colors"
            >
              <div className="h-7 w-7 rounded-full bg-blue-50 text-blue-600 grid place-items-center shrink-0">
                {r.type === 'staff' ? <User size={13} /> : <GraduationCap size={13} />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink truncate">{r.label}</p>
                <p className="text-[11px] text-ink/40 truncate">{r.sub}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      {open && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute left-0 top-full mt-1 w-full rounded-lg border border-black/10 bg-white shadow-lg z-30 px-3 py-3 text-xs text-ink/40">
          Không tìm thấy kết quả cho "{query}".
        </div>
      )}
    </div>
  );
}
