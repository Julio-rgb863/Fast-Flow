interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
}

export default function Spinner({ size = 'md', color = '#a855f7', label }: SpinnerProps) {
  const dimensions = size === 'sm' ? 18 : size === 'lg' ? 48 : 32;
  const strokeWidth = size === 'sm' ? 2 : 3;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div
        style={{
          width: dimensions,
          height: dimensions,
          border: `${strokeWidth}px solid rgba(168, 85, 247, 0.2)`,
          borderTopColor: color,
          borderRadius: '50%',
          animation: 'spin 0.75s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          boxShadow: `0 0 16px ${color}33`,
        }}
      />
      {label && (
        <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 500, letterSpacing: '0.02em' }}>
          {label}
        </span>
      )}
    </div>
  );
}
