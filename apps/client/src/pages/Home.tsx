import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../components/Logo';
import LanguageSwitcher from '../components/LanguageSwitcher';
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
    api.get('/events').then(({ data }) => {
      setEvents(data);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              <button onClick={() => navigate('/my-orders')} style={{ padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.875rem' }}>
                {t.nav.myOrders}
              </button>
              <button onClick={logout} style={{ padding: '0.5rem 1.25rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{ padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.875rem' }}>
                {t.nav.login}
              </button>
              <button onClick={() => navigate('/register')} style={{ padding: '0.5rem 1.25rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
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
            style={{ background: 'transparent', border: 'none', color: '#a855f7', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Menu Mobile Dropdown */}
      {menuOpen && (
        <div style={{
          background: 'rgba(12,12,20,0.98)',
          borderBottom: '1px solid #2d1b69',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          position: 'sticky',
          top: '60px',
          zIndex: 99,
        }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: '#a855f7', fontSize: '0.9rem' }}>{t.nav.hello}, {user?.name}!</span>
              {(isAdmin || user?.role === 'admin') && (
                <button
                  onClick={() => { navigate('/admin'); setMenuOpen(false); }}
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
              <button onClick={() => { navigate('/my-orders'); setMenuOpen(false); }} style={{ padding: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {t.nav.myOrders}
              </button>
              <button onClick={() => { logout(); setMenuOpen(false); }} style={{ padding: '0.75rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer' }}>
                {t.nav.logout}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { navigate('/login'); setMenuOpen(false); }} style={{ padding: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                {t.nav.login}
              </button>
              <button onClick={() => { navigate('/register'); setMenuOpen(false); }} style={{ padding: '0.75rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer' }}>
                {t.nav.register}
              </button>
            </>
          )}
        </div>
      )}

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0533 50%, #0a0a0f 100%)',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
            <span style={{ color: '#a855f7', fontSize: '0.8rem' }}>{t.home.heroBadge}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', fontWeight: 'bold', marginBottom: '1rem', lineHeight: 1.1 }}>
            {t.home.heroTitle}
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 'clamp(0.9rem, 2.5vw, 1.2rem)', marginBottom: '2rem', maxWidth: '650px', margin: '0 auto 2rem auto' }}>
            {t.home.heroSubtitle}
          </p>
          {!isAuthenticated && (
            <button onClick={() => navigate('/register')} style={{ padding: '0.875rem 2rem', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
              {t.home.exploreEvents}
            </button>
          )}
        </div>
      </div>

      {/* Eventos */}
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 'bold', marginBottom: '1.5rem', color: '#fff' }}>
          🎭 {t.home.upcomingEvents}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#a855f7' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <p>{t.home.loadingEvents}</p>
          </div>
        ) : events.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>{t.home.noEvents}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {events.map(event => (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                style={{
                  background: 'linear-gradient(135deg, #12121a, #1a1a2e)',
                  border: '1px solid #2d1b69',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = '#7c3aed';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(124,58,237,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#2d1b69';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', padding: '1.25rem' }}>
                  <h3 style={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>{event.name}</h3>
                </div>
                <div style={{ padding: '1rem' }}>
                  <p style={{ color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                    📅 {new Date(event.date).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR')}
                  </p>
                  <p style={{ color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.85rem' }}>📍 {event.location}</p>
                  <p style={{ color: '#9ca3af', marginBottom: '1rem', fontSize: '0.85rem' }}>
                    🎟 {event.totalTickets - event.soldTickets} {t.home.ticketsLeft}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#a855f7', fontSize: '1.1rem' }}>
                      {language === 'en' ? `$ ${event.price.toFixed(2)}` : `R$ ${event.price.toFixed(2)}`}
                    </span>
                    <button style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
                      {t.home.viewDetails} ⚡
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #2d1b69', padding: '1.5rem', textAlign: 'center', marginTop: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Logo size={20} />
          <span style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '0.9rem' }}>FastFlow</span>
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>
          © 2026 FastFlow. {language === 'en' ? 'All rights reserved.' : 'Todos os direitos reservados.'}
        </p>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}