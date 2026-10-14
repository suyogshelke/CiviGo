import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AmbientBackground from '../common/AmbientBackground';

/** Authenticated shell: top navbar + collapsible sidebar + routed content. */
export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="d-flex flex-column min-vh-100 position-relative" style={{ overflowX: 'hidden' }}>
      <AmbientBackground />
      <div className="position-relative" style={{ zIndex: 100 }}>
        <Navbar showToggle onToggleSidebar={() => setSidebarOpen((o) => !o)} />
      </div>
      <div className="cp-shell position-relative" style={{ zIndex: 10 }}>
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        {sidebarOpen && <button className="cp-backdrop d-lg-none" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}
        <main className="cp-content position-relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
