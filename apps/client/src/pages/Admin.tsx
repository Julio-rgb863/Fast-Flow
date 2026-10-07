import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';

import api from '../services/api';

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalOrders: number;
  totalRevenue: number;
  totalTicketsSold: number;
  recentOrders?: any[];
}

interface EventItem {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  totalTickets: number;
  soldTickets: number;
  price: number;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count?: {
    orders: number;
  };
}

interface OrderItem {
  id: string;
  quantity: number;
  total: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
    price: number;
  };
}

export default function Admin() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'events' | 'users' | 'orders'>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal / Form state para novo evento
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    totalTickets: 100,
    price: 50,
  });
  const [submittingEvent, setSubmittingEvent] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, isAdmin]);

  const loadData = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const [statsRes, eventsRes, usersRes, ordersRes] = await Promise.all([
        api.get('/admin/dashboard').catch(() => ({ data: null })),
        api.get('/events').catch(() => ({ data: [] })),
        api.get('/admin/users').catch(() => ({ data: [] })),
        api.get('/admin/orders').catch(() => ({ data: [] })),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (eventsRes.data) setEvents(eventsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || t.admin.errorLoading,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingEvent(true);
    setMessage(null);

    try {
      await api.post('/admin/events', {
        ...newEvent,
        totalTickets: Number(newEvent.totalTickets),
        price: Number(newEvent.price),
      });

      setMessage({ text: t.admin.eventCreatedSuccess, type: 'success' });
      setShowModal(false);
      setNewEvent({
        name: '',
        description: '',
        date: '',
        location: '',
        totalTickets: 100,
        price: 50,
      });

      loadData();
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || t.admin.errorCreating,
        type: 'error',
      });
    } finally {
      setSubmittingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string, name: string) => {
    if (!window.confirm(`${t.admin.confirmDeleteEvent} "${name}"?`)) return;

    try {
      await api.delete(`/admin/events/${id}`);
      setMessage({ text: t.admin.eventDeletedSuccess, type: 'success' });
      loadData();
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || t.admin.errorDeleting,
        type: 'error',
      });
    }
  };

  const handlePromoteUser = async (id: string, name: string) => {
    if (!window.confirm(`${t.admin.confirmPromoteUser} "${name}" ${t.admin.confirmPromoteSuffix}`)) return;

    try {
      await api.patch(`/admin/users/${id}/promote`, { role: 'admin' });
      setMessage({ text: `${name} ${t.admin.userPromotedSuccess}`, type: 'success' });
      loadData();
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || t.admin.errorPromoting,
        type: 'error',
      });
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário "${name}"? Esta ação não pode ser desfeita.`)) return;

    try {
      await api.delete(`/admin/users/${id}`);
      setMessage({ text: `Usuário "${name}" excluído com sucesso.`, type: 'success' });
      loadData();
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || 'Erro ao excluir usuário.',
        type: 'error',
      });
    }
  };

  if (!isAdmin && !loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#07080b', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <Logo size={40} />
        <h1 style={{ marginTop: '1.5rem', color: '#f87171', fontSize: '1.35rem', fontWeight: 650 }}>
          {t.admin.restrictedAccess}
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem', textAlign: 'center', maxWidth: '400px', fontSize: '0.88rem' }}>
          {t.admin.restrictedNotice}
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-secondary"
          style={{ marginTop: '1.5rem' }}
        >
          {t.admin.backToHome}
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#07080b', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <header
        style={{
          background: 'rgba(7, 8, 11, 0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          padding: '0.85rem 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Logo size={28} />
            <span style={{ fontSize: '1.05rem', fontWeight: 650, letterSpacing: '-0.02em', color: '#f8fafc' }}>
              FastFlow
            </span>
            <span className="status-pill status-pill-indigo" style={{ marginLeft: '0.35rem' }}>
              Admin
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <LanguageSwitcher />
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              {user?.name}
            </span>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
            >
              {t.admin.backToSite}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%', padding: '2rem 1.5rem', flex: 1 }}>
        {/* Banner de Feedback */}
        {message && (
          <div
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
              color: message.type === 'success' ? '#34d399' : '#f87171',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem',
            }}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0.2rem' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation (Segmented pill bar) */}
        <div
          style={{
            display: 'inline-flex',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '3px',
            gap: '3px',
            marginBottom: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 550,
              fontSize: '0.85rem',
              background: activeTab === 'dashboard' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activeTab === 'dashboard' ? '#f8fafc' : '#64748b',
              transition: 'all 0.15s ease',
            }}
          >
            {t.admin.overview}
          </button>
          <button
            onClick={() => setActiveTab('events')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 550,
              fontSize: '0.85rem',
              background: activeTab === 'events' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activeTab === 'events' ? '#f8fafc' : '#64748b',
              transition: 'all 0.15s ease',
            }}
          >
            {t.admin.manageEvents} ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 550,
              fontSize: '0.85rem',
              background: activeTab === 'orders' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activeTab === 'orders' ? '#f8fafc' : '#64748b',
              transition: 'all 0.15s ease',
            }}
          >
            {t.admin.allOrders} ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 550,
              fontSize: '0.85rem',
              background: activeTab === 'users' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activeTab === 'users' ? '#f8fafc' : '#64748b',
              transition: 'all 0.15s ease',
            }}
          >
            {t.admin.users} ({users.length})
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <Spinner size="md" color="#ffffff" label={t.admin.loadingData} />
          </div>
        ) : (
          <>
            {/* TAB DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                  <div style={{ background: '#0d0f15', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.25rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{t.admin.totalUsers}</span>
                    <h2 className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.5rem', margin: 0 }}>
                      {stats?.totalUsers ?? users.length}
                    </h2>
                  </div>

                  <div style={{ background: '#0d0f15', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.25rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{t.admin.totalEvents}</span>
                    <h2 className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.5rem', margin: 0 }}>
                      {stats?.totalEvents ?? events.length}
                    </h2>
                  </div>

                  <div style={{ background: '#0d0f15', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.25rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{t.admin.totalOrders}</span>
                    <h2 className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.5rem', margin: 0 }}>
                      {stats?.totalOrders ?? orders.length}
                    </h2>
                  </div>

                  <div style={{ background: '#0d0f15', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.25rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{t.admin.ticketsSold}</span>
                    <h2 className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.5rem', margin: 0 }}>
                      {stats?.totalTicketsSold ?? 0}
                    </h2>
                  </div>

                  <div style={{ background: '#0d0f15', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.25rem' }}>
                    <span style={{ color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>{t.admin.totalRevenue}</span>
                    <h2 className="tabular-nums" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.5rem', margin: 0 }}>
                      {language === 'en' ? '$' : 'R$'} {(stats?.totalRevenue ?? 0).toLocaleString(language === 'en' ? 'en-US' : 'pt-BR', { minimumFractionDigits: 2 })}
                    </h2>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div style={{ background: '#0d0f15', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: '#f8fafc' }}>{t.admin.quickActions}</h3>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => { setActiveTab('events'); setShowModal(true); }}
                      className="btn-primary"
                    >
                      + {t.admin.newEventBtn}
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="btn-secondary"
                    >
                      {t.admin.viewAllOrdersBtn}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB EVENTOS */}
            {activeTab === 'events' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 650, color: '#f8fafc', margin: 0 }}>{t.admin.eventsListTitle}</h2>
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary"
                  >
                    + {t.admin.newEventModalBtn}
                  </button>
                </div>

                <div style={{ overflowX: 'auto', background: '#0d0f15', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b' }}>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableName}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableDate}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableLocation}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tablePrice}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableTickets}</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 600 }}>{t.admin.tableActions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((ev) => (
                        <tr key={ev.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#f8fafc' }}>{ev.name}</td>
                          <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>
                            {new Date(ev.date).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{ev.location}</td>
                          <td className="tabular-nums" style={{ padding: '0.85rem 1rem', color: '#f8fafc', fontWeight: 600 }}>
                            {language === 'en' ? '$' : 'R$'} {ev.price.toFixed(2)}
                          </td>
                          <td className="tabular-nums" style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>
                            <span style={{ color: '#f8fafc', fontWeight: 600 }}>{ev.soldTickets}</span> / {ev.totalTickets}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteEvent(ev.id, ev.name)}
                              className="btn-secondary"
                              style={{
                                padding: '0.35rem 0.65rem',
                                color: '#f87171',
                                borderColor: 'rgba(239, 68, 68, 0.25)',
                                fontSize: '0.75rem',
                              }}
                            >
                              {t.admin.deleteBtn}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB PEDIDOS */}
            {activeTab === 'orders' && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 650, color: '#f8fafc', marginBottom: '1.5rem' }}>{t.admin.allOrders}</h2>
                <div style={{ overflowX: 'auto', background: '#0d0f15', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b' }}>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableOrderId}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableCustomer}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableEvent}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableQty}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableTotal}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableStatus}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableDate}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: '#64748b', fontSize: '0.78rem' }}>
                            #{ord.id.slice(0, 8)}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ fontWeight: 600, color: '#f8fafc' }}>{ord.user?.name || t.admin.anonymous}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{ord.user?.email}</div>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{ord.event?.name}</td>
                          <td style={{ padding: '0.85rem 1rem', color: '#f8fafc' }}>{ord.quantity}</td>
                          <td className="tabular-nums" style={{ padding: '0.85rem 1rem', color: '#f8fafc', fontWeight: 600 }}>
                            {language === 'en' ? '$' : 'R$'} {ord.total.toFixed(2)}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            {ord.status === 'paid' || ord.status === 'approved' ? (
                              <span className="status-pill status-pill-emerald">Confirmado</span>
                            ) : ord.status === 'cancelled' ? (
                              <span className="status-pill" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>Cancelado</span>
                            ) : (
                              <span className="status-pill status-pill-amber">{ord.status}</span>
                            )}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>
                            {new Date(ord.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB USUÁRIOS */}
            {activeTab === 'users' && (
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 650, color: '#f8fafc', marginBottom: '1.5rem' }}>{t.admin.users}</h2>
                <div style={{ overflowX: 'auto', background: '#0d0f15', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#64748b' }}>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableName}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableEmail}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableRole}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableOrdersCount}</th>
                        <th style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{t.admin.tableCreatedAt}</th>
                        <th style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 600 }}>{t.admin.tableActions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#f8fafc' }}>{u.name}</td>
                          <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{u.email}</td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <span className={u.role === 'admin' ? 'status-pill status-pill-indigo' : 'status-pill'} style={u.role !== 'admin' ? { background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' } : {}}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="tabular-nums" style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{u._count?.orders ?? 0}</td>
                          <td style={{ padding: '0.85rem 1rem', color: '#64748b' }}>
                            {new Date(u.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR')}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              {u.role !== 'admin' ? (
                                <button
                                  onClick={() => handlePromoteUser(u.id, u.name)}
                                  className="btn-secondary"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                >
                                  {t.admin.promoteToAdminBtn}
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Admin</span>
                              )}
                              {u.role !== 'admin' && u.id !== user?.id && (
                                <button
                                  onClick={() => handleDeleteUser(u.id, u.name)}
                                  className="btn-secondary"
                                  style={{
                                    padding: '0.35rem 0.65rem',
                                    color: '#f87171',
                                    borderColor: 'rgba(239, 68, 68, 0.25)',
                                    fontSize: '0.75rem',
                                  }}
                                >
                                  Excluir
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Criar Evento */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 200,
          }}
        >
          <div
            style={{
              background: '#0d0f15',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              padding: '1.75rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 650, color: '#f8fafc', margin: 0 }}>{t.admin.createEventTitle}</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.2rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>{t.admin.eventNameLabel}</label>
                <input
                  type="text"
                  required
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  className="saas-input"
                  placeholder={t.admin.eventNamePlaceholder}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>{t.admin.descriptionLabel}</label>
                <textarea
                  required
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="saas-input"
                  style={{ resize: 'vertical' }}
                  placeholder={t.admin.descriptionPlaceholder}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>{t.admin.dateTimeLabel}</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="saas-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>{t.admin.locationLabel}</label>
                  <input
                    type="text"
                    required
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="saas-input"
                    placeholder={t.admin.locationPlaceholder}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>{t.admin.totalTicketsLabel}</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newEvent.totalTickets}
                    onChange={(e) => setNewEvent({ ...newEvent, totalTickets: Number(e.target.value) })}
                    className="saas-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem', fontWeight: 500 }}>{t.admin.unitPriceLabel}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={newEvent.price}
                    onChange={(e) => setNewEvent({ ...newEvent, price: Number(e.target.value) })}
                    className="saas-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  {t.admin.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={submittingEvent}
                  className="btn-primary"
                >
                  {submittingEvent ? t.admin.savingBtn : t.admin.saveEventBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
