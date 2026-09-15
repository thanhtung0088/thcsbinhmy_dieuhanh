// Gọi /api/gemini một cách an toàn: nếu máy chủ trả lỗi dạng HTML/text (vd
// timeout 504 của Vercel) thay vì JSON, hàm này KHÔNG để lỗi "Unexpected
// token..." khó hiểu văng ra — mà tự chuyển thành thông báo dễ hiểu.
export async function callGeminiApi<T = any>(body: Record<string, unknown>): Promise<T> {
  let resp: Response;
  try {
    resp = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Không kết nối được tới máy chủ. Kiểm tra mạng rồi thử lại.');
  }

  const raw = await resp.text();
  let data: any = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    // Máy chủ trả về thứ không phải JSON — thường là trang lỗi của Vercel
    // khi request chạy quá lâu (timeout) hoặc quá tải.
    if (resp.status === 504 || resp.status === 502 || resp.status === 503) {
      throw new Error('AI xử lý quá lâu nên máy chủ đã ngắt (hết giờ chờ). Thử lại với tài liệu ngắn hơn, hoặc thử lại sau ít phút.');
    }
    throw new Error(`Máy chủ phản hồi không đọc được (mã lỗi ${resp.status}). Thử lại sau.`);
  }

  if (!resp.ok) {
    const base = data?.error || `Có lỗi xảy ra (mã lỗi ${resp.status}).`;
    // Trước đây chỉ hiện thông báo chung chung, giấu mất lý do thật (429 hết
    // lượt, 503 Google quá tải, 403 bị chặn...) khiến rất khó chẩn đoán lần
    // sau bị lỗi gì — giờ hiện kèm luôn phần chi tiết gốc (rút gọn) để biết
    // chính xác cần làm gì tiếp theo.
    const detail = typeof data?.detail === 'string' ? data.detail.slice(0, 200) : '';
    throw new Error(detail ? `${base}\n\nChi tiết: ${detail}` : base);
  }

  return data as T;
}
