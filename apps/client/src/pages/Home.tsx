import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
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
  const { isAuthenticated, user, logout } = useAuth();
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
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Logo size={36} />
          <span style={{ fontSize: '1.4rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #c084fc, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FastFlow
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: '#a855f7' }}>Olá, {user?.name}!</span>
              <button onClick={() => navigate('/my-orders')} style={{ padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Meus Pedidos
              </button>
              <button onClick={logout} style={{ padding: '0.5rem 1.25rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer' }}>
                Sair
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{ padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Entrar
              </button>
              <button onClick={() => navigate('/register')} style={{ padding: '0.5rem 1.25rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '8px', cursor: 'pointer' }}>
                Cadastrar
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0533 50%, #0a0a0f 100%)',
        padding: '5rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '999px', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
            <span style={{ color: '#a855f7', fontSize: '0.875rem' }}>⚡ Plataforma de eventos</span>
          </div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: 1.1 }}>
            Os melhores eventos{' '}
            <span style={{ background: 'linear-gradient(135deg, #c084fc, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              estão aqui
            </span>
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1.2rem', marginBottom: '2rem' }}>
            Compre seus ingressos de forma rápida e segura
          </p>
          {!isAuthenticated && (
            <button onClick={() => navigate('/register')} style={{ padding: '0.875rem 2.5rem', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
              Começar agora ⚡
            </button>
          )}
        </div>
      </div>

      {/* Eventos */}
      <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '2rem', color: '#fff' }}>
          🎭 Eventos Disponíveis
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#a855f7' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
            <p>Carregando eventos...</p>
          </div>
        ) : events.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Nenhum evento disponível no momento.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
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
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.borderColor = '#7c3aed';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(124,58,237,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#2d1b69';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', padding: '1.5rem' }}>
                  <h3 style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>{event.name}</h3>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <p style={{ color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.9rem' }}>📅 {new Date(event.date).toLocaleDateString('pt-BR')}</p>
                  <p style={{ color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.9rem' }}>📍 {event.location}</p>
                  <p style={{ color: '#9ca3af', marginBottom: '1.25rem', fontSize: '0.9rem' }}>🎟 {event.totalTickets - event.soldTickets} ingressos disponíveis</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#a855f7', fontSize: '1.3rem' }}>
                      R$ {event.price.toFixed(2)}
                    </span>
                    <button style={{ padding: '0.5rem 1.25rem', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.875rem' }}>
                      Ver mais ⚡
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #2d1b69', padding: '2rem', textAlign: 'center', marginTop: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Logo size={24} />
          <span style={{ color: '#a855f7', fontWeight: 'bold' }}>FastFlow</span>
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>© 2026 FastFlow. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}