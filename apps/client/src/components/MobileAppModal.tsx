import { useState, useEffect } from 'react';
import { SmartphoneIcon, DownloadIcon, CloseIcon, CheckIcon } from './Icons';

export default function MobileAppModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Escuta evento nativo de PWA Install prompt no Android / Chrome
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Checa se já está rodando como standalone/app instalado
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setIsOpen(false);
      }
      setDeferredPrompt(null);
    } else {
      // Instruções para iOS / navegadores sem prompt automático
      alert('📱 Para instalar no celular:\n\n• No iPhone (Safari): Toque no botão de Compartilhar e selecione "Adicionar à Tela de Início".\n• No Android (Chrome): Toque nos 3 pontinhos e selecione "Instalar aplicativo" ou "Adicionar à tela inicial".');
    }
  };

  return (
    <>
      {/* Botão de Atalho Elegante no Header ou Seção */}
      <button
        onClick={() => setIsOpen(true)}
        className="btn-secondary"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.8rem',
          padding: '0.45rem 0.85rem',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          background: 'rgba(99, 102, 241, 0.08)',
          color: '#c7d2fe',
        }}
        title="Baixar App FastFlow para Celular"
      >
        <SmartphoneIcon size={14} color="#818cf8" />
        <span>Baixar App</span>
      </button>

      {/* Modal do Aplicativo Mobile */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div
            className="animate-fadeInUp"
            style={{
              width: '100%',
              maxWidth: '430px',
              background: '#0d0f15',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '16px',
              padding: '1.75rem',
              boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.85)',
              position: 'relative',
            }}
          >
            {/* Fechar */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
              }}
            >
              <CloseIcon size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: '#12141c',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)',
                }}
              >
                <SmartphoneIcon size={28} color="#818cf8" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
                FastFlow no seu Celular
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                Acesse seus ingressos offline na portaria, receba notificações e compre sem filas.
              </p>
            </div>

            {/* Benefícios */}
            <div
              style={{
                background: '#07080b',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                fontSize: '0.82rem',
                color: '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckIcon size={16} color="#34d399" />
                <span>Ingressos e QR Codes salvos direto no aparelho</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckIcon size={16} color="#34d399" />
                <span>Carregamento ultrarrápido sem barra de navegador</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckIcon size={16} color="#34d399" />
                <span>Compatível com Android, iPhone (iOS) e Tablets</span>
              </div>
            </div>

            {/* Ações */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={handleInstallClick}
                className="btn-primary"
                style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem' }}
              >
                <DownloadIcon size={16} />
                <span>{isInstalled ? 'Aplicativo Instalado ✅' : 'Instalar Aplicativo'}</span>
              </button>

              <p style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', margin: 0 }}>
                💡 Não consome memória da Play Store/App Store. Instalação instantânea PWA.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
