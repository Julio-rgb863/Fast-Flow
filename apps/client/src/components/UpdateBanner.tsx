import { useState } from 'react';
import { SparklesIcon, CloseIcon } from './Icons';

export default function UpdateBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem('fastflow_update_dismissed') !== 'v2.2';
  });

  if (!isVisible) return null;

  const handleDismiss = () => {
    localStorage.setItem('fastflow_update_dismissed', 'v2.2');
    setIsVisible(false);
  };

  return (
    <div
      className="animate-fadeIn"
      style={{
        background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.12) 50%, rgba(99, 102, 241, 0.15) 100%)',
        borderBottom: '1px solid rgba(129, 140, 248, 0.25)',
        padding: '0.45rem 1.25rem',
        position: 'relative',
        zIndex: 110,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.78rem',
          color: '#e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: '#6366f1',
              color: '#ffffff',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <SparklesIcon size={12} color="#ffffff" />
            Nova Atualização
          </span>
          <span style={{ color: '#cbd5e1' }}>
            🎉 <strong>FastFlow v2.2 lançado:</strong> Sessões renovadas com mais segurança, suporte ao App Mobile (PWA) e checkout aprimorado!
          </span>
        </div>

        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0.2rem',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 0.15s',
          }}
          title="Fechar aviso"
        >
          <CloseIcon size={15} />
        </button>
      </div>
    </div>
  );
}
