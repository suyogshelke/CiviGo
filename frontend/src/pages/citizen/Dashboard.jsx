import { Link } from 'react-router-dom';
import { api } from '../../api';
import { useAuth } from '../../auth/AuthContext';
import useApi from '../../hooks/useApi';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { formatTicket, timeAgo, truncate } from '../../utils/formatters';

export default function CitizenDashboard() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();
  const { data: stats, loading: statsLoading } = useApi(() => api.analytics.citizen(), []);
  const { data: complaints, loading: listLoading } = useApi(() => api.complaints.list({ citizenId: user.id }), [user.id]);

  const recent = (complaints || []).slice(0, 5);
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'Citizen';

  return (
    <>
      <PageHeader
        eyebrow="CITIZEN OPERATIONS CONSOLE"
        title="Civic Command Center"
        subtitle="Report urban issues, monitor field resolution milestones, and hold municipal departments accountable."
        actions={
          <Link to="/citizen/submit" className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-lg">
            <i className="bi bi-plus-circle" />
            <span>Report New Issue</span>
          </Link>
        }
      />

      {/* Hero Welcome Banner */}
      <div
        className="glass-card p-4 p-md-5 rounded-4 mb-4 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(8, 18, 38, 0.6) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.22)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="live-dot" />
              <span className="cp-eyebrow text-cyan">ACTIVE WARD MONITORING · WARD {user?.wardNumber || '04'}</span>
            </div>
            <h2 className="text-white fw-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Good day, {firstName}.
            </h2>
            <p className="mb-3" style={{ color: 'var(--cp-text-muted)', maxWidth: 560, lineHeight: 1.6 }}>
              Together, we are transforming our urban spaces. Your reports directly alert verified field officers with automated SLA tracking.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Link to="/citizen/submit" className="btn btn-sm btn-primary">
                <i className="bi bi-camera me-1.5" /> Quick Issue Report
              </Link>
              <Link to="/citizen/complaints" className="btn btn-sm btn-outline-light">
                <i className="bi bi-clock-history me-1.5" /> View Active Tickets ({stats?.open || 0})
              </Link>
            </div>
          </div>
          <div className="col-lg-4 d-none d-lg-flex justify-content-end">
            <div
              className="p-3.5 rounded-3 text-center"
              style={{
                background: 'rgba(8, 14, 26, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="text-cyan font-monospace fw-bold fs-4">100% TRANSPARENT</div>
              <div className="small text-muted">Geo-tagged audit trail on all civic resolutions</div>
            </div>
          </div>
        </div>
      </div>

      {statsLoading ? (
        <Loader label="Calculating citizen metrics…" />
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <StatCard label="Total filed" value={stats?.total ?? 0} icon="bi-card-list" variant="primary" hint="Lifetime submissions" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="In progress" value={stats?.open ?? 0} icon="bi-hourglass-split" variant="warning" hint="Field officers assigned" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Resolved" value={stats?.resolved ?? 0} icon="bi-check2-circle" variant="success" hint="Verified resolutions" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Rate resolution" value={stats?.awaitingFeedback ?? 0} icon="bi-star" variant="info" hint="Feedback pending" />
          </div>
        </div>
      )}

      {/* Recent Complaints Glass Section */}
      <div className="glass-panel overflow-hidden border-glow">
        <div className="p-3.5 px-4 d-flex justify-content-between align-items-center border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-clock-history text-cyan" />
            <span className="fw-bold text-white">Recent Civic Tickets</span>
          </div>
          <Link to="/citizen/complaints" className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1">
            <span>View All Tickets</span>
            <i className="bi bi-arrow-right" />
          </Link>
        </div>
        <div className="p-0">
          {listLoading ? (
            <Loader />
          ) : recent.length === 0 ? (
            <EmptyState
              icon="bi-clipboard-plus"
              title="No tickets raised yet"
              message="When you report a pothole, broken streetlight, or garbage overflow, it will appear here with live timeline updates."
              action={
                <Link to="/citizen/submit" className="btn btn-primary btn-sm">
                  <i className="bi bi-plus-circle me-1" />
                  Report your first issue
                </Link>
              }
            />
          ) : (
            <div className="d-flex flex-column">
              {recent.map((c) => (
                <Link
                  key={c.id}
                  to={`/citizen/complaints/${c.id}`}
                  className="p-3.5 px-4 d-flex justify-content-between align-items-start gap-3 text-decoration-none border-bottom transition-all"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(56, 189, 248, 0.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="d-flex flex-column gap-1 flex-grow-1 overflow-hidden">
                    <div className="d-flex align-items-center gap-2">
                      <span className="font-monospace text-cyan fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.04em' }}>
                        {formatTicket(c.id, c.createdAt)}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>• {timeAgo(c.createdAt)}</span>
                    </div>
                    <div className="fw-semibold text-white fs-6 text-truncate">{c.title}</div>
                    <div className="small text-truncate" style={{ color: 'var(--cp-text-muted)', maxWidth: 640 }}>
                      {truncate(c.description, 110)}
                    </div>
                  </div>
                  <div className="text-end d-flex flex-column gap-1.5 align-items-end flex-shrink-0">
                    <StatusBadge status={c.status} />
                    <PriorityBadge priority={c.priority} subtle />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

