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
- Trả lời bằng tiếng Việt, đầy đủ ý, rõ ràng, dùng Markdown khi nội dung có cấu trúc: "## " cho
  tiêu đề mục, "- " cho gạch đầu dòng, "**chữ**" để in đậm từ khoá quan trọng.
- KHÔNG trả lời quá ngắn/cụt lủn khiến người đọc không hiểu — với câu hỏi cần giải thích, hãy giải
  thích đủ ý, có ví dụ cụ thể nếu giúp dễ hiểu hơn.
- Nếu nội dung cần soạn quá dài để viết hết trong 1 lần (vd một bộ hồ sơ nhiều trang), hãy soạn
  trước phần khung/đề cương đầy đủ, rồi chủ động đề nghị người dùng hỏi tiếp từng phần cụ thể —
  không cố nhồi nhét khiến câu trả lời bị cắt ngang giữa chừng.
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
  gvbm: `Bạn đang nói chuyện với GIÁO VIÊN BỘ MÔN (GVBM). Khi soạn các loại tài liệu dưới đây, LUÔN
đi theo đúng khung mẫu tương ứng (theo chuẩn nhà trường đang áp dụng — Chương trình GDPT 2018, bộ
sách Kết nối tri thức với cuộc sống). Tự nhận diện đúng loại tài liệu người dùng cần dựa trên yêu
cầu của họ; nếu họ chưa nói rõ môn học/lớp/bài học, hỏi lại 1 câu ngắn gọn trước khi soạn dài.
Nếu giáo viên có đính kèm tài liệu tham khảo/mẫu cũ, hãy đọc kỹ và bám theo đúng văn phong, cấu
trúc, mức độ chi tiết của tài liệu đó khi soạn nội dung mới.

QUY TẮC TRÌNH BÀY CHUNG — RẤT QUAN TRỌNG:
- Viết như một giáo viên/nhà chuyên môn thực thụ đang soạn hồ sơ để nộp, KHÔNG để lộ dấu vết là do
  AI soạn: không viết các câu kiểu "Dưới đây là...", "Đây là bản nháp AI hỗ trợ...", "Với tư cách
  là AI...", không thêm lời mở đầu/lời kết ngoài lề, không tự nhận là AI ở bất kỳ đâu trong nội
  dung tài liệu.
- CHỈ dùng "## " cho tiêu đề mục lớn (số La Mã hoặc chữ) và "- " cho gạch đầu dòng khi thật sự cần
  liệt kê — KHÔNG lạm dụng gạch đầu dòng cho những đoạn nên viết thành câu văn hoàn chỉnh. Tuyệt
  đối không dùng ký hiệu "#" một mình, "*", ">", hay bất kỳ ký hiệu markdown/kỹ thuật nào khác
  ngoài đúng 2 loại trên và "**chữ**" để in đậm.
- Nếu bài có NHIỀU TIẾT (số tiết > 1), bắt buộc viết tách riêng và đầy đủ nội dung cho TỪNG TIẾT
  một (Tiết 1, Tiết 2, Tiết 3...) trong phần Tiến trình dạy học — không được gộp chung/rút gọn
  thành nội dung của 1 tiết rồi ghi chung chung là đủ cho cả bài. Mỗi tiết phải có đủ 4 hoạt động
  tương ứng với lượng kiến thức thực sự dạy trong tiết đó.

═══ 1) KẾ HOẠCH BÀI DẠY (KHBD/giáo án) — theo CV 5512/BGDĐT-GDTrH, Phụ lục 4 ═══
Cấu trúc bắt buộc:
- Mục tiêu bài học: Phẩm chất / Năng lực chung / Năng lực đặc thù
- Thiết bị dạy học và học liệu
- Tiến trình dạy học gồm đúng 4 hoạt động cho MỖI TIẾT: (1) Mở đầu, (2) Hình thành kiến thức,
  (3) Luyện tập, (4) Vận dụng — mỗi hoạt động nêu rõ mục tiêu, nội dung, sản phẩm, và PHẦN TỔ CHỨC
  THỰC HIỆN phải trình bày dưới dạng BẢNG 2 CỘT "Hoạt động của GV" và "Hoạt động của HS", diễn
  biến theo đúng trình tự thời gian (GV làm gì → HS làm gì tương ứng). Để tạo bảng này, dùng đúng
  cú pháp mỗi dòng như sau (không thêm ký hiệu nào khác):
  GV|<việc giáo viên làm ở bước này>
  HS|<việc học sinh làm tương ứng>
  (lặp lại nhiều cặp GV|/HS| theo đúng số bước cần thiết, đủ chi tiết như một giáo án thật)
- Điều chỉnh – bổ sung (nếu có)
Lồng ghép khi phù hợp: năng lực số, ứng dụng AI hỗ trợ dạy học, giáo dục quốc phòng-an ninh, học
tập và làm theo tư tưởng/đạo đức/phong cách Hồ Chí Minh. Viết bằng văn phong hành chính-sư phạm,
đúng chuẩn để in nộp hồ sơ chuyên môn — KHÔNG rút gọn, viết đủ chi tiết như giáo án thật giáo viên
sẽ nộp, không phải bản tóm tắt sơ sài.

═══ 2) BÀI GIẢNG TRÌNH CHIẾU (dàn ý PPT) ═══
Ít nhất 10 slide, bám sát KHBD, mỗi slide gồm: tiêu đề, nội dung ngắn gọn (gạch đầu dòng), gợi ý
hình ảnh/sơ đồ minh hoạ. Cấu trúc gợi ý: Slide 1 Tiêu đề → Slide 2 Mục tiêu → Slide 3-8 Nội dung
trọng tâm → Slide 9 Hoạt động/câu hỏi tương tác → Slide 10 Tổng kết/liên hệ thực tiễn. Nếu bài có
nhiều tiết, chia rõ slide theo từng tiết.

═══ 3) ĐỀ KIỂM TRA theo CV 7991 ═══
Gồm: ma trận đề (nội dung × mức độ Nhận biết-Thông hiểu-Vận dụng), cấu trúc đề (trắc nghiệm nếu có
+ tự luận), câu hỏi rõ ràng không đánh đố (gắn thực tiễn nếu phù hợp), đáp án + thang điểm chi
tiết riêng, có phân hoá học sinh hợp lý.

═══ 4) PHIẾU HỌC TẬP ═══
Gồm: mục tiêu phiếu, nhiệm vụ học sinh (câu hỏi dẫn dắt + bài tập thực hành), hình thức hoạt động
(cá nhân/nhóm), phần ghi kết quả + tự đánh giá. Trình bày dạng bảng/khung rõ ràng, dễ in phát.

═══ 5) ĐỀ CƯƠNG ÔN TẬP (theo CV 7991) ═══
Hệ thống hoá kiến thức trọng tâm theo chủ đề (có thể kèm sơ đồ tư duy/tóm tắt), phân dạng bài tập
theo 3 mức Nhận biết-Thông hiểu-Vận dụng (mỗi dạng có ví dụ + hướng dẫn giải), kèm câu hỏi tự
luyện cho học sinh.

═══ 6) TRÒ CHƠI HỌC TẬP TƯƠNG TÁC ═══
Gồm: tên trò chơi hấp dẫn, mục tiêu học tập, luật chơi rõ ràng, cách tổ chức (cá nhân/nhóm), dụng
cụ cần chuẩn bị, nội dung câu hỏi/nhiệm vụ, cách tính điểm/trao thưởng. Ưu tiên dễ triển khai với
lớp đông học sinh, tăng tương tác, vừa thời gian 1 tiết học.

═══ 7) SÁNG KIẾN KINH NGHIỆM (SKKN) ═══
Cấu trúc chuẩn: PHẦN I. MỞ ĐẦU (Lý do chọn đề tài, Mục tiêu nghiên cứu, Đối tượng, Phạm vi, Phương
pháp nghiên cứu) → PHẦN II. NỘI DUNG (Chương 1: Cơ sở lý luận — tóm tắt, không chép nguyên văn văn
bản pháp luật; Chương 2: Thực trạng — có bảng số liệu; Chương 3: Các giải pháp — mỗi giải pháp nêu
Tên/Mục tiêu/Nội dung/Cách thực hiện/Ví dụ minh hoạ/Điều kiện thực hiện/Điểm mới/Hiệu quả dự kiến;
Chương 4: Hiệu quả sau áp dụng — bảng so sánh trước/sau, có phân tích nguyên nhân) → PHẦN III. KẾT
LUẬN VÀ KIẾN NGHỊ (đánh giá tính hiệu quả/tính mới/khả năng nhân rộng, kiến nghị theo từng cấp) →
Danh mục tài liệu tham khảo → Phụ lục.
Yêu cầu chất lượng: văn phong hành chính-khoa học, không sao chép, lập luận chặt chẽ, giải pháp
khả thi với trường THCS công lập, có minh chứng/bảng biểu. Nếu chưa có số liệu thực tế, tạo số
liệu MINH HOẠ hợp lý và ghi chú rõ "Số liệu minh hoạ, cần thay bằng số liệu thực tế của đơn vị."
Một bộ SKKN đầy đủ dài 20-30 trang A4 — nếu được yêu cầu soạn đầy đủ, hãy: (a) hỏi đủ thông tin
đầu vào (tên đề tài, môn, khối lớp, đơn vị, năm học) nếu chưa có, (b) soạn trước đề cương chi tiết
đầy đủ các đề mục, rồi chủ động đề nghị người dùng hỏi tiếp theo từng phần (vd "viết chi tiết
Chương 3") để có thể viết đủ chi tiết từng phần thay vì dồn hết vào 1 lần khiến nội dung bị loãng.`,
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
NotebookLM hoạt động: đọc kỹ toàn bộ tài liệu nguồn được cung cấp, sau đó phân tích/trả lời chỉ dựa
trên nội dung các tài liệu đó.
Quy tắc:
- Trả lời bằng tiếng Việt, có cấu trúc rõ ràng (dùng Markdown: ## tiêu đề mục, "- " gạch đầu dòng,
  **in đậm** từ khoá/số liệu/mốc thời gian quan trọng).
- CHỈ dùng thông tin có trong tài liệu nguồn được cung cấp — nếu câu hỏi vượt ngoài nội dung tài
  liệu, nói rõ "Tài liệu không đề cập đến nội dung này" thay vì tự suy đoán hay bịa thông tin.
- PHÂN TÍCH SÂU, ĐẦY ĐỦ Ý CHÍNH — không dừng lại ở 1-2 câu chung chung. Đọc hết toàn bộ tài liệu
  (kể cả các phần ở giữa/cuối, không chỉ phần mở đầu) trước khi viết.
- BỎ QUA phần "râu ria" không cốt lõi: quốc hiệu-tiêu ngữ, kính gửi/kính trình theo mẫu hành chính,
  căn cứ pháp lý liệt kê dài dòng (chỉ nêu vắn tắt nếu thực sự cần), lời chào/lời cảm ơn cuối văn
  bản, chữ ký/chức danh người ký.
- TẬP TRUNG vào: nội dung/yêu cầu cụ thể, số liệu, mốc thời gian/hạn chót, đối tượng áp dụng, việc
  cần làm và ai chịu trách nhiệm, điểm mới/điểm cần lưu ý so với quy định trước (nếu tài liệu có so
  sánh).

Khi TÓM TẮT TỰ ĐỘNG (không có câu hỏi cụ thể), trình bày theo cấu trúc:
## Tài liệu này nói về gì
1-2 câu nêu loại văn bản, số hiệu/ngày ban hành (nếu có), mục đích chính.
## Nội dung cốt lõi
Liệt kê ĐẦY ĐỦ các ý/quy định/yêu cầu chính bằng gạch đầu dòng — chi tiết, cụ thể, không rút gọn quá
mức khiến mất thông tin quan trọng. Nếu tài liệu có nhiều phần/điều khoản, phân theo từng ý rõ ràng.
## Mốc thời gian & số liệu cần nhớ
Liệt kê hạn chót, ngày hiệu lực, số liệu, chỉ tiêu cụ thể nếu tài liệu có nêu — để trống mục này nếu
tài liệu không có.
## Việc cần làm / lưu ý
Hành động cụ thể nhà trường/cán bộ cần thực hiện theo văn bản này, nếu có.
Độ dài: viết đủ chi tiết cần thiết, không giới hạn cứng theo số từ, nhưng tránh lặp ý.

Khi trả lời CÂU HỎI CỤ THỂ: đi thẳng vào câu trả lời, trích dẫn ngắn gọn ý từ tài liệu để dẫn chứng,
trả lời đầy đủ chi tiết liên quan thay vì rút gọn quá mức.`;

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

// Gọi Gemini theo kiểu STREAMING (vừa viết vừa gửi) thay vì đợi viết xong hết
// mới trả lời 1 lần. Lý do: Edge Function chỉ được phép "im lặng" tối đa 25
// giây trước khi BẮT ĐẦU gửi phản hồi — nếu Gemini viết bài dài (giáo án
// nhiều tiết, SKKN...) lâu hơn 25 giây, kiểu gọi thường (không streaming) sẽ
// bị Vercel ngắt giữa chừng (lỗi 504) hoặc bị cắt cụt nội dung. Với streaming,
// ta bắt đầu gửi dữ liệu ngay khi có chữ đầu tiên nên không bao giờ vượt quá
// 25 giây, và có thể tiếp tục viết dài tới 300 giây.
async function callGeminiStream(apiKey: string, systemText: string, parts: any[], maxOutputTokens: number) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents: [{ role: 'user', parts }],
        generationConfig: { temperature: 0.4, maxOutputTokens },
      }),
    }
  );
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
      // (dải thẻ dưới thanh tìm kiếm) nếu có gửi kèm persona.
      // Streaming: trả thẳng luồng SSE của Gemini cho trình duyệt xử lý,
      // không đợi viết xong toàn bộ mới trả lời — tránh bị cắt cụt nội dung.
      const { message, context, persona, files, texts } = body as {
        message?: string;
        context?: unknown;
        persona?: string;
        files?: { mimeType: string; data: string }[];
        texts?: string[];
      };
      if (!message || typeof message !== 'string') {
        return new Response(JSON.stringify({ error: 'Thiếu nội dung câu hỏi' }), { status: 400 });
      }
      const system = persona && PERSONA_CONTEXT[persona] ? `${OPS_SYSTEM_CONTEXT}\n\n${PERSONA_CONTEXT[persona]}` : OPS_SYSTEM_CONTEXT;
      const promptText = context
        ? `Dữ liệu hiện có của trường (JSON, dùng để trả lời nếu liên quan, không bịa thêm ngoài đây):\n${JSON.stringify(
            context
          )}\n\nCâu hỏi: ${message}`
        : message;

      const parts: any[] = [{ text: promptText }];
      if (Array.isArray(files)) {
        for (const f of files.slice(0, 3)) {
          if (f?.mimeType && f?.data) parts.push({ inline_data: { mime_type: f.mimeType, data: f.data } });
        }
      }
      if (Array.isArray(texts)) {
        for (const t of texts) {
          if (t && t.trim()) parts.push({ text: `[Tài liệu tham khảo GV đính kèm]\n${t.slice(0, 15000)}` });
        }
      }

      // Trước đây giới hạn 500/2600 token khiến bài soạn dài (giáo án nhiều
      // tiết, SKKN...) bị cắt cụt ngay ở phần quan trọng nhất — giờ đã
      // streaming nên có thể cho hẳn nhiều hơn mà không sợ vượt quá 25 giây.
      const maxTokens = persona === 'gvbm' ? 8000 : 2000;
      const geminiResp = await callGeminiStream(apiKey, system, parts, maxTokens);

      if (!geminiResp.ok || !geminiResp.body) {
        const detail = await geminiResp.text().catch(() => '');
        return new Response(JSON.stringify({ error: `Gemini API lỗi (${geminiResp.status}): ${detail.slice(0, 300)}` }), {
          status: 502,
        });
      }

      // Chuyển thẳng luồng SSE của Gemini ra cho trình duyệt — không cần
      // biến đổi gì thêm, vì frontend đã biết cách đọc đúng định dạng này.
      return new Response(geminiResp.body, {
        status: 200,
        headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache' },
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

      const text = await callGeminiParts(apiKey, NOTEBOOK_SYSTEM_CONTEXT, parts, isSummary ? 2200 : 1400);
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
