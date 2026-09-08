import { useState } from 'react';
import { Landmark } from 'lucide-react';
import { DICH_VU_CONG_TABS } from '../data/dichVuCong';
import { ServiceRequestModal } from '../components/shared/ServiceRequestModal';

export function DichVuCong() {
  const [tab, setTab] = useState(DICH_VU_CONG_TABS[0].id);
  const [openService, setOpenService] = useState<string | null>(null);
  const active = DICH_VU_CONG_TABS.find((t) => t.id === tab)!;

  return (
    <div className="space-y-4">
      <div className="rounded-xl overflow-hidden border border-black/10">
        <div className="bg-blue-600 text-white px-5 py-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/15 grid place-items-center shrink-0">
            <Landmark size={20} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-100">DỊCH VỤ CÔNG TRỰC TUYẾN</p>
            <h2 className="text-lg font-bold leading-tight">Trường THCS Bình Mỹ</h2>
          </div>
        </div>
        <div className="flex bg-white border-b border-black/10">
          {DICH_VU_CONG_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold uppercase tracking-wide border-b-2 ${
                tab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-ink/40 hover:text-ink'
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
        <div className="bg-paper p-4 grid sm:grid-cols-2 gap-3">
          {active.items.map((item) => (
            <button
              key={item.label}
              onClick={() => setOpenService(item.label)}
              className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 text-left hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 grid place-items-center shrink-0">
                <item.icon size={16} />
              </div>
              <span className="text-sm font-medium text-ink">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-ink/40">
        Danh mục thủ tục mang tính tổng hợp theo các quy định phổ biến hiện hành ở cấp THCS.
      </p>

      {openService && (
        <ServiceRequestModal
          groupLabel={active.label}
          serviceLabel={openService}
          onClose={() => setOpenService(null)}
        />
      )}
    </div>
  );
}
