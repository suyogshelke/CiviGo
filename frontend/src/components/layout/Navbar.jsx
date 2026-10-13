import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { APP_NAME, ROLE_LABELS, ROLE_HOME } from '../../utils/constants';
import { initials } from '../../utils/formatters';
import BrandMark from './BrandMark';
import ThemeToggle from '../common/ThemeToggle';

export default function Navbar({ onToggleSidebar, showToggle }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const home = isAuthenticated ? ROLE_HOME[user.role] : '/';
  const profilePath = isAuthenticated ? `/${user.role.toLowerCase()}/profile` : '/login';

  return (
    <nav className="cp-navbar sticky-top">
      <div className="d-flex align-items-center justify-content-between px-3 px-md-4" style={{ height: 66 }}>
        <div className="d-flex align-items-center gap-2">
          {showToggle && (
            <button
              className="btn btn-sm btn-light d-lg-none me-1"
              onClick={onToggleSidebar}
              aria-label="Toggle navigation menu"
              style={{ width: 38, height: 38, padding: 0 }}
            >
              <i className="bi bi-list fs-5 text-white" />
            </button>
          )}
          <Link to={home} className="cp-brand">
            <BrandMark size={34} />
            <span className="brand-font">
              {APP_NAME}
              <span className="badge ms-2 d-none d-sm-inline-block" style={{ background: 'rgba(0, 242, 254, 0.12)', color: 'var(--cp-cyan)', border: '1px solid rgba(0, 242, 254, 0.25)', fontSize: '0.65rem' }}>
                <span className="badge-pulse-dot me-1" />SMART CIVIC
              </span>
            </span>
          </Link>
        </div>

        <div className="d-flex align-items-center gap-2" ref={menuRef}>
          <ThemeToggle />
          {isAuthenticated ? (

            <div className="position-relative">
              <button
                className="btn btn-light d-flex align-items-center gap-2 py-1 ps-1 pe-3"
                onClick={() => setMenuOpen((o) => !o)}
                style={{
                  borderRadius: 999,
                  background: 'rgba(16, 25, 46, 0.85)',
                  border: '1px solid var(--cp-border)',
                }}
              >
                <span className="avatar" style={{ width: 34, height: 34, fontSize: '0.8rem' }}>
                  {initials(user.fullName)}
                </span>
                <span className="d-none d-sm-block text-start lh-sm">
                  <span className="d-block fw-semibold text-white" style={{ fontSize: '0.85rem' }}>
                    {user.fullName}
                  </span>
                  <span className="d-block" style={{ fontSize: '0.7rem', color: 'var(--cp-cyan)' }}>
                    {ROLE_LABELS[user.role]}
                  </span>
                </span>
                <i className={`bi bi-chevron-${menuOpen ? 'up' : 'down'} small text-muted ms-1`} />
              </button>

              {menuOpen && (
                <div
                  className="dropdown-menu show position-absolute end-0 mt-2 py-2"
                  style={{ minWidth: 230, zIndex: 1080 }}
                >
                  <div className="px-3 py-2 border-bottom" style={{ borderColor: 'var(--cp-border)' }}>
                    <div className="fw-semibold text-truncate text-white">{user.fullName}</div>
                    <div className="small text-muted text-truncate">{user.email}</div>
                    <span className="badge badge-soft mt-1" style={{ fontSize: '0.65rem' }}>
                      {ROLE_LABELS[user.role]} Portal
                    </span>
                  </div>

                  <button
                    className="dropdown-item d-flex align-items-center gap-2"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate(profilePath);
                    }}
                  >
                    <i className="bi bi-person-gear text-cyan" />
                    <span>My Profile</span>
                  </button>

                  <button
                    className="dropdown-item d-flex align-items-center gap-2 text-danger"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                      navigate('/login');
                    }}
                  >
                    <i className="bi bi-box-arrow-right" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/track" className="btn btn-outline-light btn-sm d-none d-sm-inline-flex">
                <i className="bi bi-crosshair text-cyan" />
                Track Issue
              </Link>
              <Link to="/login" className="btn btn-outline-primary btn-sm">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
