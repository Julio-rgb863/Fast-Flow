import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import api from '../services/api';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total, eventName, quantity } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePayment() {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/stripe/checkout', { orderId });
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>
      <nav style={{
        background: 'rgba(12,12,20,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2d1b69',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <Logo size={32} />
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #c084fc, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FastFlow
          </span>
        </div>
        <button onClick={() => navigate(-1)} style={{ padding: '0.5rem 1.25rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer' }}>
          ← Voltar
        </button>
      </nav>

      <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1.5rem' }}>
        <div className="animate-fadeInUp glass" style={{ borderRadius: '20px', padding: '2rem', boxShadow: '0 0 60px rgba(124,58,237,0.15)' }}>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="animate-float" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💳</div>
            <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Finalizar Pagamento</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{eventName}</p>
          </div>

          <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#9ca3af' }}>Quantidade:</span>
              <span style={{ color: '#fff' }}>{quantity} ingresso(s)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9ca3af' }}>Total:</span>
              <span style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '1.2rem' }}>R$ {total?.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', color: '#f87171', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading}
            className="btn-purple animate-pulse-glow"
            style={{ width: '100%', padding: '1rem', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '⚡ Processando...' : '💳 Pagar com Cartão'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#6b7280', fontSize: '0.8rem' }}>
            🔒 Pagamento seguro via Stripe
          </p>
        </div>
      </div>
    </div>
  );
}