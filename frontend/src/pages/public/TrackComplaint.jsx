import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { formatTicket, formatDate } from '../../utils/formatters';
import { CATEGORIES } from '../../utils/constants';
import StatusStepper from '../../components/complaints/StatusStepper';
import ComplaintTimeline from '../../components/complaints/ComplaintTimeline';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import useDocumentTitle from '../../hooks/useDocumentTitle';

/** Public, no-login lookup of a complaint by its numeric id / ticket number. */
export default function TrackComplaint() {
  useDocumentTitle('Track a complaint');
  const [ref, setRef] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    setError(null);
    setComplaint(null);
    const id = ref.replace(/\D/g, '').replace(/^0+/, '');
    if (!id) {
      setError('Enter a valid reference ID, e.g. 1001 or CIV-2026-001001');
      return;
    }
    setBusy(true);
    try {
      const found = await api.complaints.get(Number(id));
      setComplaint(found);
    } catch {
      setError('No municipal ticket found with that reference number. Please verify and retry.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container py-4 py-lg-5" style={{ maxWidth: 860 }}>
      {/* Header */}
      <div className="text-center mb-4">
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <span className="live-dot" />
          <span className="cp-eyebrow text-cyan mb-0">PUBLIC AUDIT ENGINE</span>
        </div>
        <h2 className="fw-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Live Civic Ticket Radar
        </h2>
        <p className="small mx-auto" style={{ color: 'var(--cp-text-muted)', maxWidth: 500 }}>
          Enter your reference token to inspect real-time inspection milestones, assigned officers, and remediation progress.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={search} className="glass-panel p-3.5 mb-4 border-glow shadow-xl rounded-4">
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-transparent border-0 ps-3">
            <i className="bi bi-search text-cyan" />
          </span>
          <input
            className="form-control bg-transparent border-0 text-white font-monospace"
            placeholder="e.g. 1001 or CIV-2026-001001"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            style={{ fontSize: '1.05rem', boxShadow: 'none' }}
          />
          <button
            type="submit"
            className="btn btn-primary px-4 fw-bold d-inline-flex align-items-center gap-2 rounded-3 shadow-lg"
            disabled={busy}
          >
            {busy ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" />
                <span>Locating…</span>
              </>
            ) : (
              <>
                <span>Scan Grid</span>
                <i className="bi bi-arrow-right-short fs-5" />
              </>
            )}
          </button>
        </div>
        {error && (
          <div className="text-danger small mt-2.5 px-3 d-flex align-items-center gap-1.5">
            <i className="bi bi-exclamation-triangle-fill" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Ticket Details Glass Card */}
      {complaint && (
        <div className="glass-panel border-glow rounded-4 overflow-hidden shadow-2xl">
          <div className="p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="font-monospace text-cyan fw-bold" style={{ fontSize: '0.85rem', letterSpacing: '0.04em' }}>
                    {formatTicket(complaint.id, complaint.createdAt)}
                  </span>
                  <span className="text-muted small">• Filed {formatDate(complaint.createdAt)}</span>
                </div>
                <h3 className="fw-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {complaint.title}
                </h3>
                <div className="d-flex align-items-center gap-2 small" style={{ color: 'var(--cp-text-muted)' }}>
                  <i className={`bi ${CATEGORIES[complaint.category]?.icon} text-cyan`} />
                  <span>{complaint.categoryLabel}</span>
                  <span>•</span>
                  <i className="bi bi-geo-alt text-cyan" />
                  <span>{complaint.wardName}</span>
                </div>
              </div>
              <div className="d-flex flex-column gap-2 align-items-end flex-shrink-0">
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} subtle />
              </div>
            </div>

            <div className="py-4 my-2 border-top border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <StatusStepper status={complaint.status} />
            </div>

            <div className="pt-4">
              <h5 className="fw-bold text-white mb-3 d-flex align-items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <i className="bi bi-clock-history text-cyan" />
                <span>Remediation Activity Log</span>
              </h5>
              <ComplaintTimeline timeline={complaint.timeline} />
            </div>
          </div>
        </div>
      )}

      <div className="text-center mt-4">
        <span className="small" style={{ color: 'var(--cp-text-muted)' }}>Need to raise an issue in your sector? </span>
        <Link to="/register" className="small fw-semibold text-cyan text-decoration-none">
          Create verified account <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </div>
  );
}

