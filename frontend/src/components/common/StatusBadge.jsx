import { STATUS_META } from '../../utils/constants';

/** Modern 2026 civic status pill with glowing radar indicator. */
export default function StatusBadge({ status, className = '' }) {
  const meta = STATUS_META[status] || { label: status, variant: 'secondary', icon: 'bi-dot' };

  const dotColors = {
    warning: '#f59e0b',
    info: '#00f2fe',
    primary: '#38bdf8',
    success: '#10b981',
    secondary: '#94a3b8',
    danger: '#ef4444',
  };

  const dotColor = dotColors[meta.variant] || '#38bdf8';
  const isPulsing = status === 'PENDING' || status === 'IN_PROGRESS';

  return (
    <span
      className={`status-pill status-${meta.variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          boxShadow: `0 0 8px ${dotColor}`,
          animation: isPulsing ? 'pulse-radar 1.6s infinite' : 'none',
        }}
      />
      {meta.label}
    </span>
  );
}

