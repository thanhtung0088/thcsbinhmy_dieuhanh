import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { LEADERSHIP } from '../../data/mockData';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/10 bg-hoa-950 text-white/80 text-xs">
      <div className="px-6 py-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm font-bold text-white">THCS Bình Mỹ</p>
          <p className="mt-1 text-white/50">01 nhà trường · 03 điểm trường · 01 hệ thống dữ liệu</p>
          <ul className="mt-2 space-y-0.5 text-white/60">
            {LEADERSHIP.map((l) => (
              <li key={l.id}>
                {l.title.replace('Phó Hiệu trưởng phụ trách ', 'PHT ')}: {l.name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Liên kết nhanh</p>
          <ul className="mt-2 space-y-1 text-white/60">
            <li><Link to="/" className="hover:text-white">Trung tâm điều hành</Link></li>
            <li><Link to="/diem-truong" className="hover:text-white">3 điểm trường</Link></li>
            <li><Link to="/gioi-thieu" className="hover:text-white">Giới thiệu</Link></li>
            <li><Link to="/kho-tai-nguyen" className="hover:text-white">Kho tài nguyên và tiện ích</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Thông tin liên hệ</p>
          <ul className="mt-2 space-y-1.5 text-white/60">
            <li className="flex items-center gap-1.5">
              <Phone size={12} className="shrink-0" />
              <span>Đường dây nóng: (cập nhật số điện thoại văn phòng)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Mail size={12} className="shrink-0" />
              <span>vanphong@thcsbinhmy.edu.vn</span>
            </li>
            <li className="flex items-start gap-1.5">
              <MapPin size={12} className="shrink-0 mt-0.5" />
              <span>Điểm chính — (cập nhật địa chỉ trường)</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Bản quyền</p>
          <p className="mt-2 text-white/50">© {year} Trường THCS Bình Mỹ</p>
          <p className="mt-1 text-white/50">Thiết kế &amp; lập trình: Nguyễn Thanh Tùng</p>
        </div>
      </div>
    </footer>
  );
}
