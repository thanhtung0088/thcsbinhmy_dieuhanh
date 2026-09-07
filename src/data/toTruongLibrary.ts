export interface ToTruongSection {
  id: string;
  label: string;
  categories: string[];
}

// 6 nhóm nghiệp vụ + danh mục loại hồ sơ theo từng nhóm. Đây là các
// LOẠI hồ sơ (taxonomy) mà tổ chuyên môn thường phải có, không phải
// dữ liệu về hồ sơ cụ thể đã tồn tại — mỗi mục bắt đầu ở trạng thái
// trống, chỉ có nội dung khi tổ trưởng thực sự nộp qua nút bên dưới.
export const TO_TRUONG_SECTIONS: ToTruongSection[] = [
  {
    id: 'kehoach',
    label: 'Kế hoạch & Báo cáo',
    categories: [
      'Kế hoạch giáo dục tổ chuyên môn (năm học)',
      'Kế hoạch hoạt động chuyên môn tháng/tuần',
      'Báo cáo sơ kết học kỳ I của tổ',
      'Báo cáo tổng kết năm học của tổ',
      'Biên bản họp tổ chuyên môn định kỳ',
    ],
  },
  {
    id: 'dayhoc',
    label: 'Quản lý dạy học',
    categories: [
      'Báo cáo thực hiện chương trình (tiến độ)',
      'Báo cáo chất lượng bộ môn theo khối/lớp',
      'Báo cáo phân công giảng dạy và dạy thay',
      'Kế hoạch dạy học các môn (phân phối chương trình)',
    ],
  },
  {
    id: 'thaogiang',
    label: 'Chuyên đề & Thao giảng',
    categories: [
      'Kế hoạch thao giảng, dự giờ cấp tổ',
      'Báo cáo kết quả thực hiện chuyên đề dạy học',
      'Tổng hợp nhận xét, đánh giá tiết dạy',
    ],
  },
  {
    id: 'boiduong',
    label: 'Bồi dưỡng & Kiểm tra',
    categories: [
      'Kế hoạch bồi dưỡng thường xuyên giáo viên',
      'Báo cáo kiểm tra hồ sơ sổ sách giáo viên',
      'Báo cáo đánh giá chuẩn nghề nghiệp giáo viên (cấp tổ)',
    ],
  },
  {
    id: 'hocsinh',
    label: 'Hoạt động học sinh',
    categories: [
      'Kế hoạch bồi dưỡng học sinh giỏi cấp tổ',
      'Báo cáo kết quả phụ đạo học sinh yếu, kém',
      'Kế hoạch hỗ trợ học sinh có nguy cơ bỏ học',
    ],
  },
  {
    id: 'digital',
    label: 'CĐS & Hồ sơ số',
    categories: [
      'Báo cáo triển khai hồ sơ sổ sách điện tử của tổ',
      'Báo cáo xây dựng kho học liệu số của tổ',
    ],
  },
];
