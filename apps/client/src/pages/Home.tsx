  import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Navbar */}
      <nav style={{ background: '#1e40af', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#fff', margin: 0 }}>🎉 FastFlow</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <span style={{ color: '#fff' }}>Olá, {user?.name}!</span>
              <button onClick={() => navigate('/my-orders')} style={{ padding: '0.5rem 1rem', background: '#fff', color: '#1e40af', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Meus Pedidos
              </button>
              <button onClick={logout} style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '8px', cursor: 'pointer' }}>
                Sair
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{ padding: '0.5rem 1rem', background: '#fff', color: '#1e40af', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Entrar
              </button>
              <button onClick={() => navigate('/register')} style={{ padding: '0.5rem 1rem', background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '8px', cursor: 'pointer' }}>
                Cadastrar
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: '#1e40af', padding: '3rem 2rem', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Os melhores eventos estão aqui!</h2>
        <p style={{ color: '#bfdbfe' }}>Compre seus ingressos de forma rápida e segura</p>
      </div>

      {/* Eventos */}
      <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#374151' }}>Eventos Disponíveis</h3>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Carregando eventos...</p>
        ) : events.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Nenhum evento disponível no momento.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {events.map(event => (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{ background: '#1e40af', padding: '1.5rem', color: '#fff' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{event.name}</h4>
                </div>
                <div style={{ padding: '1rem' }}>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>📅 {new Date(event.date).toLocaleDateString('pt-BR')}</p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>📍 {event.location}</p>
                  <p style={{ color: '#6b7280', marginBottom: '1rem' }}>🎟 {event.totalTickets - event.soldTickets} ingressos disponíveis</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', color: '#1e40af', fontSize: '1.2rem' }}>
                      R$ {event.price.toFixed(2)}
                    </span>
                    <button style={{ padding: '0.5rem 1rem', background: '#1e40af', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                      Ver mais
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
