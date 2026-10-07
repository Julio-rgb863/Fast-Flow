import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';
import { ShieldCheckIcon, ArrowRightIcon } from '../components/Icons';
import api from '../services/api';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { orderId, total, eventName, quantity } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePayment() {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/stripe/checkout', {
        orderId,
        clientUrl: window.location.origin,
      });
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.response?.data?.message || t.payment.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#07080b', color: '#f8fafc' }}>
      {/* Topbar */}
      <header
        style={{
          background: 'rgba(7, 8, 11, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          padding: '0.85rem 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <Logo size={28} />
            <span style={{ fontSize: '1.05rem', fontWeight: 650, letterSpacing: '-0.02em', color: '#f8fafc' }}>
              FastFlow
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LanguageSwitcher />
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
            >
              {t.payment.back}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '480px', margin: '3.5rem auto 5rem auto', padding: '0 1.5rem' }}>
        <div
          style={{
            background: '#0d0f15',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.8)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                display: 'inline-flex',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '999px',
                padding: '0.35rem 0.75rem',
                color: '#818cf8',
                fontSize: '0.78rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              Checkout Seguro
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
              {t.payment.title}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
              {eventName}
            </p>
          </div>

          {/* Pricing summary */}
          <div
            style={{
              background: '#07080b',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              fontSize: '0.88rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>{t.payment.quantity}:</span>
              <span style={{ color: '#f8fafc', fontWeight: 550 }}>{quantity} {t.payment.ticketsQty}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Processamento:</span>
              <span style={{ color: '#34d399', fontWeight: 500 }}>Gratuito</span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#f8fafc',
                fontWeight: 700,
              }}
            >
              <span>{t.payment.total}:</span>
              <span className="tabular-nums" style={{ fontSize: '1.25rem' }}>
                {language === 'en' ? `$ ${total?.toFixed(2)}` : `R$ ${total?.toFixed(2)}`}
              </span>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                color: '#f87171',
                fontSize: '0.82rem',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', marginBottom: '1.25rem' }}
          >
            {loading ? (
              <Spinner size="sm" color="#090a0f" />
            ) : (
              <>
                <span>{t.payment.payButton}</span>
                <ArrowRightIcon size={16} />
              </>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.78rem' }}>
            <ShieldCheckIcon size={14} color="#34d399" />
            <span>Processamento criptografado via Stripe Payments</span>
          </div>
        </div>
      </main>
    </div>
  );
}