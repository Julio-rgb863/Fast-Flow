import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import SkeletonCard from '../components/SkeletonCard';
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

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#fff' }}>
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
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          className="btn-outline"
        >
          <Logo size={32} />
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #c084fc, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FastFlow
          </span>
        </div>

        {/* Menu Desktop */}
        <div className="desktop-menu" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <LanguageSwitcher />

          {isAuthenticated ? (
            <>
              <span style={{ color: '#a855f7', fontSize: '0.9rem' }}>{t.nav.hello}, {user?.name}!</span>
              {(isAdmin || user?.role === 'admin') && (
                <button
                  onClick={() => navigate('/admin')}
                  className="btn-outline"
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#1e103c',
                    color: '#c084fc',
                    border: '1px solid #7c3aed',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                  }}
                >
                  ⚙️ {t.nav.admin}
                </button>
              )}
              <button
                onClick={() => navigate('/my-orders')}
                className="btn-purple"
                style={{ padding: '0.5rem 1.25rem', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.875rem' }}
              >
                {t.nav.myOrders}
              </button>
              <button
                onClick={logout}
                className="btn-outline"
                style={{ padding: '0.5rem 1.25rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="btn-purple"
                style={{ padding: '0.5rem 1.25rem', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.875rem' }}
              >
                {t.nav.login}
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-outline"
                style={{ padding: '0.5rem 1.25rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                {t.nav.register}
              </button>
            </>
          )}
        </div>

        {/* Menu Mobile Hamburguer */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="mobile-menu-btn">
          <LanguageSwitcher />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: 'transparent', border: 'none', color: '#a855f7', fontSize: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.85)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Menu Mobile Dropdown */}
      {menuOpen && (
        <div
          className="animate-fadeInDown"
          style={{
            background: 'rgba(12,12,20,0.98)',
            borderBottom: '1px solid #2d1b69',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            position: 'sticky',
            top: '60px',
            zIndex: 99,
          }}
        >
          {isAuthenticated ? (
            <>
              <span style={{ color: '#a855f7', fontSize: '0.9rem' }}>{t.nav.hello}, {user?.name}!</span>
              {(isAdmin || user?.role === 'admin') && (
                <button
                  onClick={() => { navigate('/admin'); setMenuOpen(false); }}
                  className="btn-outline"
                  style={{
                    padding: '0.75rem',
                    background: '#1e103c',
                    color: '#c084fc',
                    border: '1px solid #7c3aed',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  ⚙️ {t.nav.adminPanel}
                </button>
              )}
              <button
                onClick={() => { navigate('/my-orders'); setMenuOpen(false); }}
                className="btn-purple"
                style={{ padding: '0.75rem', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {t.nav.myOrders}
              </button>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="btn-outline"
                style={{ padding: '0.75rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer' }}
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => { navigate('/login'); setMenuOpen(false); }}
                className="btn-purple"
                style={{ padding: '0.75rem', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {t.nav.login}
              </button>
              <button
                onClick={() => { navigate('/register'); setMenuOpen(false); }}
                className="btn-outline"
                style={{ padding: '0.75rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer' }}
              >
                {t.nav.register}
              </button>
            </>
          )}
        </div>
      )}

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0533 50%, #0a0a0f 100%)',
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated background blobs */}
        <div className="animate-blob" style={{ position: 'absolute', top: '15%', left: '8%', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)' }} />
        <div className="animate-blob delay-400" style={{ position: 'absolute', top: '10%', right: '8%', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '850px', margin: '0 auto' }}>
          <ScrollReveal animation="up" delay={50}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', borderRadius: '999px', padding: '0.4rem 1.1rem', marginBottom: '1.5rem' }} className="badge-pulse">
              <span style={{ color: '#c084fc', fontSize: '0.85rem', fontWeight: 600 }}>{t.home.heroBadge}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="up" delay={150}>
            <h1 style={{ fontSize: 'clamp(2rem, 5.5vw, 3.8rem)', fontWeight: '800', marginBottom: '1.25rem', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              <span className="text-shimmer">{t.home.heroTitle}</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="up" delay={250}>
            <p style={{ color: '#9ca3af', fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)', marginBottom: '2.5rem', maxWidth: '650px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
              {t.home.heroSubtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal animation="scale" delay={350}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/register')}
                    className="btn-purple animate-pulse-glow"
                    style={{ padding: '0.95rem 2.25rem', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {t.home.exploreEvents} ⚡
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('events-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-outline glass"
                    style={{ padding: '0.95rem 2rem', color: '#c084fc', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '14px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Ver Ingressos ↓
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    const el = document.getElementById('events-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-purple animate-pulse-glow"
                  style={{ padding: '0.95rem 2.25rem', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Explorar Ingressos ↓
                </button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Destaques / Microinterações Feature Bar */}
      <div style={{ maxWidth: '1100px', margin: '-1rem auto 3rem auto', padding: '0 1rem', position: 'relative', zIndex: 2 }}>
        <ScrollReveal animation="up" delay={100}>
          <div
            className="glass"
            style={{
              borderRadius: '20px',
              padding: '1.25rem 2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.75rem', background: 'rgba(124,58,237,0.2)', padding: '0.6rem', borderRadius: '12px' }}>⚡</div>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: 0, color: '#fff' }}>Emissão Instantânea</p>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0.2rem 0 0 0' }}>Ingresso liberado na hora</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.75rem', background: 'rgba(52,211,153,0.15)', padding: '0.6rem', borderRadius: '12px' }}>📱</div>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: 0, color: '#fff' }}>QR Code Seguro</p>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0.2rem 0 0 0' }}>Validação digital na portaria</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.75rem', background: 'rgba(168,85,247,0.2)', padding: '0.6rem', borderRadius: '12px' }}>🔒</div>
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '0.95rem', margin: 0, color: '#fff' }}>Pagamento Protegido</p>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0.2rem 0 0 0' }}>Stripe & criptografia de ponta</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Seção de Eventos */}
      <div id="events-section" style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <ScrollReveal animation="left" delay={50}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 'bold', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>🎭</span> {t.home.upcomingEvents}
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
              {events.length} evento{events.length === 1 ? '' : 's'} disponível{events.length === 1 ? '' : 'is'}
            </span>
          </div>
        </ScrollReveal>

        {loading ? (
          /* Skeletons de alta fidelidade enquanto carrega */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : events.length === 0 ? (
          <ScrollReveal animation="scale">
            <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎪</div>
              <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>{t.home.noEvents}</p>
            </div>
          </ScrollReveal>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
            {events.map((event, index) => {
              const ticketsLeft = event.totalTickets - event.soldTickets;
              const isLowStock = ticketsLeft > 0 && ticketsLeft <= 20;

              return (
                <ScrollReveal
                  key={event.id}
                  animation="up"
                  delay={(index % 4) * 80}
                >
                  <div
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="card-hover"
                    style={{
                      background: 'linear-gradient(135deg, #12121a, #1a1a2e)',
                      border: '1px solid #2d1b69',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    {/* Header Banner com gradiente e badge */}
                    <div style={{
                      background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                      padding: '1.35rem 1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                    }}>
                      <h3 style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem', margin: 0, lineHeight: 1.3 }}>
                        {event.name}
                      </h3>
                      {isLowStock && (
                        <span style={{
                          background: 'rgba(239, 68, 68, 0.25)',
                          color: '#f87171',
                          border: '1px solid #ef4444',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '999px',
                          whiteSpace: 'nowrap',
                        }}>
                          Últimos!
                        </span>
                      )}
                    </div>

                    {/* Conteúdo com detalhes */}
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                        <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>📅</span> {new Date(event.date).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>📍</span> {event.location}
                        </p>
                        <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>🎟</span> {ticketsLeft} {t.home.ticketsLeft}
                        </p>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid rgba(124, 58, 237, 0.15)',
                      }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Por apenas</span>
                          <span style={{ fontWeight: '800', color: '#c084fc', fontSize: '1.25rem' }}>
                            {language === 'en' ? `$ ${event.price.toFixed(2)}` : `R$ ${event.price.toFixed(2)}`}
                          </span>
                        </div>
                        <button
                          className="btn-purple"
                          style={{
                            padding: '0.55rem 1.15rem',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                          }}
                        >
                          {t.home.viewDetails} ⚡
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #2d1b69', padding: '2rem 1.5rem', textAlign: 'center', marginTop: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <Logo size={22} />
          <span style={{ color: '#c084fc', fontWeight: 'bold', fontSize: '1rem', letterSpacing: '0.05em' }}>FastFlow</span>
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
          © 2026 FastFlow. {language === 'en' ? 'All rights reserved.' : 'Todos os direitos reservados.'}
        </p>
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