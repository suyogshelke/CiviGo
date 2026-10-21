import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import { useAuth } from '../../auth/AuthContext';
import useApi from '../../hooks/useApi';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import { PRIORITY_META, STATUS, ROLE_LABELS } from '../../utils/constants';
import { formatTicket, daysBetween } from '../../utils/formatters';


export default function OfficerDashboard() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();
  const { data: stats, loading: statsLoading } = useApi(() => api.analytics.officer(), []);
  const { data: complaints, loading } = useApi(() => api.complaints.list({ officerId: user.id }), [user.id]);
  const navigate = useNavigate();

  // Queue = active work, ordered by priority weight then age (SLA pressure).
  const queue = (complaints || [])
    .filter((c) => [STATUS.ASSIGNED, STATUS.IN_PROGRESS].includes(c.status))
    .sort((a, b) => (PRIORITY_META[b.priority]?.weight || 0) - (PRIORITY_META[a.priority]?.weight || 0) || (new Date(a.createdAt) - new Date(b.createdAt)))
    .slice(0, 6);

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Officer';

  return (
    <>
      <PageHeader
        eyebrow={`${ROLE_LABELS[user.role]} · ${user.designation || 'MUNICIPAL SERVICES'}`}
        title={`Field Console · ${firstName}`}
        subtitle="Manage assigned municipal remediation workflows and meet citizen SLA commitments."
        actions={
          <div className="d-flex align-items-center gap-2">
            <span className="badge badge-glow">ACTIVE DUTY</span>
            <Link to="/officer/complaints" className="btn btn-outline-light btn-sm d-inline-flex align-items-center gap-1.5">
              <i className="bi bi-inboxes" />
              <span>Full Workload</span>
            </Link>
          </div>
        }
      />

      {/* Officer Workload Hero */}
      <div
        className="glass-card p-4 rounded-4 mb-4 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(8, 18, 38, 0.6) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
      >
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1.5">
              <span className="live-dot" />
              <span className="cp-eyebrow text-cyan">FIELD QUEUE DISPATCH · LIVE</span>
            </div>
            <h4 className="fw-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Priority Remediation Pipeline
            </h4>
            <p className="small mb-0" style={{ color: 'var(--cp-text-muted)' }}>
              Complaints are weighted by severity and SLA days remaining. High priority tickets require on-site inspection within 48h.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <span className="text-white font-monospace fw-bold fs-5 px-3 py-1.5 rounded-3" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              {queue.length} Active in Queue
            </span>
          </div>
        </div>
      </div>

      {statsLoading ? (
        <Loader label="Synchronizing officer statistics…" />
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <StatCard label="Total Assigned" value={stats?.assigned ?? 0} icon="bi-inboxes" variant="primary" hint="Active ward tickets" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Awaiting Action" value={stats?.pending ?? 0} icon="bi-hourglass-split" variant="warning" hint="Pending triage" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="In Progress" value={stats?.inProgress ?? 0} icon="bi-gear-wide-connected" variant="info" hint="Under field repair" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Resolved" value={stats?.resolved ?? 0} icon="bi-check2-circle" variant="success" hint="Completed repairs" />
          </div>
        </div>
      )}

      {/* Priority Work Queue */}
      <div className="glass-panel overflow-hidden border-glow">
        <div className="p-3.5 px-4 d-flex justify-content-between align-items-center border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-list-check text-cyan" />
            <span className="fw-bold text-white">Priority Work Queue</span>
          </div>
          <Link to="/officer/complaints" className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1">
            <span>All Assigned</span>
            <i className="bi bi-arrow-right" />
          </Link>
        </div>

        <div className="p-0">
          {loading ? (
            <Loader />
          ) : queue.length === 0 ? (
            <EmptyState
              icon="bi-check-all"
              title="Queue Clear"
              message="No urgent complaints are currently awaiting your action in this ward."
            />
          ) : (
            <div className="d-flex flex-column">
              {queue.map((c) => {
                const age = daysBetween(c.createdAt);
                const sla = PRIORITY_META[c.priority]?.slaDays || 7;
                const overdue = age > sla;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className="p-3.5 px-4 d-flex justify-content-between align-items-start gap-3 text-start border-0 border-bottom transition-all w-100"
                    style={{
                      background: 'transparent',
                      borderColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--cp-text-main)',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => navigate(`/officer/complaints/${c.id}`)}
                  >
                    <div className="d-flex flex-column gap-1 flex-grow-1 overflow-hidden">
                      <div className="d-flex align-items-center gap-2">
                        <span className="font-monospace text-cyan fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                          {formatTicket(c.id, c.createdAt)}
                        </span>
                        <span className="small text-muted">• {c.wardName || 'Ward Area'}</span>
                      </div>
                      <div className="fw-semibold text-white fs-6 text-truncate">{c.title}</div>
                      <div className="small text-truncate" style={{ color: 'var(--cp-text-muted)', maxWidth: 640 }}>
                        <i className="bi bi-geo-alt me-1 text-cyan" />
                        {c.landmark || 'Field location'}
                      </div>
                    </div>

                    <div className="text-end d-flex flex-column gap-1.5 align-items-end flex-shrink-0">
                      <div className="d-flex align-items-center gap-2">
                        <PriorityBadge priority={c.priority} />
                        <StatusBadge status={c.status} />
                      </div>
                      <span
                        className="badge"
                        style={{
                          fontSize: '0.72rem',
                          background: overdue ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.15)',
                          color: overdue ? '#fca5a5' : '#fcd34d',
                          border: `1px solid ${overdue ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.3)'}`,
                        }}
                      >
                        {overdue ? (
                          <>
                            <i className="bi bi-exclamation-triangle me-1" />
                            {age - sla}d Overdue
                          </>
                        ) : (
                          `${sla - age}d to SLA`
                        )}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

