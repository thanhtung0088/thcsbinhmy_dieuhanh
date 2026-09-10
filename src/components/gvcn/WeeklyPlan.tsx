import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useGvcn } from '../../context/GvcnContext';

export function WeeklyPlan({ className }: { className: string }) {
  const { getClassData, updateClassData } = useGvcn();
  const data = getClassData(className);
  const [draft, setDraft] = useState('');

  function add() {
    if (!draft.trim()) return;
    updateClassData(className, {
      plans: [...data.plans, { id: Math.random().toString(36).slice(2, 9), text: draft.trim(), done: false }],
    });
    setDraft('');
  }

  function toggle(id: string) {
    updateClassData(className, {
      plans: data.plans.map((p) => (p.id === id ? { ...p, done: !p.done } : p)),
    });
  }

  function remove(id: string) {
    updateClassData(className, { plans: data.plans.filter((p) => p.id !== id) });
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Việc cần làm trong tuần/tháng…"
          className="flex-1 rounded-lg border border-black/10 px-3 py-1.5 text-sm focus-ring"
        />
        <button onClick={add} className="rounded-lg bg-blue-600 text-white px-3 hover:bg-blue-700">
          <Plus size={15} />
        </button>
      </div>

      <ul className="space-y-1.5">
        {data.plans.length === 0 && <li className="text-xs text-ink/40">Chưa có kế hoạch nào.</li>}
        {data.plans.map((p) => (
          <li key={p.id} className="flex items-center gap-2.5 bg-paper rounded-lg px-3 py-2">
            <input type="checkbox" checked={p.done} onChange={() => toggle(p.id)} className="shrink-0" />
            <span className={`flex-1 text-sm min-w-0 ${p.done ? 'line-through text-ink/30' : 'text-ink/80'}`}>{p.text}</span>
            <button onClick={() => remove(p.id)} className="text-ink/30 hover:text-red-600 shrink-0">
              <Trash2 size={13} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
