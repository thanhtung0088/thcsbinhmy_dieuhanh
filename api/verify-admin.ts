// Xác thực mã truy cập Admin — CHỈ chạy trên máy chủ Vercel, không bao giờ
// gửi mã thật xuống trình duyệt. Web chỉ gửi mã người dùng nhập lên đây,
// hàm này trả lời đúng/sai.
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Chỉ chấp nhận POST' }), { status: 405 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Body không hợp lệ' }), { status: 400 });
  }

  const { code } = body;

  // Mã thật lấy từ biến môi trường ADMIN_CODE trên Vercel (Settings →
  // Environment Variables). Nếu thầy chưa khai báo biến này, hệ thống tạm
  // dùng "tt88" làm mặc định — NÊN đổi sang biến môi trường riêng của
  // trường càng sớm càng tốt, vì "tt88" đã từng xuất hiện trong lịch sử
  // chat nên không còn là bí mật an toàn tuyệt đối nữa.
  const realCode = process.env.ADMIN_CODE || 'tt88';

  if (typeof code !== 'string' || code !== realCode) {
    // Cố tình trả lời chậm 500ms để hạn chế dò mã tự động (brute-force)
    await new Promise((r) => setTimeout(r, 500));
    return new Response(JSON.stringify({ ok: false }), { status: 401 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
