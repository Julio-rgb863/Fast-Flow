import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import api from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/users/register', { name, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #2d0a6e 0%, #1a0533 40%, #0a0014 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @media (max-width: 480px) {
          .glass {
            padding: 1.5rem 1.25rem !important;
            border-radius: 16px !important;
          }
        }
      `}</style>

      <div className="animate-blob" style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, #7c3aed 0%, #4c1d95 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.6 }} />
      <div className="animate-blob delay-300" style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, #a855f7 0%, #6d28d9 40%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.5 }} />
      <div className="animate-blob delay-500" style={{ position: 'absolute', top: '40%', left: '5%', width: '250px', height: '250px', background: 'radial-gradient(circle, #c084fc 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.4 }} />

      <div className="animate-fadeInUp" style={{ width: '100%', maxWidth: '420px', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
        <div className="glass" style={{
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          boxShadow: '0 8px 60px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          <div className="animate-fadeInUp delay-100" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="animate-float" style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Logo size={52} />
            </div>
            <span className="text-shimmer" style={{ fontSize: '1.1rem', fontWeight: '700', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              FastFlow
            </span>
            <p style={{ color: '#c084fc', marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: '300' }}>
              Crie sua conta ⚡
            </p>
          </div>

          {error && (
            <div className="animate-fadeIn" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1.5rem', color: '#f87171', textAlign: 'center', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="animate-fadeInUp delay-100" style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c4b5fd', fontSize: '0.875rem' }}>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
                style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                onFocus={e => e.target.style.borderColor = '#a855f7'}
                onBlur={e => e.target.style.borderColor = 'rgba(168,85,247,0.3)'}
              />
            </div>

            <div className="animate-fadeInUp delay-200" style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c4b5fd', fontSize: '0.875rem' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                onFocus={e => e.target.style.borderColor = '#a855f7'}
                onBlur={e => e.target.style.borderColor = 'rgba(168,85,247,0.3)'}
              />
            </div>

            <div className="animate-fadeInUp delay-300" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c4b5fd', fontSize: '0.875rem' }}>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.3s' }}
                onFocus={e => e.target.style.borderColor = '#a855f7'}
                onBlur={e => e.target.style.borderColor = 'rgba(168,85,247,0.3)'}
              />
            </div>

            <div className="animate-fadeInUp delay-400">
              <button
                type="submit"
                disabled={loading}
                className="btn-purple animate-pulse-glow"
                style={{ width: '100%', padding: '0.875rem', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.05em' }}
              >
                {loading ? '⚡ Cadastrando...' : '⚡ Criar Conta'}
              </button>
            </div>
          </form>

          <p className="animate-fadeInUp delay-500" style={{ textAlign: 'center', marginTop: '1.5rem', color: '#9ca3af', fontSize: '0.9rem' }}>
            Já tem conta?{' '}
            <Link to="/login" style={{ color: '#a855f7', textDecoration: 'none', fontWeight: 'bold' }}>
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}