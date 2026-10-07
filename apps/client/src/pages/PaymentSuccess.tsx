import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { CheckIcon, ArrowRightIcon } from '../components/Icons';
import api from '../services/api';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      api.post('/stripe/confirm', { orderId }).catch(() => {
        // Silencioso se já estiver confirmado
      });
    }

    const timer = setTimeout(() => {
      navigate('/my-orders');
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate, orderId]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#07080b',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
      }}
    >
      <div className="bg-radial-subtle" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div className="bg-grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' }} />

      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#34d399',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <CheckIcon size={28} />
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
            {t.paymentSuccess.title}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
            {t.paymentSuccess.subtitle}
          </p>
        </div>

        <div
          style={{
            background: '#0d0f15',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.75rem',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748b' }}>Status:</span>
            <span style={{ color: '#34d399', fontWeight: 600 }}>Aprovado com sucesso</span>
          </div>

          {orderId && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b' }}>Código do Pedido:</span>
              <span className="tabular-nums" style={{ fontFamily: 'monospace', color: '#94a3b8' }}>
                #{orderId.slice(0, 8)}
              </span>
            </div>
          )}

          <div
            style={{
              marginTop: '1rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.78rem',
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            {t.paymentSuccess.redirecting}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/my-orders')}
            className="btn-primary"
            style={{ flex: 1, padding: '0.75rem' }}
          >
            <span>{t.paymentSuccess.viewOrders}</span>
            <ArrowRightIcon size={14} />
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
            style={{ padding: '0.75rem 1.25rem' }}
          >
            {t.paymentSuccess.backHome}
          </button>
        </div>
      </div>
    </div>
  );
}
