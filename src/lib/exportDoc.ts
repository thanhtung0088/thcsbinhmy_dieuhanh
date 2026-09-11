import type PptxGenJSType from 'pptxgenjs';

// Các thư viện xuất file khá nặng — chỉ import() động khi người dùng thực sự
// bấm xuất, thay vì tải kèm ngay từ đầu, giúp web mở nhanh hơn cho mọi người.
type Block =
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'bullet'; text: string }
  | { type: 'para'; text: string };

function parseBlocks(text: string): Block[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('═══') && !l.startsWith('---'))
    .map((l): Block => {
      if (l.startsWith('### ')) return { type: 'h3', text: l.slice(4) };
      if (l.startsWith('## ')) return { type: 'h2', text: l.slice(3) };
      if (l.startsWith('- ') || l.startsWith('* ')) return { type: 'bullet', text: l.slice(2) };
      return { type: 'para', text: l };
    });
}

// Bỏ dấu ** in đậm khi xuất ra text thuần (PDF/PPT không cần markdown)
function stripBold(s: string) {
  return s.replace(/\*\*([^*]+)\*\*/g, '$1');
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportToDocx(text: string, title: string) {
  const { Document, Packer, Paragraph, HeadingLevel, TextRun } = await import('docx');
  const blocks = parseBlocks(text);
  const children: InstanceType<typeof Paragraph>[] = [
    new Paragraph({ text: title, heading: HeadingLevel.TITLE }),
    new Paragraph({ text: '' }),
  ];
  for (const b of blocks) {
    if (b.type === 'h2') {
      children.push(new Paragraph({ text: stripBold(b.text), heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 } }));
    } else if (b.type === 'h3') {
      children.push(new Paragraph({ text: stripBold(b.text), heading: HeadingLevel.HEADING_2, spacing: { before: 180, after: 100 } }));
    } else if (b.type === 'bullet') {
      children.push(new Paragraph({ text: stripBold(b.text), bullet: { level: 0 } }));
    } else {
      children.push(new Paragraph({ children: [new TextRun(stripBold(b.text))], spacing: { after: 100 } }));
    }
  }
  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${title}.docx`);
}

export async function exportToPdf(text: string, title: string) {
  const { jsPDF } = await import('jspdf');
  const blocks = parseBlocks(text);
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const marginX = 48;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const maxWidth = pageWidth - marginX * 2;
  let y = 56;

  function ensureSpace(lineHeight: number) {
    if (y + lineHeight > pageHeight - 48) {
      pdf.addPage();
      y = 56;
    }
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  const titleLines = pdf.splitTextToSize(title, maxWidth);
  pdf.text(titleLines, marginX, y);
  y += titleLines.length * 20 + 16;

  for (const b of blocks) {
    const clean = stripBold(b.text);
    if (b.type === 'h2') {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      const lines = pdf.splitTextToSize(clean, maxWidth);
      ensureSpace(lines.length * 17 + 10);
      y += 10;
      pdf.text(lines, marginX, y);
      y += lines.length * 17 + 4;
    } else if (b.type === 'h3') {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11.5);
      const lines = pdf.splitTextToSize(clean, maxWidth);
      ensureSpace(lines.length * 15 + 6);
      y += 6;
      pdf.text(lines, marginX, y);
      y += lines.length * 15 + 3;
    } else if (b.type === 'bullet') {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10.5);
      const lines = pdf.splitTextToSize(`•  ${clean}`, maxWidth - 12);
      ensureSpace(lines.length * 14);
      pdf.text(lines, marginX + 10, y);
      y += lines.length * 14;
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10.5);
      const lines = pdf.splitTextToSize(clean, maxWidth);
      ensureSpace(lines.length * 14);
      pdf.text(lines, marginX, y);
      y += lines.length * 14;
    }
  }
  pdf.save(`${title}.pdf`);
}

export async function exportToPptx(text: string, title: string) {
  const { default: PptxGenJS } = await import('pptxgenjs');
  const blocks = parseBlocks(text);
  const pptx = new PptxGenJS();

  // Slide tiêu đề
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: '0B2E4F' };
  titleSlide.addText(title, { x: 0.5, y: 2.2, w: 9, h: 1.5, fontSize: 28, bold: true, color: 'FFFFFF', align: 'center' });

  // Mỗi tiêu đề ## bắt đầu 1 slide mới, nội dung bên dưới là gạch đầu dòng
  let current: PptxGenJSType.Slide | null = null;
  let bodyLines: string[] = [];

  function flush() {
    if (current && bodyLines.length > 0) {
      current.addText(
        bodyLines.map((l) => ({ text: l, options: { bullet: true, breakLine: true } })),
        { x: 0.6, y: 1.3, w: 8.8, h: 5.5, fontSize: 16, color: '1A1A1A', valign: 'top' }
      );
    }
    bodyLines = [];
  }

  for (const b of blocks) {
    const clean = stripBold(b.text);
    if (b.type === 'h2') {
      flush();
      current = pptx.addSlide();
      current.addText(clean, { x: 0.5, y: 0.35, w: 9, h: 0.8, fontSize: 22, bold: true, color: '0B2E4F' });
    } else if (b.type === 'h3') {
      bodyLines.push(clean.toUpperCase());
    } else {
      if (!current) {
        current = pptx.addSlide();
        current.addText(title, { x: 0.5, y: 0.35, w: 9, h: 0.8, fontSize: 22, bold: true, color: '0B2E4F' });
      }
      bodyLines.push(clean);
    }
  }
  flush();

  await pptx.writeFile({ fileName: `${title}.pptx` });
}
