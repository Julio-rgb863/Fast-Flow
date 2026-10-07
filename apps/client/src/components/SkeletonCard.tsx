export default function SkeletonCard() {
  return (
    <div
      style={{
        background: '#0d0f15',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '12px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton-box" style={{ height: '18px', width: '35%', borderRadius: '4px' }} />
        <div className="skeleton-box" style={{ height: '18px', width: '22%', borderRadius: '999px' }} />
      </div>

      <div className="skeleton-box" style={{ height: '22px', width: '80%', borderRadius: '4px', margin: '0.25rem 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="skeleton-box" style={{ height: '14px', width: '60%', borderRadius: '4px' }} />
        <div className="skeleton-box" style={{ height: '14px', width: '50%', borderRadius: '4px' }} />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          marginTop: 'auto',
        }}
      >
        <div className="skeleton-box" style={{ height: '22px', width: '25%', borderRadius: '4px' }} />
        <div className="skeleton-box" style={{ height: '32px', width: '35%', borderRadius: '6px' }} />
      </div>
    </div>
  );
}
