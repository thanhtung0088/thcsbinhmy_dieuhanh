import { Construction } from 'lucide-react';

export function ComingSoon({ moduleName, phase }: { moduleName: string; phase: string }) {
  return (
    <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="h-12 w-12 rounded-full bg-hoa-950/5 grid place-items-center mb-4">
        <Construction size={22} className="text-hoa-700" />
      </div>
      <h2 className="text-lg font-semibold text-ink">{moduleName}</h2>
      <p className="text-sm text-ink/50 mt-1 max-w-sm">
        Module này được triển khai ở <span className="font-medium text-ink/70">{phase}</span> theo lộ trình phát
        triển. Điều hướng và phân quyền cho module đã sẵn sàng trong khung Phase 1.
      </p>
    </div>
  );
}
