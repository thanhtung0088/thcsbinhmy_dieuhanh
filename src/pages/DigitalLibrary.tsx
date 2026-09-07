import { ExternalLink } from 'lucide-react';

interface ResourceLink {
  title: string;
  url: string;
  desc: string;
}

// Chỉ các trang chính thống, có thể xác minh: cơ quan nhà nước, cổng
// văn bản pháp luật chính thức, hoặc báo/tạp chí ngành giáo dục lâu
// năm — không đưa các trang chưa xác minh được nguồn.
const LINKS: ResourceLink[] = [
  { title: 'Bộ Giáo dục và Đào tạo', url: 'https://moet.gov.vn', desc: 'Cổng thông tin điện tử chính thức của Bộ GD&ĐT.' },
  { title: 'Sở Giáo dục và Đào tạo TP.HCM', url: 'https://hcm.edu.vn', desc: 'Cổng thông tin ngành GD&ĐT Thành phố Hồ Chí Minh.' },
  { title: 'Cổng Dịch vụ công Bộ GD&ĐT', url: 'https://dichvucong.moet.gov.vn', desc: 'Dịch vụ công trực tuyến của Bộ Giáo dục và Đào tạo.' },
  { title: 'Cổng thông tin điện tử Chính phủ', url: 'https://chinhphu.vn', desc: 'Tin tức, văn bản chỉ đạo điều hành của Chính phủ.' },
  { title: 'Công báo Chính phủ', url: 'https://congbao.chinhphu.vn', desc: 'Văn bản quy phạm pháp luật đã đăng Công báo.' },
  { title: 'Cơ sở dữ liệu quốc gia về văn bản pháp luật', url: 'https://vbpl.vn', desc: 'Tra cứu văn bản quy phạm pháp luật toàn quốc.' },
  { title: 'Thư viện Pháp luật', url: 'https://thuvienphapluat.vn', desc: 'Tra cứu, tóm tắt văn bản pháp luật (giáo dục, lao động...).' },
  { title: 'LuatVietnam', url: 'https://luatvietnam.vn', desc: 'Cập nhật văn bản pháp luật mới, có mục Giáo dục riêng.' },
  { title: 'Cổng thông tin điện tử Quốc hội', url: 'https://quochoi.vn', desc: 'Luật, Nghị quyết do Quốc hội ban hành.' },
  { title: 'Bộ Tư pháp', url: 'https://moj.gov.vn', desc: 'Văn bản pháp luật, phổ biến giáo dục pháp luật.' },
  { title: 'Báo Giáo dục & Thời đại', url: 'https://giaoducthoidai.vn', desc: 'Báo chính thức của Bộ GD&ĐT.' },
  { title: 'Tạp chí điện tử Giáo dục Việt Nam', url: 'https://giaoduc.net.vn', desc: 'Tin tức, phân tích chính sách giáo dục.' },
  { title: 'Cổng thông tin điện tử UBND TP.HCM', url: 'https://hochiminhcity.gov.vn', desc: 'Văn bản, chỉ đạo điều hành của UBND Thành phố.' },
  { title: 'Tổng cục Thống kê', url: 'https://gso.gov.vn', desc: 'Số liệu thống kê giáo dục và dân số toàn quốc.' },
];

export function DigitalLibrary() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600">KHO HỌC LIỆU SỐ</p>
        <h2 className="text-xl font-bold text-ink mt-0.5">14 nguồn tra cứu pháp luật &amp; giáo dục uy tín</h2>
        <p className="text-xs text-ink/50 mt-1">
          Chỉ liệt kê các cổng thông tin chính thống của cơ quan nhà nước và báo/tạp chí ngành giáo dục.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {LINKS.map((l) => (
          <a
            key={l.url}
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="group rounded-xl border border-black/10 bg-white p-4 hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-ink group-hover:text-blue-700">{l.title}</p>
              <ExternalLink size={14} className="text-ink/30 group-hover:text-blue-600 shrink-0 mt-0.5" />
            </div>
            <p className="text-xs text-ink/50 mt-1.5 leading-snug">{l.desc}</p>
            <p className="text-[11px] text-blue-600/70 mt-2 truncate">{l.url}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
