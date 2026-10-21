import { APP_NAME, APP_TAGLINE } from '../../utils/constants';

export default function Footer({ minimal = false }) {
  const year = new Date().getFullYear();
  if (minimal) {
    return (
      <footer className="text-center text-muted small py-3">
        © {year} {APP_NAME} · {APP_TAGLINE}
      </footer>
    );
  }
  return (
    <footer className="mt-auto border-top" style={{ background: 'rgba(8, 14, 26, 0.75)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255, 255, 255, 0.07)' }}>
      <div className="container py-4">
        <div className="row gy-3 align-items-center">
          <div className="col-md-6">
            <div className="fw-bold text-white d-flex align-items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="badge badge-glow" style={{ fontSize: '0.7rem' }}>CIVIC-TECH v2.6</span>
              {APP_NAME}
            </div>
            <div className="small mt-1" style={{ color: 'var(--cp-text-muted)' }}>{APP_TAGLINE}</div>
          </div>
          <div className="col-md-6 text-md-end small" style={{ color: 'var(--cp-text-muted)' }}>
            A mini-project · Department of Computer Science &amp; Applications,<br className="d-none d-md-block" />
            MIT World Peace University, Pune · © {year}
          </div>
        </div>
      </div>
    </footer>
  );
}
