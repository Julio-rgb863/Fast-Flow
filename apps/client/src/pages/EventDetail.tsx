import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';
import ScrollReveal from '../components/ScrollReveal';
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

  // Loading state com Skeleton de alta fidelidade
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>
        <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #2d1b69', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo size={32} />
        </div>
        <div style={{ height: '180px', background: 'linear-gradient(90deg, #1b0c36 25%, #2a1352 50%, #1b0c36 75%)', backgroundSize: '400px 100%', animation: 'skeleton-wave 1.4s infinite' }} />
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: '20px' }}>
            <div className="skeleton" style={{ height: '18px', width: '90%', marginBottom: '1rem' }} />
            <div className="skeleton" style={{ height: '18px', width: '70%', marginBottom: '2rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div className="skeleton" style={{ height: '70px', borderRadius: '12px' }} />
              <div className="skeleton" style={{ height: '70px', borderRadius: '12px' }} />
            </div>
            <div className="skeleton" style={{ height: '50px', borderRadius: '12px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!event) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ color: '#c084fc', fontSize: '1.2rem' }}>{t.eventDetail.notFound}</p>
      <button onClick={() => navigate('/')} className="btn-purple" style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '10px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
        Voltar para a página inicial
      </button>
    </div>
  );

  const disponiveis = event.totalTickets - event.soldTickets;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>
      <style>{`
        @media (max-width: 768px) {
          .event-hero h1 { font-size: 1.5rem !important; }
          .event-grid { grid-template-columns: 1fr 1fr !important; }
          .event-content { padding: 1.25rem !important; }
        }
        @media (max-width: 480px) {
          .event-grid { grid-template-columns: 1fr !important; }
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LanguageSwitcher />
          <button onClick={() => navigate('/')} className="btn-outline" style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
            {t.eventDetail.back}
          </button>
        </div>
      </nav>

      {/* Event Hero */}
      <div className="event-hero" style={{
        background: 'linear-gradient(135deg, #1a0533 0%, #2d0a6e 50%, #1a0533 100%)',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="animate-blob" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '450px', height: '240px', background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div className="animate-fadeInUp" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)', fontWeight: 'bold', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{event.name}</h1>
          <p style={{ color: '#c084fc', fontSize: '1rem', fontWeight: 500 }}>📍 {event.location}</p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <ScrollReveal animation="up" delay={100}>
          <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 60px rgba(0,0,0,0.5)' }}>
            <div className="event-content" style={{ padding: '2.25rem' }}>
              <p style={{ color: '#9ca3af', lineHeight: 1.75, marginBottom: '2rem', fontSize: '1rem' }}>{event.description}</p>

              <div className="event-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { icon: '📅', label: t.eventDetail.date, value: new Date(event.date).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) },
                  { icon: '📍', label: t.eventDetail.location, value: event.location },
                  { icon: '🎟', label: t.eventDetail.available, value: `${disponiveis} ${t.eventDetail.ticketsUnit}`, color: disponiveis > 0 ? '#34d399' : '#f87171' },
                  { icon: '💰', label: t.eventDetail.price, value: `${language === 'en' ? '$' : 'R$'} ${event.price.toFixed(2)}`, color: '#c084fc' },
                ].map((item, i) => (
                  <div key={i} className="card-hover" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '1rem' }}>
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.25rem', fontWeight: 600 }}>{item.icon} {item.label}</p>
                    <p style={{ fontWeight: 'bold', color: item.color || '#fff', fontSize: '1rem', margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {error && (
                <div className="animate-bounceIn" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', color: '#f87171', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              {disponiveis > 0 && (
                <div style={{ borderTop: '1px solid rgba(124,58,237,0.2)', paddingTop: '1.75rem' }}>
                  <h3 style={{ color: '#c084fc', marginBottom: '1rem', fontSize: '1.05rem', fontWeight: 600 }}>{t.eventDetail.buyTicketsHeading}</h3>

                  {/* Quantidade com botões tácteis de incremento/decremento */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <label style={{ color: '#9ca3af', fontSize: '0.95rem' }}>{t.eventDetail.quantityLabel}:</label>

                    <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', overflow: 'hidden' }}>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        style={{
                          width: '40px',
                          height: '40px',
                          background: 'transparent',
                          border: 'none',
                          color: quantity <= 1 ? '#4b5563' : '#c084fc',
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => { if (quantity > 1) e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; }}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        −
                      </button>

                      <span style={{ minWidth: '44px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem', color: '#fff' }}>
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(disponiveis, quantity + 1))}
                        disabled={quantity >= disponiveis}
                        style={{
                          width: '40px',
                          height: '40px',
                          background: 'transparent',
                          border: 'none',
                          color: quantity >= disponiveis ? '#4b5563' : '#c084fc',
                          fontSize: '1.25rem',
                          fontWeight: 'bold',
                          cursor: quantity >= disponiveis ? 'not-allowed' : 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={e => { if (quantity < disponiveis) e.currentTarget.style.background = 'rgba(124,58,237,0.2)'; }}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', background: 'rgba(124,58,237,0.1)', padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.95rem' }}>{t.eventDetail.total}:</span>
                    <strong style={{ color: '#c084fc', fontSize: '1.35rem', fontWeight: 800 }}>
                      {language === 'en' ? '$' : 'R$'} {(event.price * quantity).toFixed(2)}
                    </strong>
                  </div>

                  <button
                    onClick={handleBuy}
                    disabled={buying}
                    className="btn-purple animate-pulse-glow"
                    style={{
                      width: '100%',
                      padding: '1.05rem',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '14px',
                      fontSize: '1.05rem',
                      fontWeight: 'bold',
                      cursor: buying ? 'not-allowed' : 'pointer',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {buying ? (
                      <>
                        <Spinner size="sm" color="#ffffff" />
                        <span>{t.eventDetail.processing}</span>
                      </>
                    ) : (
                      <span>{t.eventDetail.buyButton} ⚡</span>
                    )}
                  </button>
                </div>
              )}

              {disponiveis === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '14px' }}>
                  <p style={{ color: '#f87171', fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>{t.eventDetail.soldOutBadge}</p>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}