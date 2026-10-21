import { NavLink } from 'react-router-dom';
import { NAV } from './navConfig';
import { useAuth } from '../../auth/AuthContext';
import { ROLE_LABELS } from '../../utils/constants';

export default function Sidebar({ open, onNavigate }) {
  const { role, user } = useAuth();
  const items = NAV[role] || [];

  return (
    <aside className={`cp-sidebar ${open ? 'open' : ''}`}>
      {/* Mobile role header */}
      <div className="px-3 mb-3 d-lg-none d-flex align-items-center justify-content-between">
        <span className="badge badge-glow">{ROLE_LABELS[role]} Portal</span>
        <span className="small text-muted">{user?.fullName}</span>
      </div>

      <nav className="d-flex flex-column gap-1">
        {items.map((item, i) =>
          item.section ? (
            <div key={`s-${i}`} className="nav-section mt-3 mb-1">
              {item.section}
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onNavigate}
              end
            >
              <i className={`bi ${item.icon}`} />
              <span className="fw-medium">{item.label}</span>
            </NavLink>
          ),
        )}
      </nav>

      {/* Floating Civic Helpline Card */}
      <div className="mt-auto pt-4 px-2">
        <div
          className="glass-card p-3 rounded-3"
          style={{
            background: 'linear-gradient(145deg, rgba(14, 165, 233, 0.08) 0%, rgba(8, 14, 26, 0.4) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
          }}
        >
          <div className="d-flex align-items-center gap-2 mb-1.5">
            <span className="live-dot" />
            <span className="cp-eyebrow text-cyan" style={{ fontSize: '0.68rem' }}>MUNICIPAL HELPLINE</span>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-1">
            <span className="text-white fw-bold font-monospace" style={{ fontSize: '0.95rem' }}>1800-CIVIC</span>
            <span className="badge" style={{ fontSize: '0.62rem', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--cp-primary)' }}>24/7 TOLL-FREE</span>
          </div>
          <p className="small mb-0 mt-1" style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem', lineHeight: 1.35 }}>
            Urgent civic emergencies &amp; disaster helpline.
          </p>
        </div>
      </div>
    </aside>
  );
}
