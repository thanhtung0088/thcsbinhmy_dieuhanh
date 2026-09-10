// Vercel Edge Function — đóng vai trò "người trung gian" giữa web và Gemini.
// Web sẽ gọi vào đây (/api/gemini), function này mới là nơi thật sự cầm
// API key và gọi sang Google. Nhờ vậy API key không bao giờ lộ ra trình
// duyệt của người dùng.
export const config = { runtime: 'edge' };

const SYSTEM_CONTEXT = `Bạn là trợ lý ảo "Dịch vụ công" của Trường THCS Bình Mỹ.
Nhiệm vụ: giải đáp ngắn gọn, thân thiện, dễ hiểu cho phụ huynh/học sinh về các
thủ tục hành chính phổ biến ở cấp THCS (tuyển sinh đầu cấp, chuyển trường,
xin nghỉ học, cấp lại học bạ/bảng điểm, miễn giảm học phí, v.v.).
Quy tắc:
- Trả lời bằng tiếng Việt, giọng lịch sự, súc tích (tối đa ~120 từ).
- Nếu câu hỏi cần hồ sơ/giấy tờ cụ thể của trường mà bạn không chắc chắn,
  hãy nói rõ đây là thông tin tham khảo chung và khuyên phụ huynh gửi yêu
  cầu qua form "Dịch vụ công" trên trang để được Ban Giám hiệu xác nhận
  chính xác.
- Không bịa số điện thoại, địa chỉ, hay số liệu cụ thể của trường.`;

const OPS_SYSTEM_CONTEXT = `Bạn là "Trợ lý điều hành AI" của Trạm Điều Hành Trường THCS Bình Mỹ —
hỗ trợ Ban Giám hiệu, Tổ trưởng chuyên môn và giáo viên trong công việc quản lý,
điều hành, phân tích số liệu nhà trường.
Quy tắc:
- Trả lời bằng tiếng Việt, súc tích, đi thẳng vào việc, có thể dùng gạch đầu dòng.
- Nếu người dùng hỏi số liệu cụ thể mà không có trong dữ liệu được cung cấp kèm
  câu hỏi, hãy nói rõ là chưa có dữ liệu, không tự bịa số liệu.
- Có thể đưa ra nhận định, cảnh báo, gợi ý hành động dựa trên dữ liệu được cung cấp,
  nhưng luôn phân biệt rõ đâu là số liệu thật, đâu là nhận định/gợi ý của bạn.`;

// Phần "nhập vai" bổ sung theo từng chức danh — ghép thêm vào sau
// OPS_SYSTEM_CONTEXT để trợ lý ưu tiên đúng mối quan tâm của người hỏi.
const PERSONA_CONTEXT: Record<string, string> = {
  'hieu-truong': `Bạn đang nói chuyện với HIỆU TRƯỞNG. Ưu tiên: bức tranh tổng thể toàn trường, việc
cần Hiệu trưởng ra quyết định/phê duyệt, cảnh báo rủi ro, KPI, so sánh giữa các tổ/điểm trường.
Trả lời ở tầm quản lý cấp cao, không đi quá sâu vào chi tiết vụn vặt trừ khi được hỏi.`,
  'pho-ht': `Bạn đang nói chuyện với PHÓ HIỆU TRƯỞNG. Ưu tiên: tiến độ công việc được phân công,
nhắc việc, tổng hợp tình hình các tổ/mảng phụ trách, hỗ trợ chuẩn bị nội dung báo cáo lên Hiệu trưởng.`,
  'to-truong-cm': `Bạn đang nói chuyện với TỔ TRƯỞNG CHUYÊN MÔN. Ưu tiên: sinh hoạt tổ, hồ sơ chuyên
môn, nhiệm vụ Ban Giám hiệu giao cho tổ, gợi ý nội dung chuyên đề, nhắc hạn nộp báo cáo tổ.`,
  'ke-toan': `Bạn đang nói chuyện với KẾ TOÁN trường. Ưu tiên: tài chính, thu-chi, dự toán, hạn nộp
báo cáo tài chính, hỗ trợ soạn thảo văn bản/đề xuất liên quan tài chính. Tuyệt đối không tự bịa số
liệu tài chính cụ thể nếu không có trong dữ liệu cung cấp — luôn nói rõ cần tra cứu sổ sách thực tế.`,
  gvcn: `Bạn đang nói chuyện với GIÁO VIÊN CHỦ NHIỆM. Ưu tiên: tình hình lớp chủ nhiệm, sĩ số, liên
lạc phụ huynh, soạn thông báo/thư mời họp phụ huynh, nhắc việc chủ nhiệm theo tuần.`,
  cntt: `Bạn đang nói chuyện với phụ trách CÔNG NGHỆ THÔNG TIN (CNTT) của trường. Ưu tiên: hỗ trợ
kỹ thuật (máy tính, máy chiếu, mạng, phần mềm quản lý trường học), hướng dẫn khắc phục sự cố thiết
bị thông dụng, soạn thông báo/kế hoạch bảo trì kỹ thuật. Với sự cố phức tạp, khuyên liên hệ kỹ
thuật viên/nhà cung cấp thiết bị thay vì tự ý tháo lắp phần cứng.`,
  tpt: `Bạn đang nói chuyện với TỔNG PHỤ TRÁCH ĐỘI (TPT). Ưu tiên: hoạt động Đội Thiếu niên Tiền
phong, phong trào thi đua học sinh, kịch bản chào cờ/sinh hoạt tập thể, kế hoạch sự kiện, thi đua
giữa các lớp/chi đội.`,
  'giam-thi': `Bạn đang nói chuyện với GIÁM THỊ (giám sát nề nếp học sinh). Ưu tiên: nề nếp, chuyên
cần, tác phong học sinh, biên bản/thông báo xử lý vi phạm nội quy, lịch trực. Giữ giọng điềm tĩnh,
đúng mực, hướng tới giáo dục học sinh chứ không chỉ trừng phạt.`,
  gvbm: `Bạn đang nói chuyện với GIÁO VIÊN BỘ MÔN (GVBM). Ưu tiên: soạn giáo án, ý tưởng phương
pháp giảng dạy, ra đề/câu hỏi kiểm tra theo môn học, gợi ý hoạt động lớp học sinh động. Khi ra đề,
luôn ghi rõ đây là gợi ý tham khảo, giáo viên cần kiểm tra lại trước khi dùng chính thức.`,
};

const KPI_SYSTEM_CONTEXT = `Bạn là AI Agent hỗ trợ Hiệu trưởng Trường THCS Bình Mỹ tổng hợp kết quả
tự đánh giá, xếp loại KPI quý của giáo viên/cán bộ.
Bạn sẽ nhận một danh sách các bản tự đánh giá ĐÃ ĐƯỢC HỆ THỐNG TÍNH ĐIỂM SẴN
(không phải bạn tính) — nhiệm vụ của bạn là ĐỌC HIỂU và VIẾT BÁO CÁO TỔNG HỢP,
không tự tính toán lại hay suy diễn ra số điểm khác với số liệu được cung cấp.
Quy tắc:
- Trả lời bằng tiếng Việt, giọng chuyên nghiệp, súc tích, có cấu trúc rõ ràng
  (dùng gạch đầu dòng / đoạn ngắn), tối đa khoảng 350 từ.
- Nội dung cần có: (1) Nhận định chung toàn trường, (2) Nêu tên các cá nhân nổi bật
  (điểm cao, hoàn thành xuất sắc), (3) Nêu tên các cá nhân cần lưu ý/hỗ trợ thêm
  (điểm thấp, nhiều nhiệm vụ trễ hạn), (4) Đề xuất hành động cụ thể cho Hiệu trưởng.
- Luôn dùng đúng số điểm, tên, tỉ lệ đã cho trong dữ liệu — không bịa thêm số liệu.`;

const EXTRACT_SYSTEM_CONTEXT = `Bạn là AI Agent giúp Ban Giám hiệu Trường THCS Bình Mỹ đọc văn bản/tài liệu
(có thể là ảnh chụp, PDF, hoặc chữ) và tóm tắt ra CÔNG VIỆC TRỌNG TÂM CỐT LÕI cần làm trong tuần.
Quy tắc:
- Trả lời bằng tiếng Việt, súc tích, dùng định dạng Markdown đơn giản (## cho tiêu đề ngày nếu tài
  liệu có nêu rõ ngày cụ thể, "- " cho từng việc).
- Nếu tài liệu có nêu rõ ngày/thứ cho từng việc, nhóm việc theo từng ngày (## Thứ Hai (dd/mm), ...).
  Nếu không nêu rõ ngày, chỉ cần liệt kê gạch đầu dòng bình thường, không cần tiêu đề ngày.
- Mỗi việc: 1 dòng ngắn gọn, nêu rõ hành động cụ thể + giờ/hạn nếu tài liệu có ghi (in đậm giờ bằng
  **14h00** nếu có).
- Chỉ nêu việc thật sự CỐT LÕI, TRỌNG TÂM (khoảng 3-10 việc) — bỏ qua chi tiết phụ, căn cứ pháp lý,
  lời chào, thủ tục hành chính rườm rà.
- Không thêm lời mở đầu kiểu "Dưới đây là..." hay lời kết — vào thẳng nội dung.
- Nếu tài liệu không có công việc cụ thể nào, trả lời đúng 1 câu: "Không tìm thấy công việc cụ thể nào trong tài liệu này."`;

const NOTEBOOK_SYSTEM_CONTEXT = `Bạn là AI Agent đọc tài liệu giúp cán bộ Trường THCS Bình Mỹ — giống cách
NotebookLM hoạt động: đọc kỹ toàn bộ tài liệu nguồn được cung cấp, sau đó tóm tắt/trả lời chỉ dựa
trên nội dung các tài liệu đó.
Quy tắc:
- Trả lời bằng tiếng Việt, súc tích, có cấu trúc rõ ràng (dùng Markdown: ## tiêu đề mục, "- " gạch
  đầu dòng, **in đậm** từ khoá quan trọng).
- CHỈ dùng thông tin có trong tài liệu nguồn được cung cấp — nếu câu hỏi vượt ngoài nội dung tài
  liệu, nói rõ "Tài liệu không đề cập đến nội dung này" thay vì tự suy đoán hay bịa thông tin.
- Khi tóm tắt tự động (không có câu hỏi cụ thể): nêu (1) tài liệu nói về gì, (2) các ý/số liệu/việc
  chính, (3) điểm cần lưu ý nếu có (hạn chót, con số quan trọng, rủi ro...). Khoảng 150-250 từ.
- Khi trả lời câu hỏi cụ thể: đi thẳng vào câu trả lời, có thể trích ngắn gọn ý từ tài liệu để dẫn
  chứng, không cần nhắc lại toàn bộ quy tắc trên.`;

const GVCN_REMARK_CONTEXT = `Bạn là trợ lý giúp Giáo viên chủ nhiệm viết NHẬN XÉT THI ĐUA lớp dựa trên các
ghi chú ngắn giáo viên cung cấp (tình hình học tập, nề nếp, hoạt động phong trào...).
Quy tắc:
- Trả lời bằng tiếng Việt, giọng sư phạm, khích lệ nhưng thẳng thắn, khoảng 100-180 từ.
- Nêu rõ điểm tích cực trước, sau đó điểm cần khắc phục (nếu có), kết thúc bằng lời động viên/định hướng.
- Chỉ dùng thông tin giáo viên cung cấp, không bịa thêm số liệu hay sự việc cụ thể không có trong ghi chú.`;

interface GeminiPart {
  text: string;
}

async function callGeminiParts(apiKey: string, systemText: string, parts: any[], maxOutputTokens = 400) {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Key kiểu mới (AQ...) của Google phải gửi qua header này, KHÔNG
        // dán vào cuối URL (?key=...) như key kiểu cũ (AIzaSy...) nữa.
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents: [{ role: 'user', parts }],
        generationConfig: { temperature: 0.4, maxOutputTokens },
      }),
    }
  );

  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`Gemini API lỗi (${resp.status}): ${detail}`);
  }

  const data = await resp.json();
  const outParts: GeminiPart[] = data?.candidates?.[0]?.content?.parts ?? [];
  return outParts.map((p) => p.text).join('').trim();
}

async function callGemini(apiKey: string, systemText: string, userText: string, maxOutputTokens = 400) {
  return callGeminiParts(apiKey, systemText, [{ text: userText }], maxOutputTokens);
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Chỉ chấp nhận POST' }), { status: 405 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Chưa cấu hình GEMINI_API_KEY trên Vercel (Settings → Environment Variables).' }),
      { status: 500 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Body không hợp lệ' }), { status: 400 });
  }

  const { mode } = body;

  try {
    if (mode === 'draft') {
      // Soạn giúp nội dung yêu cầu trong form "Dịch vụ công"
      const { serviceLabel, groupLabel, requesterName, className } = body;
      const prompt = `Viết giúp một đoạn nội dung yêu cầu (2-4 câu, giọng lịch sự, rõ ràng, đúng trọng tâm)
để phụ huynh/học sinh gửi tới Ban Giám hiệu Trường THCS Bình Mỹ.
Thủ tục: "${serviceLabel}" (nhóm: ${groupLabel}).
Người gửi: ${requesterName || '(chưa nhập tên)'}${className ? `, lớp ${className}` : ''}.
Chỉ trả về đúng đoạn nội dung, không thêm tiêu đề, không thêm ghi chú, không dùng markdown.`;
      const text = await callGemini(apiKey, SYSTEM_CONTEXT, prompt);
      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (mode === 'ops-chat') {
      // Trợ lý điều hành chung (nút "Hỏi AI") — hoặc trợ lý theo vai trò
      // (dải thẻ dưới thanh tìm kiếm) nếu có gửi kèm persona
      const { message, context, persona } = body;
      if (!message || typeof message !== 'string') {
        return new Response(JSON.stringify({ error: 'Thiếu nội dung câu hỏi' }), { status: 400 });
      }
      const system = persona && PERSONA_CONTEXT[persona] ? `${OPS_SYSTEM_CONTEXT}\n\n${PERSONA_CONTEXT[persona]}` : OPS_SYSTEM_CONTEXT;
      const prompt = context
        ? `Dữ liệu hiện có của trường (JSON, dùng để trả lời nếu liên quan, không bịa thêm ngoài đây):\n${JSON.stringify(
            context
          )}\n\nCâu hỏi: ${message}`
        : message;
      const text = await callGemini(apiKey, system, prompt, 500);
      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (mode === 'phan-tich') {
      // AI Agent tại trang Phân tích và dự báo — trả lời câu hỏi hoặc tự đưa
      // ra nhận định/dự báo dựa trên dữ liệu snapshot của trang
      const { message, context, autoInsight } = body;
      const dataBlock = `Dữ liệu snapshot trang Phân tích và dự báo (JSON):\n${JSON.stringify(context ?? {})}`;
      const prompt = autoInsight
        ? `${dataBlock}\n\nHãy viết 1 đoạn nhận định + dự báo ngắn (khoảng 100-150 từ) về tình hình chung của trường
dựa trên dữ liệu trên: điểm cần chú ý, xu hướng, rủi ro/cảnh báo nổi bật, và 1-2 gợi ý hành động cho Ban Giám hiệu.`
        : `${dataBlock}\n\nCâu hỏi: ${message}`;
      const text = await callGemini(apiKey, OPS_SYSTEM_CONTEXT, prompt, 450);
      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (mode === 'gvcn-remark') {
      const { notes } = body;
      if (!notes || typeof notes !== 'string' || !notes.trim()) {
        return new Response(JSON.stringify({ error: 'Chưa có ghi chú nào để viết nhận xét' }), { status: 400 });
      }
      const text = await callGemini(apiKey, GVCN_REMARK_CONTEXT, notes.slice(0, 4000), 400);
      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (mode === 'extract-tasks') {
      // Đọc tài liệu (file Word→text đã trích ở client, hoặc ảnh/PDF gửi thẳng)
      // để tóm tắt công việc trọng tâm. Trả về TEXT (markdown) thay vì JSON —
      // giống cách NotebookLM hiển thị: luôn đọc được, không bao giờ lỗi
      // "định dạng không đọc được" vì không cần parse cấu trúc gì cả.
      const { texts, files, weekDates } = body as {
        texts?: string[];
        files?: { mimeType: string; data: string }[];
        weekDates?: { label: string; date: string }[];
      };
      const hasText = Array.isArray(texts) && texts.some((t) => t && t.trim());
      const hasFiles = Array.isArray(files) && files.length > 0;
      if (!hasText && !hasFiles) {
        return new Response(JSON.stringify({ error: 'Chưa có tài liệu nào để phân tích' }), { status: 400 });
      }
      const daysList = (weekDates || []).map((d) => `- ${d.label}`).join('\n');
      const promptText = `Các ngày trong tuần đang xét (nếu tài liệu nêu rõ ngày/thứ, hãy đối chiếu và
dùng đúng nhãn ngày dưới đây làm tiêu đề mục):
${daysList || '(không có thông tin ngày cụ thể)'}

Hãy đọc (các) tài liệu đính kèm bên dưới và tóm tắt công việc trọng tâm theo đúng hướng dẫn.`;

      const parts: any[] = [{ text: promptText }];
      if (hasFiles) {
        for (const f of files!.slice(0, 2)) {
          parts.push({ inline_data: { mime_type: f.mimeType, data: f.data } });
        }
      }
      if (hasText) {
        for (const t of texts!) {
          if (t && t.trim()) parts.push({ text: t.slice(0, 12000) });
        }
      }

      const text = await callGeminiParts(apiKey, EXTRACT_SYSTEM_CONTEXT, parts, 1500);
      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (mode === 'notebook') {
      // "Phân tích văn bản AI" — kiểu NotebookLM: đọc (các) tài liệu nguồn,
      // rồi tóm tắt tự động hoặc trả lời câu hỏi chỉ dựa trên tài liệu đó.
      const { texts, files, message, isSummary } = body as {
        texts?: string[];
        files?: { mimeType: string; data: string }[];
        message?: string;
        isSummary?: boolean;
      };
      const hasText = Array.isArray(texts) && texts.some((t) => t && t.trim());
      const hasFiles = Array.isArray(files) && files.length > 0;
      if (!hasText && !hasFiles) {
        return new Response(JSON.stringify({ error: 'Chưa có tài liệu nguồn nào để phân tích' }), { status: 400 });
      }
      const instruction = isSummary
        ? 'Hãy tóm tắt tự động toàn bộ tài liệu nguồn bên dưới theo đúng hướng dẫn.'
        : `Câu hỏi của người dùng về (các) tài liệu nguồn bên dưới: ${message}`;

      const parts: any[] = [{ text: instruction }];
      if (hasFiles) {
        for (const f of files!.slice(0, 5)) {
          parts.push({ inline_data: { mime_type: f.mimeType, data: f.data } });
        }
      }
      if (hasText) {
        for (const t of texts!) {
          if (t && t.trim()) parts.push({ text: t.slice(0, 20000) });
        }
      }

      const text = await callGeminiParts(apiKey, NOTEBOOK_SYSTEM_CONTEXT, parts, isSummary ? 900 : 700);
      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (mode === 'kpi-summary') {
      // AI Agent tổng hợp các bản tự đánh giá KPI thành báo cáo trình Hiệu trưởng
      const { submissions } = body;
      if (!Array.isArray(submissions) || submissions.length === 0) {
        return new Response(JSON.stringify({ error: 'Chưa có dữ liệu bản tự đánh giá nào để tổng hợp' }), {
          status: 400,
        });
      }
      const prompt = `Danh sách bản tự đánh giá KPI đã được hệ thống tính điểm sẵn (JSON):
${JSON.stringify(submissions)}

Hãy viết báo cáo tổng hợp trình Hiệu trưởng theo đúng cấu trúc đã hướng dẫn.`;
      const text = await callGemini(apiKey, KPI_SYSTEM_CONTEXT, prompt, 900);
      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // mode === 'chat' (mặc định): hỏi-đáp tự do về thủ tục (Dịch vụ công)
    const { message } = body;
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Thiếu nội dung câu hỏi' }), { status: 400 });
    }
    const text = await callGemini(apiKey, SYSTEM_CONTEXT, message);
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Không gọi được Gemini', detail: String(err?.message ?? err) }), {
      status: 502,
    });
  }
}
