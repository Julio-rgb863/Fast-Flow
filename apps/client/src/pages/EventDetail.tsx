import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';
import ScrollReveal from '../components/ScrollReveal';
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckIcon,
} from '../components/Icons';
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
  const { t, language } = useLanguage();
  const [event, setEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(({ data }) => {
        setEvent(data);
      })
      .finally(() => {
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
      const { data } = await api.post('/orders', { eventId: id, quantity });
      navigate('/payment', {
        state: {
          orderId: data.id,
          total: data.total,
          eventName: event?.name,
          quantity: quantity,
        }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || t.eventDetail.errorBuying);
    } finally {
      setBuying(false);
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#07080b', color: '#f8fafc' }}>
        <header style={{ padding: '0.85rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Logo size={28} />
          </div>
        </header>
        <div style={{ maxWidth: '1100px', margin: '3rem auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }}>
          <div>
            <div className="skeleton-box" style={{ height: '32px', width: '60%', marginBottom: '1.5rem' }} />
            <div className="skeleton-box" style={{ height: '18px', width: '85%', marginBottom: '0.75rem' }} />
            <div className="skeleton-box" style={{ height: '18px', width: '70%', marginBottom: '2rem' }} />
            <div className="skeleton-box" style={{ height: '120px', borderRadius: '12px' }} />
          </div>
          <div className="skeleton-box" style={{ height: '360px', borderRadius: '12px' }} />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ minHeight: '100vh', background: '#07080b', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f8fafc', margin: 0 }}>
          {t.eventDetail.notFound}
        </h2>
        <button onClick={() => navigate('/')} className="btn-secondary">
          Voltar para a programação
        </button>
      </div>
    );
  }

  const ticketsLeft = event.totalTickets - event.soldTickets;
  const isSoldOut = ticketsLeft <= 0;
  const eventDate = new Date(event.date);

  return (
    <div style={{ minHeight: '100vh', background: '#07080b', color: '#f8fafc' }}>
      {/* Navbar */}
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              onClick={() => navigate('/')}
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
            >
              {t.eventDetail.back}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1160px', margin: '2.5rem auto 5rem auto', padding: '0 1.5rem' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: '#64748b', marginBottom: '2rem' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Eventos</span>
          <span>/</span>
          <span style={{ color: '#94a3b8', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {event.name}
          </span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="event-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(320px, 0.75fr)', gap: '2.5rem', alignItems: 'start' }}>
          {/* Left Column: Event Editorial Info */}
          <div>
            <ScrollReveal animation="up" delay={50}>
              <div style={{ marginBottom: '1rem' }}>
                {isSoldOut ? (
                  <span className="status-pill" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    Esgotado
                  </span>
                ) : ticketsLeft <= 25 ? (
                  <span className="status-pill status-pill-amber">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                    Últimas {ticketsLeft} unidades disponíveis
                  </span>
                ) : (
                  <span className="status-pill status-pill-emerald">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    Ingressos Disponíveis
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                  fontWeight: 750,
                  letterSpacing: '-0.03em',
                  color: '#f8fafc',
                  lineHeight: 1.15,
                  marginBottom: '1.5rem',
                }}
              >
                {event.name}
              </h1>

              {/* Specs pill group */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  padding: '1.25rem',
                  background: '#0d0f15',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '12px',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: '180px' }}>
                  <div style={{ color: '#818cf8', display: 'flex' }}><CalendarIcon size={18} /></div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Data & Horário</span>
                    <strong style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>
                      {eventDate.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })} • {eventDate.toLocaleTimeString(language === 'en' ? 'en-US' : 'pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: '180px' }}>
                  <div style={{ color: '#34d399', display: 'flex' }}><MapPinIcon size={18} /></div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Localização</span>
                    <strong style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>{event.location}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: '140px' }}>
                  <div style={{ color: '#a5b4fc', display: 'flex' }}><TicketIcon size={18} /></div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Capacidade</span>
                    <strong style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 600 }}>{event.totalTickets} ingressos</strong>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
                  Sobre o evento
                </h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '0.95rem', margin: 0, whiteSpace: 'pre-line' }}>
                  {event.description}
                </p>
              </div>

              {/* Security Banner */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <div style={{ color: '#34d399', display: 'flex' }}>
                  <ShieldCheckIcon size={22} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', margin: '0 0 0.15rem 0' }}>
                    Garantia FastFlow Authenticity
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>
                    Entrada 100% garantida com leitor de QR Code validado pelo organizador na portaria.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Checkout & Ticket Purchase Card */}
          <div>
            <div
              style={{
                background: '#0d0f15',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderRadius: '14px',
                padding: '1.75rem',
                position: 'sticky',
                top: '5rem',
                boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
              }}
            >
              <h3 style={{ fontSize: '1.1rem', fontWeight: 650, color: '#f8fafc', margin: '0 0 1.25rem 0', letterSpacing: '-0.02em' }}>
                {t.eventDetail.buyTicketsHeading}
              </h3>

              {error && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    marginBottom: '1.25rem',
                    color: '#f87171',
                    fontSize: '0.82rem',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Price per unit */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Valor unitário:</span>
                <span className="tabular-nums" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc' }}>
                  {language === 'en' ? `$ ${event.price.toFixed(2)}` : `R$ ${event.price.toFixed(2)}`}
                </span>
              </div>

              {!isSoldOut ? (
                <>
                  {/* Quantity controls */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500, marginBottom: '0.5rem' }}>
                      {t.eventDetail.quantityLabel}
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        style={{
                          width: '38px',
                          height: '38px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: quantity <= 1 ? '#475569' : '#f8fafc',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        −
                      </button>

                      <div
                        className="tabular-nums"
                        style={{
                          flex: 1,
                          height: '38px',
                          background: '#07080b',
                          border: '1px solid rgba(255, 255, 255, 0.09)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          fontSize: '0.95rem',
                          color: '#f8fafc',
                        }}
                      >
                        {quantity}
                      </div>

                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(ticketsLeft, quantity + 1))}
                        disabled={quantity >= ticketsLeft}
                        style={{
                          width: '38px',
                          height: '38px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: quantity >= ticketsLeft ? '#475569' : '#f8fafc',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          cursor: quantity >= ticketsLeft ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Summary Breakdown */}
                  <div
                    style={{
                      padding: '1rem',
                      background: '#07080b',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.6rem',
                      marginBottom: '1.5rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>Subtotal ({quantity}x):</span>
                      <span className="tabular-nums">
                        {language === 'en' ? `$ ${(event.price * quantity).toFixed(2)}` : `R$ ${(event.price * quantity).toFixed(2)}`}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                      <span>Taxa de processamento:</span>
                      <span style={{ color: '#34d399', fontWeight: 500 }}>Grátis (R$ 0,00)</span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '0.6rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#f8fafc',
                        fontWeight: 650,
                      }}
                    >
                      <span>{t.eventDetail.total}:</span>
                      <span className="tabular-nums" style={{ fontSize: '1.15rem' }}>
                        {language === 'en' ? `$ ${(event.price * quantity).toFixed(2)}` : `R$ ${(event.price * quantity).toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={handleBuy}
                    disabled={buying}
                    className="btn-primary"
                    style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
                  >
                    {buying ? (
                      <Spinner size="sm" color="#090a0f" />
                    ) : (
                      <>
                        <span>{t.eventDetail.buyButton}</span>
                        <ArrowRightIcon size={16} />
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div
                  style={{
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: 'rgba(239, 68, 68, 0.06)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '10px',
                  }}
                >
                  <p style={{ color: '#f87171', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>
                    {t.eventDetail.soldOutBadge}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.35rem 0 0 0' }}>
                    Todos os ingressos deste evento já foram reservados.
                  </p>
                </div>
              )}

              {/* Guarantees checklist */}
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.78rem', color: '#64748b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckIcon size={14} color="#34d399" />
                  <span>Emissão imediata via QR Code após confirmação</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckIcon size={14} color="#34d399" />
                  <span>Pagamento seguro e criptografado com Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 860px) {
          .event-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}