import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MarqueeBar } from './MarqueeBar';
import { Footer } from './Footer';

export function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <MarqueeBar />
        <main className="flex-1 overflow-y-auto bg-paper p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
