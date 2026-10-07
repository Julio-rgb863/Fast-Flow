import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Logo from '../components/Logo';
import TicketModal, { type TicketOrder } from '../components/TicketModal';
import ScrollReveal from '../components/ScrollReveal';
import Spinner from '../components/Spinner';
import api from '../services/api';

interface Order extends TicketOrder {}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<TicketOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { isAuthenticated, user, logout } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    api.get('/orders/my-orders')
      .then(({ data }) => {
        setOrders(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isAuthenticated, navigate]);

  async function handleCancel(id: string) {
    if (!window.confirm(t.orders.confirmCancel)) return;
    setCancellingId(id);
    try {
      await api.patch(`/orders/${id}/cancel`);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
    } catch (err: any) {
      alert(err.response?.data?.message || t.orders.cancelError);
    } finally {
      setCancellingId(null);
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
        <div onClick={() => navigate('/')} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <Logo size={32} />
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #c084fc, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FastFlow
          </span>
        </div>

        {/* Desktop */}
        <div className="orders-desktop-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <LanguageSwitcher />
          <span style={{ color: '#a855f7', fontSize: '0.9rem' }}>{t.nav.hello}, {user?.name}!</span>
          <button onClick={() => navigate('/')} className="btn-outline" style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
            {t.nav.home}
          </button>
          <button onClick={logout} className="btn-danger" style={{ padding: '0.5rem 1rem', background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
            {t.nav.logout}
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
        <div className="animate-fadeInDown" style={{
          background: 'rgba(12,12,20,0.98)',
          borderBottom: '1px solid #2d1b69',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#a855f7', fontSize: '0.9rem' }}>{t.nav.hello}, {user?.name}!</span>
            <LanguageSwitcher />
          </div>
          <button onClick={() => { navigate('/'); setMenuOpen(false); }} className="btn-outline" style={{ padding: '0.75rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer' }}>
            {t.nav.home}
          </button>
          <button onClick={() => { logout(); setMenuOpen(false); }} className="btn-danger" style={{ padding: '0.75rem', background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', cursor: 'pointer' }}>
            {t.nav.logout}
          </button>
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        <ScrollReveal animation="up">
          <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {t.orders.title}
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: '0.95rem' }}>
            {t.orders.subtitle}
          </p>
        </ScrollReveal>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 2rem', gap: '1rem' }}>
            <Spinner size="lg" color="#c084fc" label={t.orders.loading} />
          </div>
        ) : orders.length === 0 ? (
          <ScrollReveal animation="scale">
            <div className="glass" style={{ borderRadius: '24px', padding: '3.5rem 1.5rem', textAlign: 'center' }}>
              <div className="animate-float" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎭</div>
              <p style={{ color: '#9ca3af', fontSize: '1.05rem', marginBottom: '1.75rem' }}>{t.orders.noOrders}</p>
              <button onClick={() => navigate('/')} className="btn-purple" style={{ padding: '0.85rem 2.25rem', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                {t.orders.exploreEvents}
              </button>
            </div>
          </ScrollReveal>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order, i) => (
              <ScrollReveal key={order.id} animation="up" delay={(i % 5) * 80}>
                <div className="card-hover" style={{
                  background: 'linear-gradient(135deg, #12121a, #1a1a2e)',
                  border: `1px solid ${order.status === 'cancelled' ? 'rgba(220,38,38,0.25)' : 'rgba(124,58,237,0.3)'}`,
                  borderRadius: '18px',
                  overflow: 'hidden',
                }}>
                  <div className="orders-header" style={{
                    background: order.status === 'cancelled' ? 'rgba(55,65,81,0.5)' : 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                    padding: '1.1rem 1.35rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <h4 style={{ color: '#fff', margin: 0, fontWeight: 'bold', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)' }}>{order.event.name}</h4>
                    <span className="orders-badge" style={{
                      background: order.status === 'cancelled' ? 'rgba(220,38,38,0.2)' : 'rgba(52,211,153,0.2)',
                      color: order.status === 'cancelled' ? '#f87171' : '#34d399',
                      border: `1px solid ${order.status === 'cancelled' ? 'rgba(220,38,38,0.3)' : 'rgba(52,211,153,0.3)'}`,
                      padding: '0.3rem 0.85rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}>
                      {order.status === 'cancelled' ? t.orders.cancelled : t.orders.confirmed}
                    </span>
                  </div>

                  <div style={{ padding: '1.35rem' }}>
                    <div className="orders-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
                      <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem' }}>📅 {new Date(order.event.date).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR')}</p>
                      <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem' }}>📍 {order.event.location}</p>
                      <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem' }}>🎟 {order.quantity} {t.orders.ticketsQty}</p>
                      <p style={{ color: '#c084fc', margin: 0, fontWeight: 'bold', fontSize: '0.95rem' }}>💰 {language === 'en' ? '$' : 'R$'} {order.total.toFixed(2)}</p>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: order.status !== 'cancelled' ? '1.25rem' : '0' }}>
                      {t.orders.orderedOn} {new Date(order.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR')}
                    </p>

                    {order.status !== 'cancelled' && (
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="btn-purple"
                          style={{
                            padding: '0.65rem 1.35rem',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          🎟️ {t.orders.viewTicket}
                        </button>
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancellingId === order.id}
                          className="btn-danger"
                          style={{
                            padding: '0.65rem 1.25rem',
                            background: 'rgba(220,38,38,0.1)',
                            color: '#f87171',
                            border: '1px solid rgba(220,38,38,0.3)',
                            borderRadius: '10px',
                            cursor: cancellingId === order.id ? 'not-allowed' : 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          {cancellingId === order.id ? (
                            <>
                              <Spinner size="sm" color="#f87171" />
                              <span>Cancelando...</span>
                            </>
                          ) : (
                            t.orders.cancelOrder
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      {/* Modal do Ingresso Digital */}
      {selectedOrder && (
        <TicketModal
          order={selectedOrder}
          userName={user?.name}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}