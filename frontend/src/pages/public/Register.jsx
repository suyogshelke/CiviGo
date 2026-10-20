import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../context/ToastContext';
import { validateRegistration, hasErrors, passwordStrength } from '../../utils/validators';
import { WARDS, ROLE_HOME, APP_NAME } from '../../utils/constants';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import BrandMark from '../../components/layout/BrandMark';

const STRENGTH = [
  { label: '', color: '' },
  { label: 'Weak', color: 'danger' },
  { label: 'Fair', color: 'warning' },
  { label: 'Good', color: 'info' },
  { label: 'Strong', color: 'success' },
];

export default function Register() {
  useDocumentTitle('Create account');
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', ward: '', address: '', pincode: '',
    password: '', confirmPassword: '', acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const strength = passwordStrength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    const found = validateRegistration(form);
    setErrors(found);
    if (hasErrors(found)) {
      document.querySelector('.is-invalid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setBusy(true);
    try {
      const user = await register(form);
      toast.success('Account created — welcome to ' + APP_NAME + '!');
      navigate(ROLE_HOME[user.role], { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      if (/email|exist|account/i.test(err.message)) setErrors({ email: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container py-4 py-lg-5">
      <div className="row justify-content-center">
        <div className="col-lg-9 col-xl-8">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center gap-2 mb-2">
              <BrandMark size={36} />
              <span className="h4 fw-bold mb-0 text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {APP_NAME}
              </span>
            </div>
            <h2 className="fw-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Citizen Registration Console
            </h2>
            <p className="small mb-0" style={{ color: 'var(--cp-text-muted)' }}>
              Create your verified municipal profile to report and monitor ward issues.
            </p>
          </div>

          {/* Registration Glass Form */}
          <div className="glass-panel p-4 p-md-5 border-glow shadow-2xl rounded-4">
            <form onSubmit={submit} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-white">Full Name <span className="text-danger">*</span></label>
                  <input
                    className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                    value={form.fullName}
                    onChange={(e) => set({ fullName: e.target.value })}
                    placeholder="e.g. Suyog Shelke"
                    required
                  />
                  <div className="invalid-feedback">{errors.fullName}</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-white">Email Address <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={form.email}
                    onChange={(e) => set({ email: e.target.value })}
                    placeholder="you@civigo.in"
                    autoComplete="email"
                    required
                  />
                  <div className="invalid-feedback">{errors.email}</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-white">Mobile Number <span className="text-danger">*</span></label>
                  <div className="input-group">
                    <span className="input-group-text font-monospace" style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.12)', color: 'var(--cp-text-muted)' }}>
                      +91
                    </span>
                    <input
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      value={form.phone}
                      maxLength={10}
                      onChange={(e) => set({ phone: e.target.value.replace(/\D/g, '') })}
                      placeholder="10-digit number"
                      required
                    />
                    <div className="invalid-feedback">{errors.phone}</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-white">Assigned Ward <span className="text-danger">*</span></label>
                  <select
                    className={`form-select ${errors.ward ? 'is-invalid' : ''}`}
                    value={form.ward}
                    onChange={(e) => set({ ward: e.target.value })}
                    required
                  >
                    <option value="">Select your local ward…</option>
                    {WARDS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.ward}</div>
                </div>

                <div className="col-md-8">
                  <label className="form-label small fw-semibold text-white">Address / Landmark <span className="text-danger">*</span></label>
                  <input
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    value={form.address}
                    onChange={(e) => set({ address: e.target.value })}
                    placeholder="Building, street, or sector"
                    required
                  />
                  <div className="invalid-feedback">{errors.address}</div>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-white">Postal PIN Code</label>
                  <input
                    className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                    value={form.pincode}
                    maxLength={6}
                    onChange={(e) => set({ pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="411038"
                  />
                  <div className="invalid-feedback">{errors.pincode}</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-white">Password <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={form.password}
                    onChange={(e) => set({ password: e.target.value })}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    required
                  />
                  <div className="invalid-feedback">{errors.password}</div>

                  {form.password && !errors.password && (
                    <div className="mt-2">
                      <div className="progress rounded-pill overflow-hidden" style={{ height: 5, background: 'rgba(255, 255, 255, 0.08)' }}>
                        <div
                          className="progress-bar rounded-pill"
                          style={{
                            width: `${(strength / 4) * 100}%`,
                            background: strength >= 3 ? '#10b981' : strength >= 2 ? '#f59e0b' : '#ef4444',
                            boxShadow: strength >= 3 ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none',
                          }}
                        />
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-1">
                        <small className="font-monospace" style={{ fontSize: '0.72rem', color: strength >= 3 ? '#10b981' : strength >= 2 ? '#f59e0b' : '#ef4444' }}>
                          {STRENGTH[strength].label} security strength
                        </small>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-white">Confirm Password <span className="text-danger">*</span></label>
                  <input
                    type="password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    value={form.confirmPassword}
                    onChange={(e) => set({ confirmPassword: e.target.value })}
                    placeholder="Confirm security password"
                    autoComplete="new-password"
                    required
                  />
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                </div>

                <div className="col-12 mt-3">
                  <div className="form-check">
                    <input
                      className={`form-check-input ${errors.acceptTerms ? 'is-invalid' : ''}`}
                      type="checkbox"
                      id="terms"
                      checked={form.acceptTerms}
                      onChange={(e) => set({ acceptTerms: e.target.checked })}
                    />
                    <label className="form-check-label small" htmlFor="terms" style={{ color: 'var(--cp-text-muted)' }}>
                      I agree to submit verified civic reports and adhere to municipal community standards.
                    </label>
                    <div className="invalid-feedback">{errors.acceptTerms}</div>
                  </div>
                </div>

                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg"
                    disabled={busy}
                    style={{ fontSize: '1rem' }}
                  >
                    {busy ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" />
                        <span>Registering Profile…</span>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-check-fill" />
                        <span>Complete Citizen Registration</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <p className="text-center small mt-4 mb-0" style={{ color: 'var(--cp-text-muted)' }}>
            Already have an active account?{' '}
            <Link to="/login" className="fw-semibold text-cyan text-decoration-none">
              Sign in to Console <i className="bi bi-arrow-right" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

