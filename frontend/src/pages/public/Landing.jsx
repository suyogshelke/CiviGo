import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ROLE_HOME, APP_NAME, CATEGORIES, CATEGORY_KEYS } from '../../utils/constants';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import SmartCity3D from '../../components/common/SmartCity3D';

/** The public landing page — 2026 Civic-Tech product presentation. */
export default function Landing() {
  useDocumentTitle('Home');
  const { isAuthenticated, user } = useAuth();
  const homeHref = isAuthenticated ? ROLE_HOME[user.role] : '/register';

  const steps = [
    { icon: 'bi-geo-alt', title: 'Citizen Reports', text: 'Capture issues with GPS accuracy, photographic evidence, and automated category matching in under a minute.' },
    { icon: 'bi-cpu', title: 'Automated Routing', text: 'Intelligent municipal engine assigns the complaint directly to the responsible zonal department and field officer.' },
    { icon: 'bi-tools', title: 'Field Remediation', text: 'Assigned officers inspect the site, execute repairs, upload resolution proof, and log timeline events.' },
    { icon: 'bi-patch-check', title: 'Citizen Verification', text: 'Citizens track every milestone in real time, confirm resolution quality, and provide transparency ratings.' },
  ];

  const highlights = [
    { icon: 'bi-grid-1x2', title: 'Three Synchronized Consoles', text: 'Dedicated interfaces tailored for Citizens, Field Officers, and Municipal Administrators.' },
    { icon: 'bi-shield-check', title: 'Full Lifecycle Audit Trail', text: 'Transparent six-stage progression from initial submission to final closure with geo-verification.' },
    { icon: 'bi-graph-up-arrow', title: 'Real-Time Ward Analytics', text: 'Live municipal metrics detailing department response velocities, open backlogs, and SLA compliance.' },
    { icon: 'bi-key', title: 'Zero-Trust Role Security', text: 'Stateless JWT tokens ensure secure access boundaries across departments and citizen records.' },
  ];

  return (
    <>
      {/* ---------------------------------------------------------- 3D Hero Section */}
      <section className="position-relative overflow-hidden" style={{ minHeight: '88vh', display: 'flex', alignItems: 'center' }}>
        {/* Background 3D Smart City (Lightweight Three.js) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.85,
            zIndex: 1,
            pointerEvents: 'auto',
          }}
        >
          <SmartCity3D />
        </div>

        {/* Ambient Dark Gradient Overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(7, 13, 25, 0.94) 0%, rgba(7, 13, 25, 0.7) 48%, rgba(7, 13, 25, 0.35) 100%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        <div className="container py-5 position-relative" style={{ zIndex: 3 }}>
          <div className="row align-items-center gy-4 py-lg-4">
            <div className="col-lg-7 text-white">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3" style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                <span className="live-dot" />
                <span className="cp-eyebrow text-cyan mb-0" style={{ fontSize: '0.72rem' }}>
                  SMART E-GOVERNANCE · METROPOLITAN GRID
                </span>
              </div>

              <h1 className="display-3 fw-bold mb-3 text-white" style={{ fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.08, letterSpacing: '-0.03em' }}>
                Every civic issue.<br />
                <span className="text-gradient">Resolved on one pulse.</span>
              </h1>

              <p className="fs-5 mb-4" style={{ color: 'var(--cp-text-muted)', maxWidth: 540, lineHeight: 1.6 }}>
                {APP_NAME} connects citizens with municipal departments to report, track, and
                resolve urban problems — potholes, garbage overflows, broken streetlights, water leakages, and drainage — through a single transparent platform.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to={homeHref} className="btn btn-primary btn-lg px-4 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-lg">
                  <i className="bi bi-megaphone" />
                  <span>{isAuthenticated ? 'Enter Console' : 'Report an Issue'}</span>
                </Link>
                <Link to="/track" className="btn btn-outline-light btn-lg px-4 py-3 d-inline-flex align-items-center gap-2">
                  <i className="bi bi-search text-cyan" />
                  <span>Track Complaint</span>
                </Link>
              </div>

              {/* Live Metric Counters */}
              <div className="d-flex gap-4 pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div>
                  <div className="h3 fw-bold text-white mb-0 font-monospace">6-STAGE</div>
                  <small style={{ color: 'var(--cp-text-muted)' }}>Lifecycle SLA</small>
                </div>
                <div style={{ width: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
                <div>
                  <div className="h3 fw-bold text-cyan mb-0 font-monospace">12 WARDS</div>
                  <small style={{ color: 'var(--cp-text-muted)' }}>Coverage</small>
                </div>
                <div style={{ width: 1, background: 'rgba(255, 255, 255, 0.1)' }} />
                <div>
                  <div className="h3 fw-bold text-white mb-0 font-monospace">100%</div>
                  <small style={{ color: 'var(--cp-text-muted)' }}>Audit Trail</small>
                </div>
              </div>
            </div>

            {/* Floating Live Telemetry Glass Card */}
            <div className="col-lg-5 d-none d-lg-block">
              <div
                className="glass-panel p-4 border-glow shadow-2xl rounded-4"
                style={{
                  background: 'rgba(8, 18, 38, 0.7)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span className="live-dot" />
                    <span className="cp-eyebrow text-cyan mb-0">CIVIC PULSE TELEMETRY</span>
                  </div>
                  <span className="badge badge-glow" style={{ fontSize: '0.68rem' }}>LIVE SYNC</span>
                </div>

                {/* Cybernetic Pulse Line */}
                <div className="py-2">
                  <svg className="pulse-line" viewBox="0 0 500 110" preserveAspectRatio="none" style={{ height: 90 }}>
                    <path d="M0 55 L70 55 L90 55 L105 20 L125 90 L145 10 L165 55 L220 55 L240 55 L255 35 L272 75 L290 55 L350 55 L370 55 L385 20 L405 85 L422 55 L500 55" />
                  </svg>
                </div>

                <div className="row g-2 mt-2">
                  {['POTHOLE', 'GARBAGE', 'WATER_LEAKAGE', 'STREETLIGHT'].map((c) => (
                    <div className="col-6" key={c}>
                      <div
                        className="d-flex align-items-center gap-2 p-2.5 rounded-3 transition-all"
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <i className={`bi ${CATEGORIES[c].icon} text-cyan`} />
                        <span className="small fw-semibold text-truncate text-white" style={{ fontSize: '0.78rem' }}>
                          {CATEGORIES[c].label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- How It Works (Step Matrix) */}
      <section className="container py-5 my-4">
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <span className="cp-eyebrow text-cyan mb-0">OPERATIONAL PIPELINE</span>
          </div>
          <h2 className="fw-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            From Report to Resolution
          </h2>
          <p className="mx-auto small" style={{ color: 'var(--cp-text-muted)', maxWidth: 560, lineHeight: 1.6 }}>
            A transparent, closed-loop civic governance workflow designed to eliminate bureaucratic delays.
          </p>
        </div>

        <div className="row g-4">
          {steps.map((s, i) => (
            <div className="col-md-6 col-lg-3" key={s.title}>
              <div
                className="glass-card h-100 p-4 rounded-4 position-relative overflow-hidden transition-all hover-lift"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: 44,
                      height: 44,
                      background: 'rgba(56, 189, 248, 0.12)',
                      color: 'var(--cp-primary)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                    }}
                  >
                    <i className={`bi ${s.icon} fs-5`} />
                  </div>
                  <span className="display-6 fw-bold font-monospace" style={{ color: 'rgba(56, 189, 248, 0.35)', fontFamily: 'Space Grotesk' }}>
                    0{i + 1}
                  </span>
                </div>
                <h5 className="fw-bold text-white mb-2">{s.title}</h5>
                <p className="small mb-0" style={{ color: 'var(--cp-text-muted)', lineHeight: 1.6 }}>
                  {s.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- Highlights Grid */}
      <section className="py-5" style={{ background: 'rgba(8, 14, 26, 0.6)', borderTop: '1px solid rgba(255, 255, 255, 0.06)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container py-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg-4">
              <span className="cp-eyebrow text-cyan">WHY CIVIGO</span>
              <h2 className="fw-bold text-white mt-2 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Engineered for Transparency &amp; Speed
              </h2>
              <p className="small mb-4" style={{ color: 'var(--cp-text-muted)', lineHeight: 1.65 }}>
                Traditional civic complaint workflows rely on paper registers and untracked phone calls. {APP_NAME} unifies urban remediation under verifiable digital SLAs.
              </p>
              <Link to="/register" className="btn btn-primary d-inline-flex align-items-center gap-2">
                <i className="bi bi-person-plus" />
                <span>Create Citizen Account</span>
              </Link>
            </div>
            <div className="col-lg-8">
              <div className="row g-3">
                {highlights.map((h) => (
                  <div className="col-md-6" key={h.title}>
                    <div
                      className="glass-card p-3.5 rounded-4 h-100 d-flex gap-3 align-items-start transition-all"
                      style={{
                        background: 'rgba(12, 22, 44, 0.55)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                      }}
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: 40,
                          height: 40,
                          background: 'rgba(56, 189, 248, 0.1)',
                          color: 'var(--cp-primary)',
                        }}
                      >
                        <i className={`bi ${h.icon} fs-5`} />
                      </div>
                      <div>
                        <h6 className="fw-bold text-white mb-1">{h.title}</h6>
                        <p className="small mb-0" style={{ color: 'var(--cp-text-muted)', lineHeight: 1.5 }}>
                          {h.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- Categories Matrix */}
      <section className="container py-5 my-4">
        <div className="text-center mb-4">
          <span className="cp-eyebrow text-cyan">INCIDENT TAXONOMY</span>
          <h2 className="fw-bold text-white mt-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Supported Civic Classifications
          </h2>
          <p className="small" style={{ color: 'var(--cp-text-muted)' }}>
            Immediate dispatch to specialized municipal teams based on category.
          </p>
        </div>
        <div className="row g-3">
          {CATEGORY_KEYS.map((key) => (
            <div className="col-6 col-md-4 col-lg-3" key={key}>
              <div
                className="glass-card p-3 text-center rounded-3 transition-all hover-lift"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  background: 'rgba(8, 14, 26, 0.4)',
                }}
              >
                <div
                  className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-2"
                  style={{
                    width: 44,
                    height: 44,
                    background: 'rgba(56, 189, 248, 0.08)',
                    color: 'var(--cp-primary)',
                  }}
                >
                  <i className={`bi ${CATEGORIES[key].icon} fs-5`} />
                </div>
                <div className="small fw-semibold text-white">{CATEGORIES[key].label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- Bottom CTA Banner */}
      <section className="container pb-5 mb-4">
        <div
          className="glass-panel p-5 text-center rounded-4 border-glow shadow-2xl position-relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
          }}
        >
          <div className="position-relative" style={{ zIndex: 2 }}>
            <h2 className="display-6 fw-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Transform your neighbourhood today.
            </h2>
            <p className="small mb-4 mx-auto" style={{ color: 'var(--cp-text-muted)', maxWidth: 520, fontSize: '0.95rem' }}>
              Join verified citizens tracking public infrastructure resolution with municipal accountability.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/register" className="btn btn-primary btn-lg px-4 py-2.5 fw-bold shadow-lg">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-2.5">
                Sign In to Console
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

