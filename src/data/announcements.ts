export interface PublicAnnouncement {
  id: string;
  title: string;
  content: string;
  date: string; // dd/mm/yyyy
  tag: 'Lịch học' | 'Tuyển sinh' | 'Học phí' | 'Chung';
}

// Thông báo dành cho TOÀN THỂ phụ huynh/học sinh xem công khai — khác với
// ALERTS (cảnh báo vận hành nội bộ chỉ cán bộ mới thấy).
export const PUBLIC_ANNOUNCEMENTS: PublicAnnouncement[] = [
  {
    id: 'tb1',
    title: 'Lịch khai giảng năm học 2026-2027',
    content: 'Trường tổ chức Lễ khai giảng năm học mới vào 07h00 ngày 07/09/2026 tại 3 điểm trường. Học sinh mặc đồng phục, có mặt trước 06h30.',
    date: '01/09/2026',
    tag: 'Lịch học',
  },
  {
    id: 'tb2',
    title: 'Thông báo thu học phí học kỳ I',
    content: 'Phụ huynh nộp học phí học kỳ I từ 05/09 đến 20/09/2026 tại văn phòng nhà trường hoặc qua Dịch vụ công. Xem chi tiết mức thu tại mục Dịch vụ công.',
    date: '03/09/2026',
    tag: 'Học phí',
  },
  {
    id: 'tb3',
    title: 'Tuyển sinh lớp 6 năm học 2027-2028',
    content: 'Trường sẽ thông báo kế hoạch tuyển sinh lớp 6 vào tháng 5/2027. Phụ huynh theo dõi mục Dịch vụ công để cập nhật hồ sơ cần chuẩn bị.',
    date: '01/09/2026',
    tag: 'Tuyển sinh',
  },
];
