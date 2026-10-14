/**
 * Modern 2026 civic radar pulse loader.
 * `full` centres it in a full-height viewport for route loading.
 */
export default function Loader({ full = false, label = 'Syncing civic data…', size = 'md' }) {
  const isSm = size === 'sm';

  const loaderVisual = (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      {/* Concentric glowing radar rings */}
      <div
        className="position-relative d-flex align-items-center justify-content-center"
        style={{
          width: isSm ? 40 : 68,
          height: isSm ? 40 : 68,
        }}
      >
        <div
          className="position-absolute rounded-circle"
          style={{
            inset: 0,
            border: '2px solid rgba(56, 189, 248, 0.4)',
            animation: 'pulse-radar 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
          }}
        />
        <div
          className="position-absolute rounded-circle"
          style={{
            inset: isSm ? 4 : 8,
            border: '2px dashed rgba(0, 242, 254, 0.6)',
            animation: 'spin-slow 6s linear infinite',
          }}
        />
        <div
          className="rounded-circle d-flex align-items-center justify-content-center shadow-lg"
          style={{
            width: isSm ? 18 : 32,
            height: isSm ? 18 : 32,
            background: 'linear-gradient(135deg, var(--cp-primary), var(--cp-accent))',
            boxShadow: '0 0 16px rgba(56, 189, 248, 0.8)',
          }}
        >
          <div
            style={{
              width: isSm ? 6 : 10,
              height: isSm ? 6 : 10,
              background: '#fff',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>

      {label && (
        <div
          className="mt-3 font-monospace small text-center"
          style={{
            color: 'var(--cp-text-muted)',
            letterSpacing: '0.04em',
            fontSize: isSm ? '0.75rem' : '0.85rem',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );

  if (full) {
    return (
      <div
        className="d-flex align-items-center justify-content-center w-100"
        style={{ minHeight: '65vh' }}
      >
        {loaderVisual}
      </div>
    );
  }

  return loaderVisual;
}

