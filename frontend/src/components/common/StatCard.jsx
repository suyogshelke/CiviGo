import { useState, useRef } from 'react';

/**
 * Modern 2026 KPI Card with 3D perspective tilt, cursor glow, and micro-interactions.
 */
export default function StatCard({ label, value, icon, variant = 'primary', hint, trend }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Variant color mapping for high-contrast neon accents on dark glass
  const colors = {
    primary: { glow: 'rgba(56, 189, 248, 0.25)', border: 'rgba(56, 189, 248, 0.3)', text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' },
    success: { glow: 'rgba(16, 185, 129, 0.25)', border: 'rgba(16, 185, 129, 0.3)', text: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
    warning: { glow: 'rgba(245, 158, 11, 0.25)', border: 'rgba(245, 158, 11, 0.3)', text: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
    danger:  { glow: 'rgba(239, 68, 68, 0.25)',  border: 'rgba(239, 68, 68, 0.3)',  text: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' },
    info:    { glow: 'rgba(0, 242, 254, 0.25)',  border: 'rgba(0, 242, 254, 0.3)',  text: '#00f2fe', bg: 'rgba(0, 242, 254, 0.12)' },
    dark:    { glow: 'rgba(148, 163, 184, 0.2)', border: 'rgba(148, 163, 184, 0.25)', text: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
  }[variant] || { glow: 'rgba(56, 189, 248, 0.25)', border: 'rgba(56, 189, 248, 0.3)', text: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)' };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate normalized rotation (-7 to +7 deg)
    const rotateY = ((x / rect.width) - 0.5) * 14;
    const rotateX = -((y / rect.height) - 0.5) * 14;

    setTilt({ x: rotateX, y: rotateY });
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="glass-card stat-card position-relative overflow-hidden"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${isHovered ? -4 : 0}px)`,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease',
        borderColor: isHovered ? colors.border : 'rgba(255, 255, 255, 0.08)',
        boxShadow: isHovered
          ? `0 14px 35px -8px rgba(0, 0, 0, 0.6), 0 0 25px ${colors.glow}`
          : '0 8px 24px -6px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Dynamic Cursor Light Spot */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${colors.glow} 0%, transparent 65%)`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      <div className="position-relative" style={{ zIndex: 1 }}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="stat-value font-monospace fw-bold text-white mb-1" style={{ fontSize: '2.1rem', letterSpacing: '-0.03em' }}>
              {value}
            </div>
            <div className="stat-label text-uppercase fw-semibold" style={{ color: 'var(--cp-text-muted)', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
              {label}
            </div>
          </div>
          {icon && (
            <div
              className="stat-icon d-flex align-items-center justify-content-center rounded-3 transition-all"
              style={{
                width: 46,
                height: 46,
                background: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.25s ease',
              }}
            >
              <i className={`bi ${icon} fs-5`} />
            </div>
          )}
        </div>

        {(hint || trend) && (
          <div className="mt-3 pt-2.5 border-top d-flex align-items-center justify-content-between small" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
            {trend && (
              <span className={`fw-semibold d-inline-flex align-items-center gap-1 ${trend.dir === 'up' ? 'text-success' : 'text-danger'}`}>
                <i className={`bi ${trend.dir === 'up' ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow'}`} /> {trend.value}
              </span>
            )}
            {hint && <span style={{ color: 'var(--cp-text-muted)', fontSize: '0.78rem' }}>{hint}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

