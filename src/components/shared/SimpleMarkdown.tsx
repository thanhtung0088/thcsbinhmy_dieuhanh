// Render markdown đơn giản (## tiêu đề, - gạch đầu dòng, **đậm**, và cặp
// GV|/HS| thành bảng 2 cột) — đủ dùng cho văn phong AI trả lời, không cần
// thư viện markdown nặng.
export function SimpleMarkdown({ text, className }: { text: string; className?: string }) {
  const rawLines = text.split('\n').filter((l) => l.trim());
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

  // Gom các dòng GV|.../HS|... liền kề thành từng cặp hàng bảng
  const elements: JSX.Element[] = [];
  let gvhsRows: { gv: string; hs: string }[] = [];
  let pendingGv: string | null = null;

  function flushTable(key: string) {
    if (gvhsRows.length === 0) return;
    elements.push(
      <table key={key} className="w-full text-sm border border-black/10 rounded-lg overflow-hidden my-1.5">
        <thead>
          <tr className="bg-paper">
            <th className="border-b border-black/10 px-2.5 py-1.5 text-left w-1/2 font-semibold">Hoạt động của GV</th>
            <th className="border-b border-black/10 px-2.5 py-1.5 text-left w-1/2 font-semibold">Hoạt động của HS</th>
          </tr>
        </thead>
        <tbody>
          {gvhsRows.map((r, i) => (
            <tr key={i} className="align-top">
              <td className="border-t border-black/5 px-2.5 py-1.5">{renderBold(r.gv)}</td>
              <td className="border-t border-black/5 px-2.5 py-1.5">{renderBold(r.hs)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
    gvhsRows = [];
  }

  rawLines.forEach((line, i) => {
    const l = line.trim();
    if (l.startsWith('GV|')) {
      pendingGv = l.slice(3).trim();
      return;
    }
    if (l.startsWith('HS|')) {
      gvhsRows.push({ gv: pendingGv ?? '', hs: l.slice(3).trim() });
      pendingGv = null;
      return;
    }
    // Gặp dòng không phải GV|/HS| -> đóng bảng đang gom (nếu có) rồi xử lý bình thường
    flushTable(`tbl-${i}`);

    if (l.startsWith('═══') || l.startsWith('---')) {
      elements.push(<hr key={i} className="border-black/10 my-2" />);
    } else if (l.startsWith('### ')) {
      elements.push(
        <p key={i} className="text-xs font-bold mt-2 first:mt-0">
          {l.slice(4)}
        </p>
      );
    } else if (l.startsWith('## ')) {
      elements.push(
        <p key={i} className="text-sm font-bold mt-2.5 first:mt-0">
          {l.slice(3)}
        </p>
      );
    } else if (l.startsWith('- ') || l.startsWith('* ')) {
      elements.push(
        <p key={i} className="text-sm pl-3.5 relative before:content-['•'] before:absolute before:left-0 before:opacity-50">
          {renderBold(l.slice(2))}
        </p>
      );
    } else {
      elements.push(
        <p key={i} className="text-sm">
          {renderBold(l)}
        </p>
      );
    }
  });
  flushTable('tbl-end');

  return <div className={`space-y-1.5 ${className ?? ''}`}>{elements}</div>;
}
