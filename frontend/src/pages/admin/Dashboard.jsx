import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import useApi from '../../hooks/useApi';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Loader from '../../components/common/Loader';
import PriorityBadge from '../../components/common/PriorityBadge';
import TrendChart from '../../components/charts/TrendChart';
import StatusDonut from '../../components/charts/StatusDonut';
import { STATUS_META, STATUS } from '../../utils/constants';
import { formatTicket, timeAgo, formatNumber } from '../../utils/formatters';

export default function AdminDashboard() {
  useDocumentTitle('Dashboard');
  const navigate = useNavigate();
  const { data: a, loading } = useApi(() => api.analytics.overview(), []);
  const { data: complaints } = useApi(() => api.complaints.list({}), []);

  if (loading || !a) return <Loader full label="Connecting to Municipal Analytics Engine…" />;

  const statusData = Object.entries(a.byStatus || {}).map(([key, value]) => ({
    key,
    name: STATUS_META[key]?.label || key,
    value,
  }));

  const attention = (complaints || [])
    .filter((c) => c.priority === 'CRITICAL' && ![STATUS.RESOLVED, STATUS.CLOSED].includes(c.status))
    .slice(0, 5);

  return (
    <>
      <PageHeader
        eyebrow="MUNICIPAL EXECUTIVE OVERSIGHT"
        title="City Command &amp; Operations"
        subtitle="Real-time telemetric analytics across all municipal wards, departments, and SLA pipelines."
        actions={
          <div className="d-flex align-items-center gap-2">
            <span className="badge badge-glow">SYSTEM NOMINAL</span>
            <Link to="/admin/reports" className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-lg">
              <i className="bi bi-file-earmark-arrow-down" />
              <span>Export Audit Dossier</span>
            </Link>
          </div>
        }
      />

      {/* KPI Metric Tiles with 3D Tilt */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <StatCard
            label="Total Complaints"
            value={formatNumber(a.totals.total)}
            icon="bi-card-list"
            variant="primary"
            hint={`${a.totals.citizens} registered citizens`}
          />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard
            label="Pending Action"
            value={formatNumber(a.totals.pending)}
            icon="bi-hourglass-split"
            variant="warning"
            hint="Awaiting field triage"
          />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard
            label="Resolution Rate"
            value={`${a.totals.resolutionRate}%`}
            icon="bi-graph-up-arrow"
            variant="success"
            hint={`Avg ${a.totals.avgResolutionDays} days turnaround`}
            trend={{ dir: 'up', value: '+4.2%' }}
          />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard
            label="Critical Open"
            value={formatNumber(a.totals.critical)}
            icon="bi-exclamation-triangle"
            variant="danger"
            hint="Requires priority SLA"
          />
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="glass-panel p-4 h-100 border-glow">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="cp-eyebrow text-cyan">TEMPORAL TRAJECTORY</div>
                <h5 className="fw-bold text-white mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Issue Submissions vs Resolutions (Last 6 Months)
                </h5>
              </div>
              <span className="small font-monospace" style={{ color: 'var(--cp-text-muted)' }}>
                MONTHLY AGGREGATE
              </span>
            </div>
            <TrendChart data={a.trend} height={300} />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="glass-panel p-4 h-100 border-glow">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <div className="cp-eyebrow text-cyan">STATUS DISTRIBUTION</div>
                <h5 className="fw-bold text-white mb-0" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Lifecycle Breakdown
                </h5>
              </div>
            </div>
            <StatusDonut data={statusData} height={300} />
          </div>
        </div>
      </div>

      {/* Department Breakdown & High Severity Focus */}
      <div className="row g-4">
        <div className="col-lg-7">
          <div className="glass-panel h-100 border-glow overflow-hidden">
            <div className="p-3.5 px-4 d-flex justify-content-between align-items-center border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-building text-cyan" />
                <span className="fw-bold text-white">Department Resolution Velocity</span>
              </div>
              <Link to="/admin/departments" className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1">
                <span>Manage</span>
                <i className="bi bi-arrow-right" />
              </Link>
            </div>
            <div className="p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0" style={{ color: 'var(--cp-text-main)' }}>
                  <thead>
                    <tr style={{ borderColor: 'rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)' }}>
                      <th className="ps-4 text-uppercase small" style={{ color: 'var(--cp-text-muted)', fontSize: '0.72rem' }}>Department</th>
                      <th className="text-center text-uppercase small" style={{ color: 'var(--cp-text-muted)', fontSize: '0.72rem' }}>Total</th>
                      <th className="text-center text-uppercase small" style={{ color: 'var(--cp-text-muted)', fontSize: '0.72rem' }}>Resolved</th>
                      <th className="pe-4 text-uppercase small" style={{ width: 180, color: 'var(--cp-text-muted)', fontSize: '0.72rem' }}>SLA Clearance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(a.byDepartment || {}).map(([name, d]) => {
                      const rate = d.total ? Math.round((d.resolved / d.total) * 100) : 0;
                      return (
                        <tr key={name} style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                          <td className="ps-4 fw-semibold text-white">{name}</td>
                          <td className="text-center font-monospace text-muted">{d.total}</td>
                          <td className="text-center font-monospace text-cyan fw-bold">{d.resolved}</td>
                          <td className="pe-4">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="progress flex-grow-1 rounded-pill overflow-hidden"
                                style={{
                                  height: 8,
                                  background: 'rgba(255, 255, 255, 0.08)',
                                }}
                              >
                                <div
                                  className="progress-bar rounded-pill"
                                  style={{
                                    width: `${rate}%`,
                                    background: rate >= 70 ? 'linear-gradient(90deg, #10b981, #34d399)' : rate >= 40 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)',
                                    boxShadow: rate >= 70 ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none',
                                  }}
                                />
                              </div>
                              <span className="small font-monospace fw-bold text-white" style={{ width: 36, textAlign: 'right' }}>
                                {rate}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="glass-panel h-100 border-glow overflow-hidden">
            <div className="p-3.5 px-4 d-flex justify-content-between align-items-center border-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-shield-exclamation text-danger" />
                <span className="fw-bold text-white">Critical SLA Alerts</span>
              </div>
              <Link to="/admin/complaints" className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1">
                <span>View All</span>
                <i className="bi bi-arrow-right" />
              </Link>
            </div>
            <div className="p-0">
              {attention.length === 0 ? (
                <div className="p-4 text-center">
                  <div className="text-success fs-3 mb-2"><i className="bi bi-check-circle" /></div>
                  <div className="fw-bold text-white">All Critical Issues Resolved</div>
                  <div className="small text-muted">No unresolved high-priority incidents currently pending.</div>
                </div>
              ) : (
                <div className="d-flex flex-column">
                  {attention.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className="p-3.5 px-4 d-flex justify-content-between align-items-start gap-2 text-start border-0 border-bottom transition-all w-100"
                      style={{
                        background: 'transparent',
                        borderColor: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--cp-text-main)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      onClick={() => navigate(`/admin/complaints/${c.id}`)}
                    >
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="d-flex align-items-center gap-2">
                          <span className="font-monospace text-danger fw-bold" style={{ fontSize: '0.75rem' }}>
                            {formatTicket(c.id, c.createdAt)}
                          </span>
                          <span className="small text-muted">• {c.departmentName}</span>
                        </div>
                        <div className="fw-semibold text-white fs-6 text-truncate">{c.title}</div>
                        <div className="small text-muted">{timeAgo(c.createdAt)}</div>
                      </div>
                      <div className="flex-shrink-0 text-end">
                        <PriorityBadge priority={c.priority} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

