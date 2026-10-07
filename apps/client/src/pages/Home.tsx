import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import SkeletonCard from '../components/SkeletonCard';
import ScrollReveal from '../components/ScrollReveal';
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SearchIcon,
  SparklesIcon,
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

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/events')
      .then(({ data }) => {
        setEvents(data);
      })
      .catch(() => {
        setEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(ev =>
      ev.name.toLowerCase().includes(q) ||
      ev.location.toLowerCase().includes(q) ||
      ev.description.toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  return (
    <div style={{ minHeight: '100vh', background: '#07080b', color: '#f8fafc' }}>
      {/* Top Ambient Glow (Subtle Linear/Vercel style, no neon blobs) */}
      <div className="bg-radial-subtle" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '620px', pointerEvents: 'none' }} />
      <div className="bg-grid-pattern" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '620px', opacity: 0.35, pointerEvents: 'none' }} />

      {/* Navigation */}
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

          {/* Desktop Nav Actions */}
          <div className="desktop-menu" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <LanguageSwitcher />

            {isAuthenticated ? (
              <>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem', marginRight: '0.25rem' }}>
                  {t.nav.hello}, <strong style={{ color: '#f8fafc', fontWeight: 550 }}>{user?.name}</strong>
                </span>
                {(isAdmin || user?.role === 'admin') && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="btn-secondary"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                  >
                    Painel Admin
                  </button>
                )}
                <button
                  onClick={() => navigate('/my-orders')}
                  className="btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                >
                  {t.nav.myOrders}
                </button>
                <button
                  onClick={logout}
                  className="btn-secondary"
                  style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary"
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  {t.nav.login}
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="btn-primary"
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                >
                  {t.nav.register}
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburguer */}
          <div style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="mobile-menu-btn">
            <LanguageSwitcher />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: '#f8fafc',
                padding: '0.35rem 0.65rem',
                fontSize: '1.1rem',
                cursor: 'pointer',
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div
          className="animate-fadeIn"
          style={{
            background: '#0d0f15',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {isAuthenticated ? (
            <>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                {t.nav.hello}, <strong style={{ color: '#f8fafc' }}>{user?.name}</strong>
              </p>
              {(isAdmin || user?.role === 'admin') && (
                <button onClick={() => { navigate('/admin'); setMenuOpen(false); }} className="btn-secondary">
                  Painel Admin
                </button>
              )}
              <button onClick={() => { navigate('/my-orders'); setMenuOpen(false); }} className="btn-secondary">
                {t.nav.myOrders}
              </button>
              <button onClick={() => { logout(); setMenuOpen(false); }} className="btn-secondary" style={{ color: '#ef4444' }}>
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { navigate('/login'); setMenuOpen(false); }} className="btn-secondary">
                {t.nav.login}
              </button>
              <button onClick={() => { navigate('/register'); setMenuOpen(false); }} className="btn-primary">
                {t.nav.register}
              </button>
            </>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section style={{ padding: '5rem 1.5rem 3rem 1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <ScrollReveal animation="up" delay={50}>
            <div
              className="status-pill status-pill-indigo"
              style={{ marginBottom: '1.5rem', padding: '0.35rem 0.85rem' }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#6366f1',
                  display: 'inline-block',
                }}
                className="animate-pulse-dot"
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 550, letterSpacing: '0.02em' }}>
                {t.home.heroBadge || 'Plataforma oficial de ingressos'}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="up" delay={120}>
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
                fontWeight: 750,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: '#f8fafc',
                marginBottom: '1.25rem',
              }}
            >
              {t.home.heroTitle}
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="up" delay={200}>
            <p
              style={{
                fontSize: 'clamp(1rem, 2.2vw, 1.15rem)',
                color: '#94a3b8',
                lineHeight: 1.6,
                maxWidth: '620px',
                margin: '0 auto 2.25rem auto',
                fontWeight: 400,
              }}
            >
              {t.home.heroSubtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal animation="scale" delay={280}>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('events-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-primary"
                style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
              >
                <span>Ver programação</span>
                <ArrowRightIcon size={16} />
              </button>

              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/register')}
                  className="btn-secondary"
                  style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
                >
                  <SparklesIcon size={16} color="#818cf8" />
                  <span>Criar conta gratuita</span>
                </button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Feature & Metrics Strip */}
      <section style={{ maxWidth: '1160px', margin: '0 auto 4rem auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        <ScrollReveal animation="up" delay={150}>
          <div
            style={{
              background: '#0a0c12',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              padding: '1.5rem 2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: '8px',
                  padding: '0.55rem',
                  color: '#818cf8',
                  flexShrink: 0,
                }}
              >
                <TicketIcon size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', margin: '0 0 0.25rem 0' }}>
                  Ingressos Autênticos
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  Cada ingresso possui assinatura criptográfica e QR Code único para portaria.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  padding: '0.55rem',
                  color: '#34d399',
                  flexShrink: 0,
                }}
              >
                <ShieldCheckIcon size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', margin: '0 0 0.25rem 0' }}>
                  Pagamentos Protegidos
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  Processamento direto via Stripe com total conformidade PCI DSS.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.55rem',
                  color: '#e2e8f0',
                  flexShrink: 0,
                }}
              >
                <SparklesIcon size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', margin: '0 0 0.25rem 0' }}>
                  Entrega Imediata
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  Confirmação no painel e ingresso liberado na hora para impressão ou celular.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Events Discovery Section */}
      <section id="events-section" style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 1.5rem 5rem 1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 650, letterSpacing: '-0.02em', color: '#f8fafc', margin: 0 }}>
              {t.home.upcomingEvents}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
              {filteredEvents.length} {filteredEvents.length === 1 ? 'evento disponível' : 'eventos disponíveis'}
            </p>
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px', maxWidth: '320px', flex: 1 }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex' }}>
              <SearchIcon size={15} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por evento ou cidade..."
              className="saas-input"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredEvents.length === 0 ? (
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
              Nenhum evento encontrado
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
              {searchQuery ? `Nenhum resultado para "${searchQuery}". Tente outro termo.` : t.home.noEvents}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredEvents.map((event, index) => {
              const ticketsLeft = event.totalTickets - event.soldTickets;
              const isLowStock = ticketsLeft > 0 && ticketsLeft <= 25;
              const isSoldOut = ticketsLeft <= 0;

              return (
                <ScrollReveal key={event.id} animation="up" delay={(index % 6) * 60}>
                  <div
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="saas-card"
                    style={{
                      borderRadius: '12px',
                      padding: '1.35rem',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Top Row: Location & Status Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500 }}>
                        <MapPinIcon size={14} color="#64748b" />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          {event.location}
                        </span>
                      </span>

                      {isSoldOut ? (
                        <span className="status-pill" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                          Esgotado
                        </span>
                      ) : isLowStock ? (
                        <span className="status-pill status-pill-amber">
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                          {ticketsLeft} restantes
                        </span>
                      ) : (
                        <span className="status-pill status-pill-emerald">
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                          Disponível
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 650,
                        letterSpacing: '-0.02em',
                        color: '#f8fafc',
                        lineHeight: 1.35,
                        marginBottom: '0.5rem',
                      }}
                    >
                      {event.name}
                    </h3>

                    {/* Description preview */}
                    <p
                      style={{
                        fontSize: '0.85rem',
                        color: '#64748b',
                        lineHeight: 1.5,
                        marginBottom: '1.25rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {event.description}
                    </p>

                    {/* Date row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '1.5rem', marginTop: 'auto' }}>
                      <CalendarIcon size={14} color="#64748b" />
                      <span>
                        {new Date(event.date).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Bottom Pricing & Trigger */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          A partir de
                        </span>
                        <span className="tabular-nums" style={{ fontSize: '1.1rem', fontWeight: 650, color: '#f8fafc' }}>
                          {language === 'en' ? `$ ${event.price.toFixed(2)}` : `R$ ${event.price.toFixed(2)}`}
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.82rem',
                          fontWeight: 550,
                          color: '#818cf8',
                        }}
                      >
                        <span>Garantir</span>
                        <ArrowRightIcon size={14} />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          padding: '2.5rem 1.5rem',
          background: '#07080b',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Logo size={24} />
            <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '-0.01em' }}>
              FastFlow
            </span>
          </div>

          <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>
            © {new Date().getFullYear()} FastFlow. Todos os direitos reservados.
          </p>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/login')}>Entrar</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/register')}>Registrar</span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}