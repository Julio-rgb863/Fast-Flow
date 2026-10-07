import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Logo from '../components/Logo';
import TicketModal, { type TicketOrder } from '../components/TicketModal';
import ScrollReveal from '../components/ScrollReveal';
import Spinner from '../components/Spinner';
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  QrCodeIcon,
} from '../components/Icons';
import api from '../services/api';

interface Order extends TicketOrder {}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<TicketOrder | null>(null);
  const [loading, setLoading] = useState(true);
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
        <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          >
            <Logo size={28} />
            <span style={{ fontSize: '1.05rem', fontWeight: 650, letterSpacing: '-0.02em', color: '#f8fafc' }}>
              FastFlow
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <LanguageSwitcher />
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              {user?.name}
            </span>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
            >
              Eventos
            </button>
            <button
              onClick={logout}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            >
              {t.nav.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '960px', margin: '2.5rem auto 5rem auto', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, letterSpacing: '-0.025em', color: '#f8fafc', margin: '0 0 0.35rem 0' }}>
            {t.orders.title}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
            Gerencie seus ingressos digitais e histórico de compras
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <Spinner size="md" color="#ffffff" label="Carregando pedidos..." />
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              background: '#0d0f15',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '4rem 1.5rem',
              textAlign: 'center',
            }}
          >
            <div style={{ color: '#64748b', marginBottom: '0.75rem' }}>
              <TicketIcon size={32} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.25rem' }}>
              Nenhum ingresso encontrado
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Você ainda não realizou compras de ingressos na sua conta.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
              style={{ padding: '0.65rem 1.35rem', fontSize: '0.85rem' }}
            >
              Explorar eventos disponíveis
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order, i) => {
              const isCancelled = order.status === 'cancelled';
              const eventDate = new Date(order.event.date);

              return (
                <ScrollReveal key={order.id} animation="up" delay={(i % 6) * 50}>
                  <div
                    style={{
                      background: '#0d0f15',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '1.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <span
                          className="tabular-nums"
                          style={{
                            fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                          }}
                        >
                          #{order.id.slice(0, 8)}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          Comprado em {new Date(order.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR')}
                        </span>
                      </div>

                      {isCancelled ? (
                        <span className="status-pill" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                          Cancelado
                        </span>
                      ) : (
                        <span className="status-pill status-pill-emerald">
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                          Confirmado
                        </span>
                      )}
                    </div>

                    {/* Middle Info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 650, color: '#f8fafc', margin: '0 0 0.5rem 0', letterSpacing: '-0.015em' }}>
                          {order.event.name}
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <CalendarIcon size={14} color="#64748b" />
                            {eventDate.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MapPinIcon size={14} color="#64748b" />
                            {order.event.location}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <TicketIcon size={14} color="#64748b" />
                            {order.quantity} {t.orders.ticketsQty}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Valor pago</span>
                        <span className="tabular-nums" style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
                          {language === 'en' ? `$ ${order.total.toFixed(2)}` : `R$ ${order.total.toFixed(2)}`}
                        </span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    {!isCancelled && (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          gap: '0.75rem',
                          paddingTop: '0.85rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancellingId === order.id}
                          className="btn-secondary"
                          style={{
                            fontSize: '0.8rem',
                            padding: '0.45rem 0.85rem',
                            color: '#f87171',
                            borderColor: 'rgba(239, 68, 68, 0.25)',
                          }}
                        >
                          {cancellingId === order.id ? <Spinner size="sm" color="#f87171" /> : t.orders.cancelOrder}
                        </button>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="btn-primary"
                          style={{ fontSize: '0.82rem', padding: '0.45rem 0.95rem' }}
                        >
                          <QrCodeIcon size={15} />
                          <span>{t.orders.viewTicket}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </main>

      {/* Ticket Modal */}
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