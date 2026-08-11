  import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando...</p>;
  if (!event) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Evento não encontrado.</p>;

  const disponíveis = event.totalTickets - event.soldTickets;

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Navbar */}
      <nav style={{ background: '#1e40af', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#fff', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>🎉 FastFlow</h1>
        <button onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: '#fff', color: '#1e40af', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          ← Voltar
        </button>
      </nav>

      <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ background: '#1e40af', padding: '2rem', color: '#fff' }}>
            <h2 style={{ margin: 0 }}>{event.name}</h2>
          </div>

          <div style={{ padding: '2rem' }}>
            <p style={{ color: '#374151', marginBottom: '1rem', fontSize: '1rem' }}>{event.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>📅 Data</p>
                <p style={{ fontWeight: 'bold', margin: '0.25rem 0 0', color: '#374151' }}>
                  {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>📍 Local</p>
                <p style={{ fontWeight: 'bold', margin: '0.25rem 0 0', color: '#374151' }}>{event.location}</p>
              </div>
              <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>🎟 Disponíveis</p>
                <p style={{ fontWeight: 'bold', margin: '0.25rem 0 0', color: disponíveis > 0 ? '#059669' : '#dc2626' }}>
                  {disponíveis} ingressos
                </p>
              </div>
              <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>💰 Preço</p>
                <p style={{ fontWeight: 'bold', margin: '0.25rem 0 0', color: '#1e40af', fontSize: '1.2rem' }}>
                  R$ {event.price.toFixed(2)}
                </p>
              </div>
            </div>

            {success && <p style={{ color: '#059669', background: '#d1fae5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{success}</p>}
            {error && <p style={{ color: '#dc2626', background: '#fee2e2', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</p>}

            {disponíveis > 0 && !success && (
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <h3 style={{ color: '#374151', marginBottom: '1rem' }}>Comprar Ingressos</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <label style={{ color: '#374151' }}>Quantidade:</label>
                  <input
                    type="number"
                    min={1}
                    max={disponíveis}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={{ width: '80px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #d1d5db', textAlign: 'center' }}
                  />
                </div>
                <p style={{ color: '#374151', marginBottom: '1rem' }}>
                  Total: <strong style={{ color: '#1e40af' }}>R$ {(event.price * quantity).toFixed(2)}</strong>
                </p>
                <button
                  onClick={handleBuy}
                  disabled={buying}
                  style={{ width: '100%', padding: '0.875rem', background: '#1e40af', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
                >
                  {buying ? 'Processando...' : '🎟 Comprar Ingresso'}
                </button>
              </div>
            )}

            {disponíveis === 0 && (
              <p style={{ textAlign: 'center', color: '#dc2626', fontWeight: 'bold', fontSize: '1.1rem' }}>
                ❌ Ingressos esgotados!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
