/** Friendly empty-state placeholder with an optional call to action. */
export default function EmptyState({ icon = 'bi-inbox', title, message, action }) {
  return (
    <div
      className="glass-card text-center p-5 rounded-4 d-flex flex-column align-items-center justify-content-center"
      style={{
        border: '1px dashed rgba(56, 189, 248, 0.25)',
        background: 'rgba(8, 14, 26, 0.45)',
        margin: '1.5rem 0',
      }}
    >
      <div
        className="d-flex align-items-center justify-content-center rounded-circle mb-3 position-relative"
        style={{
          width: 72,
          height: 72,
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          color: 'var(--cp-primary)',
          boxShadow: '0 0 24px rgba(56, 189, 248, 0.15)',
        }}
      >
        <i className={`bi ${icon} fs-2`} />
      </div>
      <h5 className="fw-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        {title}
      </h5>
      {message && (
        <p className="small mb-4" style={{ color: 'var(--cp-text-muted)', maxWidth: 440, lineHeight: 1.6 }}>
          {message}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

