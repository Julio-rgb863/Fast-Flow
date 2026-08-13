import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import api from '../services/api';

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  totalTickets: number;
  soldTickets: number;
  price: number;
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/events/${id}`).then(({ data }) => {
      setEvent(data);
      setLoading(false);
    });
  }, [id]);

  async function handleBuy() {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBuying(true);
    setError('');
    try {
      await api.post('/orders', { eventId: id, quantity });
      setSuccess(`✅ Compra realizada! ${quantity} ingresso(s) adquirido(s).`);
      setEvent(prev => prev ? { ...prev, soldTickets: prev.soldTickets + quantity } : prev);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao realizar compra');
    } finally {
      setBuying(false);
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="animate-float" style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
        <p style={{ color: '#a855f7' }}>Carregando evento...</p>
      </div>
    </div>
  );

  if (!event) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#a855f7' }}>Evento não encontrado.</p>
    </div>
  );

  const disponiveis = event.totalTickets - event.soldTickets;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>
      {/* Navbar */}
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
        <button onClick={() => navigate('/')} style={{ padding: '0.5rem 1.25rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer' }}>
          ← Voltar
        </button>
      </nav>

      {/* Hero do evento */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0533 0%, #2d0a6e 50%, #1a0533 100%)',
        padding: '3rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '300px', background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div className="animate-fadeInUp" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{event.name}</h1>
          <p style={{ color: '#c084fc', fontSize: '1rem' }}>📍 {event.location}</p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1.5rem' }}>
        <div className="animate-fadeInUp glass" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 0 60px rgba(124,58,237,0.15)' }}>
          <div style={{ padding: '2rem' }}>
            <p style={{ color: '#9ca3af', lineHeight: 1.7, marginBottom: '2rem', fontSize: '1rem' }}>{event.description}</p>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { icon: '📅', label: 'Data', value: new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) },
                { icon: '📍', label: 'Local', value: event.location },
                { icon: '🎟', label: 'Disponíveis', value: `${disponiveis} ingressos`, color: disponiveis > 0 ? '#34d399' : '#f87171' },
                { icon: '💰', label: 'Preço', value: `R$ ${event.price.toFixed(2)}`, color: '#a855f7' },
              ].map((item, i) => (
                <div key={i} className={`animate-fadeInUp delay-${(i + 1) * 100}`} style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '12px', padding: '1rem' }}>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{item.icon} {item.label}</p>
                  <p style={{ fontWeight: 'bold', color: item.color || '#fff', fontSize: '1rem' }}>{item.value}</p>
                </div>
              ))}
            </div>

            {success && (
              <div className="animate-fadeIn" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', color: '#34d399', textAlign: 'center' }}>
                {success}
              </div>
            )}

            {error && (
              <div className="animate-fadeIn" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', color: '#f87171', textAlign: 'center' }}>
                {error}
              </div>
            )}

            {disponiveis > 0 && !success && (
              <div className="animate-fadeInUp delay-400" style={{ borderTop: '1px solid rgba(124,58,237,0.2)', paddingTop: '1.5rem' }}>
                <h3 style={{ color: '#c084fc', marginBottom: '1rem', fontSize: '1.1rem' }}>⚡ Comprar Ingressos</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <label style={{ color: '#9ca3af' }}>Quantidade:</label>
                  <input
                    type="number"
                    min={1}
                    max={disponiveis}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={{ width: '80px', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '8px', color: '#fff', textAlign: 'center', outline: 'none' }}
                  />
                </div>
                <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                  Total: <strong style={{ color: '#a855f7', fontSize: '1.2rem' }}>R$ {(event.price * quantity).toFixed(2)}</strong>
                </p>
                <button
                  onClick={handleBuy}
                  disabled={buying}
                  className="btn-purple animate-pulse-glow"
                  style={{ width: '100%', padding: '1rem', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: buying ? 'not-allowed' : 'pointer', letterSpacing: '0.05em' }}
                >
                  {buying ? '⚡ Processando...' : '🎟 Comprar Ingresso'}
                </button>
              </div>
            )}

            {disponiveis === 0 && (
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: '12px' }}>
                <p style={{ color: '#f87171', fontWeight: 'bold', fontSize: '1.1rem' }}>❌ Ingressos esgotados!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );}
