// Xác thực "mã nhóm" khi đăng nhập — mỗi nhóm (BGH/Nhân viên/Tổ trưởng
// CM/Giáo viên) dùng CHUNG 1 mã. Mã thật chỉ nằm ở đây (server).
export const config = { runtime: 'edge' };

// Mã mặc định — thầy NÊN ghi đè bằng biến môi trường GROUP_CODES trên
// Vercel (dạng JSON) để dùng mã riêng, không dùng mã mặc định lâu dài.
const DEFAULT_CODES: Record<string, string> = {
  bgh: 'qt2026', // Hiệu trưởng, Phó Hiệu trưởng, CNTT, Tổ trưởng Văn phòng — toàn quyền
  nhan_vien: 'nv2026', // Kế toán, Văn thư, Giám thị/Bảo vệ, Học vụ, Y tế, Thư viện...
  to_truong_cm: 'cm2026', // Tổ trưởng chuyên môn
  giao_vien: 'gv2026', // GVBM, GVCN
};

function loadCodes(): Record<string, string> {
  const raw = process.env.GROUP_CODES;
  if (!raw) return DEFAULT_CODES;
  try {
    return { ...DEFAULT_CODES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CODES;
  }
}

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

  const { group, code } = body;
  const codes = loadCodes();
  const real = codes[group];

  if (!real || typeof code !== 'string' || code !== real) {
    await new Promise((r) => setTimeout(r, 400));
    return new Response(JSON.stringify({ ok: false }), { status: 401 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
