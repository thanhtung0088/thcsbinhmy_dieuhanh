import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useGvcn } from '../../context/GvcnContext';

export function MeetingNotes({ className }: { className: string }) {
  const { getClassData, updateClassData } = useGvcn();
  const data = getClassData(className);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  function add() {
    if (!title.trim()) return;
    updateClassData(className, {
      notes: [
        { id: Math.random().toString(36).slice(2, 9), title: title.trim(), content: content.trim(), date: new Date().toLocaleDateString('vi-VN') },
        ...data.notes,
      ],
    });
    setTitle('');
    setContent('');
  }

  function remove(id: string) {
    updateClassData(className, { notes: data.notes.filter((n) => n.id !== id) });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-black/10 p-3 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề (vd: Họp phụ huynh đầu năm, Sinh hoạt lớp tuần 3...)"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="Nội dung biên bản…"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus-ring resize-none"
        />
        <button
          onClick={add}
          disabled={!title.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium px-3 py-1.5 hover:bg-blue-700 disabled:opacity-40"
        >
          <Plus size={13} /> Thêm biên bản
        </button>
      </div>

      <div className="space-y-2">
        {data.notes.length === 0 && <p className="text-xs text-ink/40 text-center py-4">Chưa có biên bản nào.</p>}
        {data.notes.map((n) => (
          <div key={n.id} className="rounded-lg border border-black/10 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-ink">{n.title}</p>
                <p className="text-[11px] text-ink/40">{n.date}</p>
              </div>
              <button onClick={() => remove(n.id)} className="text-ink/30 hover:text-red-600 shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
            {n.content && <p className="text-sm text-ink/70 mt-1.5 whitespace-pre-wrap">{n.content}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
