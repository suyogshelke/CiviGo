import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Modern interactive dark/light mode toggle button with micro-animations.
 */
export default function ThemeToggle({ showLabel = false, className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    setAnimating(true);
    toggleTheme();
    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`theme-toggle-btn d-inline-flex align-items-center justify-content-center gap-2 ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      style={{
        width: showLabel ? 'auto' : 40,
        height: 40,
        padding: showLabel ? '0 14px' : 0,
        borderRadius: 999,
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.06)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.12)'}`,
        color: isDark ? '#f8fafc' : '#0f172a',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.06)';
        e.currentTarget.style.boxShadow = isDark
          ? '0 0 16px rgba(245, 158, 11, 0.35)'
          : '0 0 16px rgba(2, 132, 199, 0.35)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: animating ? 'rotate(360deg) scale(1.2)' : 'rotate(0deg) scale(1)',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {isDark ? (
          <i className="bi bi-sun-fill text-warning fs-5" />
        ) : (
          <i className="bi bi-moon-stars-fill text-primary fs-5" />
        )}
      </span>

      {showLabel && (
        <span className="small fw-semibold" style={{ fontSize: '0.8rem' }}>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
