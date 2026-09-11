// Xác thực "mã mở khoá" cho từng khu vực menu (Quản trị, Tài chính, Công tác
// Đảng...). Giống verify-admin.ts: mã thật chỉ nằm ở đây (server), web chỉ
// gửi lên hỏi đúng/sai, không bao giờ lộ mã ra trình duyệt.
export const config = { runtime: 'edge' };

// Mã mặc định — thầy NÊN ghi đè bằng biến môi trường ROLE_CODES trên Vercel
// (dạng JSON, vd {"tai_chinh":"kt-2027",...}) để dùng mã riêng, không dùng
// mã mặc định này lâu dài vì nó nằm sẵn trong mã nguồn.
const DEFAULT_CODES: Record<string, string> = {
  quan_tri: 'qt2026',
  cong_tac_dang: 'dang2026',
  chuyen_mon: 'cm2026',
  nhan_su: 'ns2026',
  hanh_chinh: 'hc2026',
  hoc_sinh: 'hs2026',
  cong_viec: 'cv2026',
  ai_agent: 'ai2026',
  kpi: 'kpi2026',
  co_so_vat_chat: 'csvc2026',
  tai_chinh: 'tc2026',
  van_ban: 'vb2026',
  lich_cong_tac: 'lich2026',
  kiem_tra: 'ktra2026',
  thi_dua: 'td2026',
  phan_tich: 'pt2026',
  bao_cao: 'bc2026',
  thong_bao: 'tb2026',
  cai_dat: 'cd2026',
};

function loadCodes(): Record<string, string> {
  const raw = process.env.ROLE_CODES;
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

  const { moduleKey, code } = body;
  const codes = loadCodes();
  const real = codes[moduleKey];

  if (!real || typeof code !== 'string' || code !== real) {
    await new Promise((r) => setTimeout(r, 400)); // hạn chế dò mã tự động
    return new Response(JSON.stringify({ ok: false }), { status: 401 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
