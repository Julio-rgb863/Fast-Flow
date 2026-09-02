import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import api from '../services/api';

interface Order {
  id: string;
  quantity: number;
  total: number;
  status: string;
  createdAt: string;
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
    price: number;
  };
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    api.get('/orders/my-orders').then(({ data }) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  async function handleCancel(id: string) {
    try {
      await api.patch(`/orders/${id}/cancel`);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao cancelar pedido');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>
      <style>{`
        @media (max-width: 768px) {
          .orders-desktop-nav { display: none !important; }
          .orders-mobile-btn { display: block !important; }
          .orders-grid { grid-template-columns: 1fr !important; }
          .orders-header { flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; }
          .orders-badge { font-size: 0.7rem !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        background: 'rgba(12,12,20,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2d1b69',
        padding: '1rem 1.5rem',
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

        {/* Desktop */}
        <div className="orders-desktop-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: '#a855f7', fontSize: '0.9rem' }}>Olá, {user?.name}!</span>
          <button onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
            Início
          </button>
          <button onClick={logout} style={{ padding: '0.5rem 1rem', background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
            Sair
          </button>
        </div>

        {/* Mobile */}
        <button
          className="orders-mobile-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'transparent', border: 'none', color: '#a855f7', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div style={{
          background: 'rgba(12,12,20,0.98)',
          borderBottom: '1px solid #2d1b69',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <span style={{ color: '#a855f7', fontSize: '0.9rem' }}>Olá, {user?.name}!</span>
          <button onClick={() => { navigate('/'); setMenuOpen(false); }} style={{ padding: '0.75rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer' }}>
            Início
          </button>
          <button onClick={() => { logout(); setMenuOpen(false); }} style={{ padding: '0.75rem', background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', cursor: 'pointer' }}>
            Sair
          </button>
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        <h2 className="animate-fadeInUp" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          🎟 Meus Pedidos
        </h2>
        <p className="animate-fadeInUp delay-100" style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Gerencie seus ingressos
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="animate-float" style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
            <p style={{ color: '#a855f7' }}>Carregando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="animate-fadeInUp glass" style={{ borderRadius: '20px', padding: '3rem 1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</p>
            <p style={{ color: '#9ca3af', fontSize: '1rem', marginBottom: '1.5rem' }}>Você ainda não tem pedidos.</p>
            <button onClick={() => navigate('/')} className="btn-purple" style={{ padding: '0.75rem 2rem', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
              Ver Eventos ⚡
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order, i) => (
              <div key={order.id} className={`animate-fadeInUp delay-${(i % 5) * 100}`} style={{
                background: 'linear-gradient(135deg, #12121a, #1a1a2e)',
                border: `1px solid ${order.status === 'cancelled' ? 'rgba(220,38,38,0.2)' : 'rgba(124,58,237,0.2)'}`,
                borderRadius: '16px',
                overflow: 'hidden',
              }}>
                <div className="orders-header" style={{
                  background: order.status === 'cancelled' ? 'rgba(55,65,81,0.5)' : 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <h4 style={{ color: '#fff', margin: 0, fontWeight: 'bold', fontSize: 'clamp(0.875rem, 2.5vw, 1rem)' }}>{order.event.name}</h4>
                  <span className="orders-badge" style={{
                    background: order.status === 'cancelled' ? 'rgba(220,38,38,0.2)' : 'rgba(52,211,153,0.2)',
                    color: order.status === 'cancelled' ? '#f87171' : '#34d399',
                    border: `1px solid ${order.status === 'cancelled' ? 'rgba(220,38,38,0.3)' : 'rgba(52,211,153,0.3)'}`,
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                  }}>
                    {order.status === 'cancelled' ? '❌ Cancelado' : '✅ Confirmado'}
                  </span>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <div className="orders-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.85rem' }}>📅 {new Date(order.event.date).toLocaleDateString('pt-BR')}</p>
                    <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.85rem' }}>📍 {order.event.location}</p>
                    <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.85rem' }}>🎟 {order.quantity} ingresso(s)</p>
                    <p style={{ color: '#a855f7', margin: 0, fontWeight: 'bold', fontSize: '0.85rem' }}>💰 R$ {order.total.toFixed(2)}</p>
                  </div>
                  <p style={{ color: '#4b5563', fontSize: '0.8rem', marginBottom: order.status !== 'cancelled' ? '1rem' : '0' }}>
                    Pedido em {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>

                  {order.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      style={{ padding: '0.5rem 1.25rem', background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}
                    >
                      Cancelar Pedido
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}