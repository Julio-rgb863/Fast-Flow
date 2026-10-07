interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
}

export default function Spinner({ size = 'md', color = '#ffffff', label }: SpinnerProps) {
  const dimensions = size === 'sm' ? 14 : size === 'lg' ? 36 : 22;
  const strokeWidth = size === 'sm' ? 2 : 2.5;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <svg
        width={dimensions}
        height={dimensions}
        viewBox="0 0 24 24"
        style={{
          animation: 'spin 0.65s linear infinite',
          flexShrink: 0,
        }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      {label && (
        <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>
          {label}
        </span>
      )}
    </div>
  );
}
