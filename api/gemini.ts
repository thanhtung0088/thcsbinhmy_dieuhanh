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

interface GeminiPart {
  text: string;
}

async function callGemini(apiKey: string, systemText: string, userText: string) {
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
        contents: [{ role: 'user', parts: [{ text: userText }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 400 },
      }),
    }
  );

  if (!resp.ok) {
    const detail = await resp.text();
    throw new Error(`Gemini API lỗi (${resp.status}): ${detail}`);
  }

  const data = await resp.json();
  const parts: GeminiPart[] = data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p) => p.text).join('').trim();
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

    // mode === 'chat' (mặc định): hỏi-đáp tự do về thủ tục
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
