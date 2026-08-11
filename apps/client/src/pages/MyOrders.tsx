 import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Navbar */}
      <nav style={{ background: '#1e40af', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#fff', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/')}>🎉 FastFlow</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ color: '#fff' }}>Olá, {user?.name}!</span>
          <button onClick={() => navigate('/')} style={{ padding: '0.5rem 1rem', background: '#fff', color: '#1e40af', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Início
          </button>
          <button onClick={logout} style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '8px', cursor: 'pointer' }}>
            Sair
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <h2 style={{ color: '#374151', marginBottom: '1.5rem' }}>Meus Pedidos</h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Carregando pedidos...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', background: '#fff', padding: '3rem', borderRadius: '12px' }}>
            <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Você ainda não tem pedidos.</p>
            <button onClick={() => navigate('/')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#1e40af', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Ver Eventos
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ background: order.status === 'cancelled' ? '#6b7280' : '#1e40af', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: '#fff', margin: 0 }}>{order.event.name}</h4>
                  <span style={{ background: order.status === 'cancelled' ? '#374151' : '#059669', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem' }}>
                    {order.status === 'cancelled' ? 'Cancelado' : 'Confirmado'}
                  </span>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                    <p style={{ color: '#6b7280', margin: 0 }}>📅 {new Date(order.event.date).toLocaleDateString('pt-BR')}</p>
                    <p style={{ color: '#6b7280', margin: 0 }}>📍 {order.event.location}</p>
                    <p style={{ color: '#6b7280', margin: 0 }}>🎟 {order.quantity} ingresso(s)</p>
                    <p style={{ color: '#374151', margin: 0, fontWeight: 'bold' }}>💰 R$ {order.total.toFixed(2)}</p>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: 0 }}>
                    Pedido em {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>

                  {order.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'transparent', color: '#dc2626', border: '1px solid #dc2626', borderRadius: '8px', cursor: 'pointer' }}
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
