/** Standard page title block with an optional actions slot on the right. */
export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="page-head mb-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
      <div>
        {eyebrow && (
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="live-dot" />
            <span className="cp-eyebrow text-cyan">{eyebrow}</span>
          </div>
        )}
        <h1 className="h2 fw-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        {subtitle && <p className="subtitle small mb-0" style={{ color: 'var(--cp-text-muted)' }}>{subtitle}</p>}
      </div>
      {actions && <div className="d-flex gap-2 flex-wrap align-items-center">{actions}</div>}
    </div>
  );
}

