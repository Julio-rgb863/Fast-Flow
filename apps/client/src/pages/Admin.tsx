import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Logo from '../components/Logo';
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

  if (!isAdmin && !loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <Logo size={48} />
        <h1 style={{ marginTop: '1.5rem', color: '#ef4444', fontSize: '1.75rem' }}>{t.admin.restrictedAccess}</h1>
        <p style={{ color: '#9ca3af', marginTop: '0.5rem', textAlign: 'center', maxWidth: '400px' }}>
          {t.admin.restrictedNotice}
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {t.admin.backToHome}
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Topbar */}
      <header
        style={{
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
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Logo size={32} />
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #c084fc, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FastFlow
          </span>
          <span style={{ background: '#7c3aed', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold', padding: '0.2rem 0.6rem', borderRadius: '12px', marginLeft: '0.5rem' }}>
            {t.admin.adminBadge}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LanguageSwitcher />
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{t.admin.adminUserPrefix} <strong style={{ color: '#c084fc' }}>{user?.name}</strong></span>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '0.5rem 1rem',
              background: '#1a103c',
              border: '1px solid #4c1d95',
              color: '#d8b4fe',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.2s',
            }}
          >
            {t.admin.backToSite}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2rem 1.5rem', flex: 1 }}>
        {/* Banner de Feedback */}
        {message && (
          <div
            style={{
              padding: '0.875rem 1.25rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              background: message.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
              color: message.type === 'success' ? '#4ade80' : '#f87171',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid #2d1b69', paddingBottom: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              background: activeTab === 'dashboard' ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#16132b',
              color: activeTab === 'dashboard' ? '#fff' : '#9ca3af',
              transition: '0.2s',
            }}
          >
            {t.admin.overview}
          </button>
          <button
            onClick={() => setActiveTab('events')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              background: activeTab === 'events' ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#16132b',
              color: activeTab === 'events' ? '#fff' : '#9ca3af',
              transition: '0.2s',
            }}
          >
            {t.admin.manageEvents} ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              background: activeTab === 'orders' ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#16132b',
              color: activeTab === 'orders' ? '#fff' : '#9ca3af',
              transition: '0.2s',
            }}
          >
            {t.admin.allOrders} ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              background: activeTab === 'users' ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : '#16132b',
              color: activeTab === 'users' ? '#fff' : '#9ca3af',
              transition: '0.2s',
            }}
          >
            {t.admin.users} ({users.length})
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
            {t.admin.loadingData}
          </div>
        ) : (
          <>
            {/* TAB DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                  <div style={{ background: '#12111f', border: '1px solid #2d1b69', borderRadius: '12px', padding: '1.5rem' }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{t.admin.totalUsers}</span>
                    <h2 style={{ fontSize: '2rem', color: '#c084fc', marginTop: '0.5rem' }}>{stats?.totalUsers ?? users.length}</h2>
                  </div>
                  <div style={{ background: '#12111f', border: '1px solid #2d1b69', borderRadius: '12px', padding: '1.5rem' }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{t.admin.totalEvents}</span>
                    <h2 style={{ fontSize: '2rem', color: '#38bdf8', marginTop: '0.5rem' }}>{stats?.totalEvents ?? events.length}</h2>
                  </div>
                  <div style={{ background: '#12111f', border: '1px solid #2d1b69', borderRadius: '12px', padding: '1.5rem' }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{t.admin.totalOrders}</span>
                    <h2 style={{ fontSize: '2rem', color: '#facc15', marginTop: '0.5rem' }}>{stats?.totalOrders ?? orders.length}</h2>
                  </div>
                  <div style={{ background: '#12111f', border: '1px solid #2d1b69', borderRadius: '12px', padding: '1.5rem' }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{t.admin.ticketsSold}</span>
                    <h2 style={{ fontSize: '2rem', color: '#4ade80', marginTop: '0.5rem' }}>{stats?.totalTicketsSold ?? 0}</h2>
                  </div>
                  <div style={{ background: '#12111f', border: '1px solid #2d1b69', borderRadius: '12px', padding: '1.5rem' }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{t.admin.totalRevenue}</span>
                    <h2 style={{ fontSize: '2rem', color: '#a855f7', marginTop: '0.5rem' }}>
                      {language === 'en' ? '$' : 'R$'} {(stats?.totalRevenue ?? 0).toLocaleString(language === 'en' ? 'en-US' : 'pt-BR', { minimumFractionDigits: 2 })}
                    </h2>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div style={{ background: '#12111f', border: '1px solid #2d1b69', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#e2e8f0' }}>{t.admin.quickActions}</h3>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => { setActiveTab('events'); setShowModal(true); }}
                      style={{
                        padding: '0.75rem 1.25rem',
                        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
                    >
                      {t.admin.newEventBtn}
                    </button>
                    <button
                      onClick={() => setActiveTab('orders')}
                      style={{
                        padding: '0.75rem 1.25rem',
                        background: '#1e1b4b',
                        color: '#c084fc',
                        border: '1px solid #4c1d95',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                      }}
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
                  <h2 style={{ fontSize: '1.4rem', color: '#e2e8f0' }}>{t.admin.eventsListTitle}</h2>
                  <button
                    onClick={() => setShowModal(true)}
                    style={{
                      padding: '0.65rem 1.25rem',
                      background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                    }}
                  >
                    {t.admin.newEventModalBtn}
                  </button>
                </div>

                <div style={{ overflowX: 'auto', background: '#12111f', borderRadius: '12px', border: '1px solid #2d1b69' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #2d1b69', color: '#9ca3af' }}>
                        <th style={{ padding: '1rem' }}>{t.admin.tableName}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableDate}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableLocation}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tablePrice}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableTickets}</th>
                        <th style={{ padding: '1rem', textAlign: 'right' }}>{t.admin.tableActions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((ev) => (
                        <tr key={ev.id} style={{ borderBottom: '1px solid #1a182d' }}>
                          <td style={{ padding: '1rem', fontWeight: 'bold' }}>{ev.name}</td>
                          <td style={{ padding: '1rem', color: '#9ca3af' }}>
                            {new Date(ev.date).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '1rem', color: '#9ca3af' }}>{ev.location}</td>
                          <td style={{ padding: '1rem', color: '#4ade80' }}>{language === 'en' ? '$' : 'R$'} {ev.price.toFixed(2)}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{ color: '#c084fc' }}>{ev.soldTickets}</span> / {ev.totalTickets}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteEvent(ev.id, ev.name)}
                              style={{
                                padding: '0.4rem 0.8rem',
                                background: '#3b1219',
                                border: '1px solid #dc2626',
                                color: '#f87171',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
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
                <h2 style={{ fontSize: '1.4rem', color: '#e2e8f0', marginBottom: '1.5rem' }}>{t.admin.allOrders}</h2>
                <div style={{ overflowX: 'auto', background: '#12111f', borderRadius: '12px', border: '1px solid #2d1b69' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #2d1b69', color: '#9ca3af' }}>
                        <th style={{ padding: '1rem' }}>{t.admin.tableOrderId}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableCustomer}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableEvent}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableQty}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableTotal}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableStatus}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableDate}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((ord) => (
                        <tr key={ord.id} style={{ borderBottom: '1px solid #1a182d' }}>
                          <td style={{ padding: '1rem', fontFamily: 'monospace', color: '#9ca3af', fontSize: '0.8rem' }}>
                            {ord.id.slice(0, 8)}...
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 'bold' }}>{ord.user?.name || t.admin.anonymous}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{ord.user?.email}</div>
                          </td>
                          <td style={{ padding: '1rem', color: '#d8b4fe' }}>{ord.event?.name}</td>
                          <td style={{ padding: '1rem' }}>{ord.quantity}</td>
                          <td style={{ padding: '1rem', color: '#4ade80', fontWeight: 'bold' }}>{language === 'en' ? '$' : 'R$'} {ord.total.toFixed(2)}</td>
                          <td style={{ padding: '1rem' }}>
                            <span
                              style={{
                                padding: '0.2rem 0.6rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                background:
                                  ord.status === 'paid' || ord.status === 'approved'
                                    ? 'rgba(34,197,94,0.2)'
                                    : ord.status === 'cancelled'
                                    ? 'rgba(239,68,68,0.2)'
                                    : 'rgba(234,179,8,0.2)',
                                color:
                                  ord.status === 'paid' || ord.status === 'approved'
                                    ? '#4ade80'
                                    : ord.status === 'cancelled'
                                    ? '#f87171'
                                    : '#facc15',
                              }}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: '#9ca3af' }}>
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
                <h2 style={{ fontSize: '1.4rem', color: '#e2e8f0', marginBottom: '1.5rem' }}>{t.admin.users}</h2>
                <div style={{ overflowX: 'auto', background: '#12111f', borderRadius: '12px', border: '1px solid #2d1b69' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #2d1b69', color: '#9ca3af' }}>
                        <th style={{ padding: '1rem' }}>{t.admin.tableName}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableEmail}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableRole}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableOrdersCount}</th>
                        <th style={{ padding: '1rem' }}>{t.admin.tableCreatedAt}</th>
                        <th style={{ padding: '1rem', textAlign: 'right' }}>{t.admin.tableActions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #1a182d' }}>
                          <td style={{ padding: '1rem', fontWeight: 'bold' }}>{u.name}</td>
                          <td style={{ padding: '1rem', color: '#9ca3af' }}>{u.email}</td>
                          <td style={{ padding: '1rem' }}>
                            <span
                              style={{
                                padding: '0.2rem 0.6rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                background: u.role === 'admin' ? 'rgba(168,85,247,0.2)' : 'rgba(107,114,128,0.2)',
                                color: u.role === 'admin' ? '#c084fc' : '#9ca3af',
                              }}
                            >
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '1rem' }}>{u._count?.orders ?? 0}</td>
                          <td style={{ padding: '1rem', color: '#9ca3af' }}>
                            {new Date(u.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR')}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            {u.role !== 'admin' ? (
                              <button
                                onClick={() => handlePromoteUser(u.id, u.name)}
                                style={{
                                  padding: '0.4rem 0.8rem',
                                  background: '#1e1b4b',
                                  border: '1px solid #7c3aed',
                                  color: '#c084fc',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                }}
                              >
                                {t.admin.promoteToAdminBtn}
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{t.admin.administratorRole}</span>
                            )}
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
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 200,
          }}
        >
          <div
            style={{
              background: '#12111f',
              border: '1px solid #2d1b69',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>{t.admin.createEventTitle}</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.35rem' }}>{t.admin.eventNameLabel}</label>
                <input
                  type="text"
                  required
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: '#0a0a0f',
                    border: '1px solid #2d1b69',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  placeholder={t.admin.eventNamePlaceholder}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.35rem' }}>{t.admin.descriptionLabel}</label>
                <textarea
                  required
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    background: '#0a0a0f',
                    border: '1px solid #2d1b69',
                    borderRadius: '8px',
                    color: '#fff',
                    resize: 'vertical',
                  }}
                  placeholder={t.admin.descriptionPlaceholder}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.35rem' }}>{t.admin.dateTimeLabel}</label>
                  <input
                    type="datetime-local"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: '#0a0a0f',
                      border: '1px solid #2d1b69',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.35rem' }}>{t.admin.locationLabel}</label>
                  <input
                    type="text"
                    required
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: '#0a0a0f',
                      border: '1px solid #2d1b69',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    placeholder={t.admin.locationPlaceholder}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.35rem' }}>{t.admin.totalTicketsLabel}</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newEvent.totalTickets}
                    onChange={(e) => setNewEvent({ ...newEvent, totalTickets: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: '#0a0a0f',
                      border: '1px solid #2d1b69',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.35rem' }}>{t.admin.unitPriceLabel}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={newEvent.price}
                    onChange={(e) => setNewEvent({ ...newEvent, price: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      background: '#0a0a0f',
                      border: '1px solid #2d1b69',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.65rem 1.25rem',
                    background: '#1e1b4b',
                    border: '1px solid #3b2075',
                    color: '#9ca3af',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  {t.admin.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={submittingEvent}
                  style={{
                    padding: '0.65rem 1.25rem',
                    background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: submittingEvent ? 'not-allowed' : 'pointer',
                    opacity: submittingEvent ? 0.7 : 1,
                  }}
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
