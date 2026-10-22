import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../api';
import { useToast } from '../../context/ToastContext';
import useApi from '../../hooks/useApi';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import RatingStars from '../../components/common/RatingStars';
import StatusStepper from '../../components/complaints/StatusStepper';
import ComplaintTimeline from '../../components/complaints/ComplaintTimeline';
import AttachmentGallery from '../../components/complaints/AttachmentGallery';
import { formatTicket, formatDate, formatDateTime } from '../../utils/formatters';
import { CATEGORIES, STATUS } from '../../utils/constants';

export default function ComplaintDetail() {
  useDocumentTitle('Complaint details');
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { data: complaint, loading, error, refetch } = useApi(() => api.complaints.get(id), [id]);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [savingFeedback, setSavingFeedback] = useState(false);

  if (loading) return <Loader full />;
  if (error || !complaint) {
    return <EmptyState icon="bi-exclamation-triangle" title="Complaint not found" message="This complaint may have been removed or the link is incorrect."
      action={<Link to="/citizen/complaints" className="btn btn-primary btn-sm">Back to my complaints</Link>} />;
  }

  const canRate = [STATUS.RESOLVED, STATUS.CLOSED].includes(complaint.status);

  const submitFeedback = async () => {
    if (!rating) { toast.warning('Please select a star rating first.'); return; }
    setSavingFeedback(true);
    try {
      await api.feedback.submit(complaint.id, { rating, comment });
      toast.success('Thank you for your feedback!');
      setComment('');
      setRating(0);
      refetch();
    } catch (err) {
      toast.error(err.message || 'Could not submit feedback.');
    } finally {
      setSavingFeedback(false);
    }
  };

  return (
    <div>
      <button className="btn btn-sm btn-outline-light mb-3 d-inline-flex align-items-center gap-1.5" onClick={() => navigate('/citizen/complaints')}>
        <i className="bi bi-arrow-left" />
        <span>Back to My Tickets</span>
      </button>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="glass-panel border-glow rounded-4 p-4 p-md-5 mb-4 shadow-2xl">
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="font-monospace text-cyan fw-bold" style={{ fontSize: '0.85rem' }}>
                    {formatTicket(complaint.id, complaint.createdAt)}
                  </span>
                  <span className="text-muted small">• Filed {formatDate(complaint.createdAt)}</span>
                </div>
                <h3 className="fw-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {complaint.title}
                </h3>
                <span className="small text-muted d-inline-flex align-items-center gap-1.5">
                  <i className={`bi ${CATEGORIES[complaint.category]?.icon} text-cyan`} />
                  <span>{complaint.categoryLabel}</span>
                </span>
              </div>
              <div className="text-end d-flex flex-column gap-2 align-items-end">
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} subtle />
              </div>
            </div>

            <div className="py-4 my-3 border-top border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <StatusStepper status={complaint.status} />
            </div>

            <h6 className="fw-bold text-white mb-2">Description</h6>
            <p className="small mb-4" style={{ color: 'var(--cp-text-muted)', lineHeight: 1.6 }}>{complaint.description}</p>

            <h6 className="fw-bold text-white mb-2">Photo Evidence</h6>
            <AttachmentGallery attachments={complaint.attachments} />
          </div>

          {/* Feedback */}
          {canRate && (
            <div className="glass-panel border-glow rounded-4 p-4 p-md-5 shadow-2xl">
              <h5 className="fw-bold text-white mb-1 d-flex align-items-center gap-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <i className="bi bi-star-fill text-warning" />
                <span>Rate Resolution Quality</span>
              </h5>
              {complaint.feedback ? (
                <div className="glass-card p-3.5 rounded-3 mb-0 mt-3" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <RatingStars value={complaint.feedback.rating} />
                    <span className="small text-muted font-monospace">Verified {formatDate(complaint.feedback.createdAt)}</span>
                  </div>
                  {complaint.feedback.comment && <p className="mb-1 small text-white">“{complaint.feedback.comment}”</p>}
                  <button className="btn btn-sm btn-link text-cyan px-0 mt-1 text-decoration-none" onClick={() => { setRating(complaint.feedback.rating); setComment(complaint.feedback.comment); }}>
                    Update my feedback rating
                  </button>
                </div>
              ) : null}
              <div className={complaint.feedback ? 'mt-4' : 'mt-3'}>
                <p className="small mb-2" style={{ color: 'var(--cp-text-muted)' }}>How satisfied are you with the timeliness and workmanship of the municipal remediation?</p>
                <RatingStars value={rating} onChange={setRating} readOnly={false} size="1.8rem" />
                <textarea
                  className="form-control mt-3"
                  rows={3}
                  placeholder="Share feedback on the field officer's resolution quality…"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="btn btn-primary mt-3 px-4 py-2.5 fw-bold shadow-lg" onClick={submitFeedback} disabled={savingFeedback}>
                  {savingFeedback ? <><span className="spinner-border spinner-border-sm me-2" />Submitting…</> : 'Submit Citizen Rating'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="glass-panel border-glow rounded-4 p-4 mb-4 shadow-xl">
            <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-info-circle text-cyan" />
              <span>Ticket Telemetry</span>
            </h6>
            <dl className="row small mb-0 gy-2">
              <dt className="col-5 fw-normal" style={{ color: 'var(--cp-text-muted)' }}>Department</dt>
              <dd className="col-7 fw-semibold text-white">{complaint.departmentName}</dd>
              <dt className="col-5 fw-normal" style={{ color: 'var(--cp-text-muted)' }}>Ward</dt>
              <dd className="col-7 text-white">{complaint.wardName}</dd>
              <dt className="col-5 fw-normal" style={{ color: 'var(--cp-text-muted)' }}>Landmark</dt>
              <dd className="col-7 text-white">{complaint.landmark}</dd>
              {complaint.pincode && (<><dt className="col-5 fw-normal" style={{ color: 'var(--cp-text-muted)' }}>PIN Code</dt><dd className="col-7 font-monospace text-cyan">{complaint.pincode}</dd></>)}
              <dt className="col-5 fw-normal" style={{ color: 'var(--cp-text-muted)' }}>Officer</dt>
              <dd className="col-7 text-white">{complaint.assignedOfficerName || <span className="text-muted">Awaiting Dispatch</span>}</dd>
              <dt className="col-5 fw-normal" style={{ color: 'var(--cp-text-muted)' }}>Filed On</dt>
              <dd className="col-7 text-white">{formatDateTime(complaint.createdAt)}</dd>
              {complaint.resolvedAt && (<><dt className="col-5 fw-normal" style={{ color: 'var(--cp-text-muted)' }}>Resolved</dt><dd className="col-7 text-success">{formatDateTime(complaint.resolvedAt)}</dd></>)}
            </dl>
          </div>

          <div className="glass-panel border-glow rounded-4 p-4 shadow-xl">
            <h6 className="fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-clock-history text-cyan" />
              <span>Remediation Timeline</span>
            </h6>
            <ComplaintTimeline timeline={complaint.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}

