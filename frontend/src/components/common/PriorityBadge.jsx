import { PRIORITY_META } from '../../utils/constants';

export default function PriorityBadge({ priority, subtle = false, className = '' }) {
  const meta = PRIORITY_META[priority] || { label: priority, variant: 'secondary', icon: 'bi-dash' };

  const styles = {
    danger: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.4)', text: '#fca5a5' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.4)', text: '#fcd34d' },
    primary: { bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.4)', text: '#7dd3fc' },
    secondary: { bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.3)', text: '#cbd5e1' },
  }[meta.variant] || { bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.3)', text: '#cbd5e1' };

  return (
    <span
      className={`d-inline-flex align-items-center gap-1.5 ${className}`}
      style={{
        padding: '3px 9px',
        borderRadius: '6px',
        fontSize: '0.72rem',
        fontWeight: 600,
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.text,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      }}
    >
      <i className={`bi ${meta.icon}`} style={{ fontSize: '0.85em' }} />
      {meta.label}
    </span>
  );
}

