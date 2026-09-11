// Render markdown đơn giản (## tiêu đề, - gạch đầu dòng, **đậm**) thành JSX
// — đủ dùng cho văn phong AI trả lời, không cần thư viện markdown nặng.
export function SimpleMarkdown({ text, className }: { text: string; className?: string }) {
  const lines = text.split('\n').filter((l) => l.trim());
  const renderBold = (s: string) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      {lines.map((line, i) => {
        const l = line.trim();
        if (l.startsWith('═══') || l.startsWith('---')) {
          return <hr key={i} className="border-black/10 my-2" />;
        }
        if (l.startsWith('### ')) {
          return (
            <p key={i} className="text-xs font-bold mt-2 first:mt-0">
              {l.slice(4)}
            </p>
          );
        }
        if (l.startsWith('## ')) {
          return (
            <p key={i} className="text-sm font-bold mt-2.5 first:mt-0">
              {l.slice(3)}
            </p>
          );
        }
        if (l.startsWith('- ') || l.startsWith('* ')) {
          return (
            <p key={i} className="text-sm pl-3.5 relative before:content-['•'] before:absolute before:left-0 before:opacity-50">
              {renderBold(l.slice(2))}
            </p>
          );
        }
        if (/^\d+\.\s/.test(l)) {
          return (
            <p key={i} className="text-sm pl-1">
              {renderBold(l)}
            </p>
          );
        }
        return (
          <p key={i} className="text-sm">
            {renderBold(l)}
          </p>
        );
      })}
    </div>
  );
}
