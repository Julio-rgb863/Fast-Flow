import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { CloseIcon, ArrowRightIcon } from '../components/Icons';

export default function PaymentCancel() {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <CloseIcon size={24} />
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#f8fafc', margin: '0 0 0.5rem 0' }}>
            {t.paymentCancel.title}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
            {t.paymentCancel.subtitle}
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
          <p style={{ color: '#f8fafc', fontSize: '0.88rem', fontWeight: 550, margin: '0 0 0.35rem 0' }}>
            {t.paymentCancel.pendingOrder}
          </p>
          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0, lineHeight: 1.4 }}>
            {t.paymentCancel.retryNotice}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/my-orders')}
            className="btn-primary"
            style={{ flex: 1, padding: '0.75rem' }}
          >
            <span>{t.paymentCancel.viewOrders}</span>
            <ArrowRightIcon size={14} />
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
            style={{ padding: '0.75rem 1.25rem' }}
          >
            {t.paymentCancel.backHome}
          </button>
        </div>
      </div>
    </div>
  );
}