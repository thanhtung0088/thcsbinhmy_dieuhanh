import { useAiAssistant } from '../../context/AiAssistantContext';
import { AI_PERSONAS } from '../../data/aiPersonas';

export function AiRoleBar() {
  const { openAssistant } = useAiAssistant();

  return (
    <div className="border-b border-black/10 bg-white px-4 md:px-6 py-2.5 overflow-x-auto shrink-0">
      <div className="flex items-center gap-2 min-w-max">
        <span className="text-[11px] font-medium text-ink/40 shrink-0 hidden sm:inline">Trợ lý AI theo vai trò:</span>
        {AI_PERSONAS.map((p) => (
          <button
            key={p.key}
            onClick={() => openAssistant(p.key)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium shrink-0 transition-colors ${p.chipClass}`}
          >
            <p.icon size={13} />
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
