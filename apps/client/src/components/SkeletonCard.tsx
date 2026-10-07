export default function SkeletonCard() {
  return (
    <div
      className="skeleton-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #12121a, #1a1a2e)',
        border: '1px solid #2d1b69',
      }}
    >
      {/* Header banner shimmer */}
      <div className="sk-header" style={{ height: '70px' }} />

      {/* Body content shimmer */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div className="skeleton" style={{ height: '14px', width: '85%' }} />
        <div className="skeleton" style={{ height: '14px', width: '60%' }} />
        <div className="skeleton" style={{ height: '14px', width: '45%' }} />

        {/* Footer info & button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '0.5rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(124, 58, 237, 0.1)',
          }}
        >
          <div className="skeleton" style={{ height: '22px', width: '70px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ height: '34px', width: '100px', borderRadius: '8px' }} />
        </div>
      </div>
    </div>
  );
}
