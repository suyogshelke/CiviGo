import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AmbientBackground from '../common/AmbientBackground';

/** Shell for public marketing / auth pages. */
export default function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100 position-relative" style={{ overflowX: 'hidden' }}>
      <AmbientBackground />
      <div className="position-relative" style={{ zIndex: 2 }}>
        <Navbar />
      </div>
      <main className="flex-grow-1 position-relative" style={{ zIndex: 1 }}>
        <Outlet />
      </main>
      <div className="position-relative" style={{ zIndex: 2 }}>
        <Footer />
      </div>
    </div>
  );
}
