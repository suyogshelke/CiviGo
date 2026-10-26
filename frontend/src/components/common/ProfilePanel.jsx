import { useState } from 'react';
import { api } from '../../api';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../context/ToastContext';
import { WARDS, ROLE_LABELS, ROLES } from '../../utils/constants';
import { initials, formatDate } from '../../utils/formatters';
import { passwordProblem } from '../../utils/validators';
import PageHeader from '../common/PageHeader';

/**
 * Shared profile screen used by all three portals. Citizens can edit their
 * contact details; every role can change their password.
 */
export default function ProfilePanel() {
  const { user, refreshProfile } = useAuth();
  const toast = useToast();
  const editable = user.role === ROLES.CITIZEN;

  const [form, setForm] = useState({
    fullName: user.fullName || '', phone: user.phone || '',
    ward: user.ward || '', address: user.address || '', pincode: user.pincode || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwErr, setPwErr] = useState({});
  const [savingPw, setSavingPw] = useState(false);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await refreshProfile(form);
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err.message || 'Could not update your profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!pw.currentPassword) errs.currentPassword = 'Enter your current password';
    const problem = passwordProblem(pw.newPassword);
    if (problem) errs.newPassword = problem;
    if (pw.newPassword !== pw.confirm) errs.confirm = 'Passwords do not match';
    setPwErr(errs);
    if (Object.keys(errs).length) return;

    setSavingPw(true);
    try {
      await api.auth.changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword });
      toast.success('Password changed successfully.');
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.message || 'Could not change password.');
      setPwErr({ currentPassword: err.message });
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="IDENTITY &amp; SECURITY" title="User Profile &amp; Credentials" subtitle="Manage your verified citizen/officer records and rotate security tokens." />

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="glass-panel border-glow rounded-4 p-4 text-center shadow-xl">
            <div className="avatar avatar-lg mx-auto mb-3 shadow-lg" style={{ width: 68, height: 68, fontSize: '1.4rem' }}>
              {initials(user.fullName)}
            </div>
            <h5 className="fw-bold text-white mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {user.fullName}
            </h5>
            <div className="small font-monospace text-cyan mt-1">{user.email}</div>
            <span className="badge badge-glow mt-2 mx-auto">{ROLE_LABELS[user.role]} Console</span>
            <hr style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
            <dl className="row small text-start mb-0 gy-2">
              <dt className="col-5 fw-normal" style={{ color: 'var(--cp-text-muted)' }}>Phone</dt>
              <dd className="col-7 text-white font-monospace">{user.phone || '—'}</dd>
              {user.designation && (<><dt className="col-5 fw-normal" style={{ color: 'var(--cp-text-muted)' }}>Designation</dt><dd className="col-7 text-white">{user.designation}</dd></>)}
              {user.ward && (<><dt className="col-5 fw-normal" style={{ color: 'var(--cp-text-muted)' }}>Ward</dt><dd className="col-7 text-white">{user.ward}</dd></>)}
              <dt className="col-5 fw-normal" style={{ color: 'var(--cp-text-muted)' }}>Registered</dt>
              <dd className="col-7 text-white">{formatDate(user.createdAt)}</dd>
            </dl>
          </div>
        </div>

        <div className="col-lg-8">
          {editable && (
            <div className="glass-panel border-glow rounded-4 p-4 p-md-5 mb-4 shadow-xl">
              <h5 className="fw-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Personal Records
              </h5>
              <form onSubmit={saveProfile}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-white">Full Name</label>
                    <input className="form-control" value={form.fullName} onChange={(e) => set({ fullName: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-white">Mobile Number</label>
                    <input className="form-control" value={form.phone} maxLength={10} onChange={(e) => set({ phone: e.target.value.replace(/\D/g, '') })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-white">Ward</label>
                    <select className="form-select" value={form.ward} onChange={(e) => set({ ward: e.target.value })}>
                      <option value="">Select ward…</option>
                      {WARDS.map((w) => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-white">PIN Code</label>
                    <input className="form-control" value={form.pincode} maxLength={6} onChange={(e) => set({ pincode: e.target.value.replace(/\D/g, '') })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold text-white">Address</label>
                    <input className="form-control" value={form.address} onChange={(e) => set({ address: e.target.value })} />
                  </div>
                  <div className="col-12 text-end pt-2">
                    <button className="btn btn-primary px-4 fw-bold shadow-lg" disabled={savingProfile}>
                      {savingProfile ? <><span className="spinner-border spinner-border-sm me-2" />Saving…</> : 'Save Record Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div className="glass-panel border-glow rounded-4 p-4 p-md-5 shadow-xl">
            <h5 className="fw-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Security Credentials &amp; Password
            </h5>
            <form onSubmit={changePassword}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label small fw-semibold text-white">Current Password</label>
                  <input type="password" className={`form-control ${pwErr.currentPassword ? 'is-invalid' : ''}`} value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} autoComplete="current-password" />
                  <div className="invalid-feedback">{pwErr.currentPassword}</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-white">New Password</label>
                  <input type="password" className={`form-control ${pwErr.newPassword ? 'is-invalid' : ''}`} value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} autoComplete="new-password" />
                  <div className="invalid-feedback">{pwErr.newPassword}</div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-white">Confirm New Password</label>
                  <input type="password" className={`form-control ${pwErr.confirm ? 'is-invalid' : ''}`} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" />
                  <div className="invalid-feedback">{pwErr.confirm}</div>
                </div>
                <div className="col-12 text-end pt-2">
                  <button className="btn btn-outline-light px-4" disabled={savingPw}>
                    {savingPw ? <><span className="spinner-border spinner-border-sm me-2" />Updating…</> : 'Rotate Password'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

