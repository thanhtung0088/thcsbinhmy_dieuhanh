import { ExternalLink } from 'lucide-react';

interface ResourceLink {
  title: string;
  url: string;
  desc: string;
  group: 'phap-luat' | 'ai' | 'cong-cu';
}

// Chỉ các trang chính thống/nền tảng phổ biến có thể xác minh — không
// đưa các trang chưa xác minh được nguồn.
const LINKS: ResourceLink[] = [
  { group: 'phap-luat', title: 'Bộ Giáo dục và Đào tạo', url: 'https://moet.gov.vn', desc: 'Cổng thông tin điện tử chính thức của Bộ GD&ĐT.' },
  { group: 'phap-luat', title: 'Sở Giáo dục và Đào tạo TP.HCM', url: 'https://hcm.edu.vn', desc: 'Cổng thông tin ngành GD&ĐT Thành phố Hồ Chí Minh.' },
  { group: 'phap-luat', title: 'Cổng Dịch vụ công Bộ GD&ĐT', url: 'https://dichvucong.moet.gov.vn', desc: 'Dịch vụ công trực tuyến của Bộ Giáo dục và Đào tạo.' },
  { group: 'phap-luat', title: 'Cổng thông tin điện tử Chính phủ', url: 'https://chinhphu.vn', desc: 'Tin tức, văn bản chỉ đạo điều hành của Chính phủ.' },
  { group: 'phap-luat', title: 'Công báo Chính phủ', url: 'https://congbao.chinhphu.vn', desc: 'Văn bản quy phạm pháp luật đã đăng Công báo.' },
  { group: 'phap-luat', title: 'Cơ sở dữ liệu quốc gia về văn bản pháp luật', url: 'https://vbpl.vn', desc: 'Tra cứu văn bản quy phạm pháp luật toàn quốc.' },
  { group: 'phap-luat', title: 'Thư viện Pháp luật', url: 'https://thuvienphapluat.vn', desc: 'Tra cứu, tóm tắt văn bản pháp luật (giáo dục, lao động...).' },
  { group: 'phap-luat', title: 'LuatVietnam', url: 'https://luatvietnam.vn', desc: 'Cập nhật văn bản pháp luật mới, có mục Giáo dục riêng.' },
  { group: 'phap-luat', title: 'Cổng thông tin điện tử Quốc hội', url: 'https://quochoi.vn', desc: 'Luật, Nghị quyết do Quốc hội ban hành.' },
  { group: 'phap-luat', title: 'Bộ Tư pháp', url: 'https://moj.gov.vn', desc: 'Văn bản pháp luật, phổ biến giáo dục pháp luật.' },
  { group: 'phap-luat', title: 'Báo Giáo dục & Thời đại', url: 'https://giaoducthoidai.vn', desc: 'Báo chính thức của Bộ GD&ĐT.' },
  { group: 'phap-luat', title: 'Tạp chí điện tử Giáo dục Việt Nam', url: 'https://giaoduc.net.vn', desc: 'Tin tức, phân tích chính sách giáo dục.' },
  { group: 'phap-luat', title: 'Cổng thông tin điện tử UBND TP.HCM', url: 'https://hochiminhcity.gov.vn', desc: 'Văn bản, chỉ đạo điều hành của UBND Thành phố.' },
  { group: 'phap-luat', title: 'Tổng cục Thống kê', url: 'https://gso.gov.vn', desc: 'Số liệu thống kê giáo dục và dân số toàn quốc.' },
  // 10 nền tảng AI miễn phí / giáo dục phổ biến, bổ sung theo yêu cầu
  { group: 'ai', title: 'ChatGPT (OpenAI)', url: 'https://chatgpt.com', desc: 'Trợ lý AI tổng hợp — soạn giáo án, tài liệu, hỏi đáp.' },
  { group: 'ai', title: 'Claude (Anthropic)', url: 'https://claude.ai', desc: 'Trợ lý AI — phân tích văn bản dài, soạn thảo, lập kế hoạch.' },
  { group: 'ai', title: 'Google Gemini', url: 'https://gemini.google.com', desc: 'Trợ lý AI của Google, tích hợp Docs/Sheets/Slides.' },
  { group: 'ai', title: 'Microsoft Copilot', url: 'https://copilot.microsoft.com', desc: 'Trợ lý AI miễn phí tích hợp Word/Excel/PowerPoint.' },
  { group: 'ai', title: 'Perplexity AI', url: 'https://perplexity.ai', desc: 'Công cụ tìm kiếm - trả lời có trích dẫn nguồn.' },
  { group: 'ai', title: 'NotebookLM (Google)', url: 'https://notebooklm.google.com', desc: 'AI tóm tắt/hỏi đáp trên chính tài liệu do giáo viên tải lên.' },
  { group: 'ai', title: 'Canva Giáo dục', url: 'https://www.canva.com/vi_vn/giao-duc/', desc: 'Thiết kế slide, poster, học liệu trực quan (có AI hỗ trợ).' },
  { group: 'ai', title: 'Quizizz', url: 'https://quizizz.com', desc: 'Tạo trò chơi/bài kiểm tra tương tác cho học sinh.' },
  { group: 'ai', title: 'Padlet', url: 'https://padlet.com', desc: 'Bảng ghim tương tác cho hoạt động nhóm, thảo luận lớp.' },
  { group: 'ai', title: 'CapCut', url: 'https://www.capcut.com', desc: 'Dựng video bài giảng, clip tuyên truyền miễn phí.' },
  // Công cụ dạy học & quản lý lớp phổ biến tại Việt Nam
  { group: 'cong-cu', title: 'Violet.vn', url: 'https://violet.vn', desc: 'Thư viện giáo án, bài giảng điện tử, tư liệu dạy học.' },
  { group: 'cong-cu', title: 'OLM.vn', url: 'https://olm.vn', desc: 'Ôn luyện, bài giảng trực tuyến theo chương trình phổ thông.' },
  { group: 'cong-cu', title: 'Azota', url: 'https://azota.vn', desc: 'Tạo đề kiểm tra, giao bài, chấm điểm trực tuyến.' },
  { group: 'cong-cu', title: 'Hocmai.vn', url: 'https://hocmai.vn', desc: 'Học liệu, bài giảng ôn tập trực tuyến các cấp học.' },
  { group: 'cong-cu', title: 'Kahoot!', url: 'https://kahoot.com', desc: 'Trò chơi câu hỏi tương tác, tăng hứng thú tiết học.' },
  { group: 'cong-cu', title: 'Wordwall', url: 'https://wordwall.net', desc: 'Tạo trò chơi, phiếu học tập tương tác nhanh.' },
  { group: 'cong-cu', title: 'Google Forms', url: 'https://forms.google.com', desc: 'Tạo phiếu khảo sát, bài kiểm tra trắc nghiệm miễn phí.' },
  { group: 'cong-cu', title: 'Google Workspace for Education', url: 'https://edu.google.com/intl/vi/workspace-for-education/', desc: 'Bộ công cụ Google dành riêng cho trường học.' },
  { group: 'cong-cu', title: 'iLovePDF', url: 'https://www.ilovepdf.com/vi', desc: 'Gộp, tách, chuyển đổi, nén file PDF miễn phí.' },
  { group: 'cong-cu', title: 'Zalo', url: 'https://zalo.me', desc: 'Liên lạc phụ huynh - học sinh, nhóm lớp, thông báo nhanh.' },
];

const GROUP_LABEL: Record<ResourceLink['group'], string> = {
  'phap-luat': 'Pháp luật & giáo dục',
  ai: 'Nền tảng AI miễn phí',
  'cong-cu': 'Công cụ dạy học & quản lý',
};

export function DigitalLibrary() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-wide text-blue-600">KHO TÀI NGUYÊN VÀ TIỆN ÍCH</p>
        <h2 className="text-xl font-bold text-ink mt-0.5">{LINKS.length} nguồn tra cứu &amp; công cụ hỗ trợ</h2>
        <p className="text-xs text-ink/50 mt-1">
          Gồm các cổng thông tin chính thống về pháp luật/giáo dục và các nền tảng AI miễn phí phổ biến.
        </p>
      </div>

      {(['phap-luat', 'ai', 'cong-cu'] as const).map((group) => (
        <div key={group}>
          <p className="text-sm font-semibold text-ink/70 mb-2">{GROUP_LABEL[group]}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {LINKS.filter((l) => l.group === group).map((l) => (
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
      ))}
    </div>
  );
}
