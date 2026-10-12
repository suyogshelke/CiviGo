/**
 * Modern CiviGo vector brandmark: glowing smart-city beacon glyph in cyber-rounded tile.
 */
export default function BrandMark({ size = 36 }) {
  return (
    <span
      className="brand-mark"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        background: 'linear-gradient(135deg, #0284C7 0%, #00F2FE 100%)',
        display: 'inline-grid',
        placeItems: 'center',
        boxShadow: '0 0 16px rgba(0, 242, 254, 0.4)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M2 13h3.5l2-5.5 4 11 3-8 2 2.5h5.5"
          fill="none"
          stroke="#070B14"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
