import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validateLogin, hasErrors } from '../../utils/validators';
import { ROLE_HOME, APP_NAME, APP_TAGLINE } from '../../utils/constants';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import BrandMark from '../../components/layout/BrandMark';
import SmartCity3D from '../../components/common/SmartCity3D';

const DEMO_USERS = [
  { role: 'Citizen', label: 'Citizen Portal', email: 'suyog@civigo.in', password: 'Citizen@123', icon: 'bi-person', badge: 'Public' },
  { role: 'Officer', label: 'Department Officer', email: 'rahul.officer@civigo.in', password: 'Officer@123', icon: 'bi-person-badge', badge: 'Field / SLA' },
  { role: 'Administrator', label: 'Municipal Admin', email: 'admin@civigo.in', password: 'Admin@123', icon: 'bi-shield-lock', badge: 'Full Control' },
];

export default function Login() {
  useDocumentTitle('Sign in');
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = async (e) => {
    e.preventDefault();
    const found = validateLogin(form);
    setErrors(found);
    if (hasErrors(found)) {
      triggerShake();
      return;
    }

    setBusy(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.fullName.split(' ')[0]}!`);
      const dest = location.state?.from?.pathname || ROLE_HOME[user.role];
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Sign in failed');
      setErrors({ password: ' ' });
      triggerShake();
    } finally {
      setBusy(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const fillDemo = (demo) => {
    set({ email: demo.email, password: demo.password });
    setErrors({});
  };

  return (
    <div className="container py-4 py-lg-5">
      <div
        className={`glass-panel border-glow overflow-hidden shadow-2xl ${shake ? 'error-shake' : ''}`}
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          minHeight: 640,
          borderRadius: 24,
        }}
      >
        <div className="row g-0 align-items-stretch">
          {/* Left: 3D Smart City & Civic Identity */}
          <div
            className="col-lg-6 d-none d-lg-flex flex-column justify-content-between p-4 p-xl-5 position-relative overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.15), transparent 70%), linear-gradient(170deg, #070d19 0%, #0c1a30 100%)',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              minHeight: 640,
            }}
          >
            {/* Background 3D Canvas */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0.88,
                pointerEvents: 'auto',
              }}
            >
              <SmartCity3D />
            </div>

            {/* Gradient Overlays for Readability */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(7, 13, 25, 0.82) 0%, rgba(7, 13, 25, 0.3) 45%, rgba(7, 13, 25, 0.88) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Top Brand Header */}
            <div className="position-relative" style={{ zIndex: 2 }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <BrandMark size={38} />
                <span className="h4 fw-bold mb-0 text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {APP_NAME}
                </span>
                <span className="badge badge-glow ms-2">Smart City v2.6</span>
              </div>
              <p className="small mb-0" style={{ color: 'var(--cp-text-muted)' }}>
                Intelligent Municipal Operations &amp; Issue Resolution
              </p>
            </div>

            {/* Middle Live Civic Network Tag */}
            <div className="position-relative my-auto py-4" style={{ zIndex: 2 }}>
              <div
                className="glass-card p-3 p-xl-4 rounded-4"
                style={{
                  maxWidth: 420,
                  background: 'rgba(8, 18, 38, 0.65)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                }}
              >
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="live-dot" />
                  <span className="cp-eyebrow text-cyan">Real-time Connected Grid</span>
                </div>
                <h5 className="text-white fw-bold mb-1">Citizen → Department → Action</h5>
                <p className="small mb-0" style={{ color: 'var(--cp-text-muted)', lineHeight: 1.5 }}>
                  Empowering urban communities with transparent tracking, automated SLA monitoring, and collaborative civic governance.
                </p>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="position-relative d-flex justify-content-between align-items-center" style={{ zIndex: 2 }}>
              <div className="d-flex align-items-center gap-2 small" style={{ color: 'var(--cp-text-muted)' }}>
                <i className="bi bi-shield-check text-cyan" />
                <span>Zero-Trust Role Security</span>
              </div>
              <div className="small font-monospace" style={{ color: 'var(--cp-primary)' }}>
                PUNE MUNICIPAL CLUSTER
              </div>
            </div>
          </div>

          {/* Right: Glassmorphic Authentication Form */}
          <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center position-relative">
            <div style={{ maxWidth: 460, margin: '0 auto', width: '100%' }}>
              {/* Header */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h2 className="fw-bold text-white mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    Welcome back
                  </h2>
                  <span className="badge badge-soft d-lg-none">{APP_NAME}</span>
                </div>
                <p className="small" style={{ color: 'var(--cp-text-muted)' }}>
                  Enter your credentials to access your civic console.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={submit} noValidate>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-white">Email Address</label>
                  <div className="position-relative">
                    <i
                      className="bi bi-envelope position-absolute"
                      style={{
                        left: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--cp-text-muted)',
                      }}
                    />
                    <input
                      type="email"
                      className={`form-control ps-5 ${errors.email ? 'is-invalid' : ''}`}
                      placeholder="name@civigo.in"
                      value={form.email}
                      onChange={(e) => set({ email: e.target.value })}
                      autoComplete="email"
                      required
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label className="form-label small fw-semibold text-white mb-0">Password</label>
                  </div>
                  <div className="position-relative">
                    <i
                      className="bi bi-lock position-absolute"
                      style={{
                        left: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--cp-text-muted)',
                      }}
                    />
                    <input
                      type={showPw ? 'text' : 'password'}
                      className={`form-control ps-5 pe-5 ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Enter your security token"
                      value={form.password}
                      onChange={(e) => set({ password: e.target.value })}
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="btn position-absolute end-0 top-0 h-100 px-3 text-muted border-0 bg-transparent"
                      onClick={() => setShowPw((s) => !s)}
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      <i className={`bi ${showPw ? 'bi-eye-slash text-cyan' : 'bi-eye'}`} />
                    </button>
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg"
                  disabled={busy}
                  style={{
                    fontSize: '1rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  {busy ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                      Authenticating…
                    </>
                  ) : (
                    <>
                      <span>Sign In to Console</span>
                      <i className="bi bi-arrow-right-short fs-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Register Callout */}
              <p className="text-center small mt-4 mb-0" style={{ color: 'var(--cp-text-muted)' }}>
                New citizen in this ward?{' '}
                <Link to="/register" className="fw-semibold text-cyan text-decoration-none">
                  Register citizen profile <i className="bi bi-arrow-right" />
                </Link>
              </p>

              {/* Instant Role Fast-Fill Grid */}
              <div className="mt-4 pt-3 border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="cp-eyebrow text-cyan">Instant Access Accounts</span>
                  <span className="small font-monospace" style={{ fontSize: '0.72rem', color: 'var(--cp-text-muted)' }}>
                    Auto-Fill
                  </span>
                </div>
                <div className="d-flex flex-column gap-2">
                  {DEMO_USERS.map((d) => (
                    <button
                      key={d.role}
                      type="button"
                      className="btn btn-sm text-start p-2.5 rounded-3 d-flex align-items-center gap-3 transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: 'var(--cp-text-main)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                      }}
                      onClick={() => fillDemo(d)}
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: 32,
                          height: 32,
                          background: 'rgba(56, 189, 248, 0.15)',
                          color: 'var(--cp-primary)',
                        }}
                      >
                        <i className={`bi ${d.icon}`} />
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-semibold text-white small">{d.label}</span>
                          <span
                            className="badge"
                            style={{
                              fontSize: '0.65rem',
                              background: 'rgba(255, 255, 255, 0.08)',
                              color: 'var(--cp-text-muted)',
                            }}
                          >
                            {d.badge}
                          </span>
                        </div>
                        <div className="text-truncate font-monospace" style={{ fontSize: '0.75rem', color: 'var(--cp-text-muted)' }}>
                          {d.email}
                        </div>
                      </div>
                      <i className="bi bi-box-arrow-in-right text-muted" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

