import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';
import api from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/users/register', { name, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || t.auth.registerError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#07080b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '1.5rem',
      }}
    >
      {/* Background Ambience */}
      <div className="bg-radial-subtle" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div className="bg-grid-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' }} />

      {/* Language Switcher Top Right */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      <div style={{ width: '100%', maxWidth: '380px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            onClick={() => navigate('/')}
            style={{ display: 'inline-flex', cursor: 'pointer', marginBottom: '1rem' }}
          >
            <Logo size={36} />
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 650, letterSpacing: '-0.025em', color: '#f8fafc', margin: '0 0 0.35rem 0' }}>
            {t.auth.createAccount}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Compre e gerencie ingressos em segundos
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#0d0f15',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '1.75rem',
            boxShadow: '0 16px 40px -12px rgba(0, 0, 0, 0.7)',
          }}
        >
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
                lineHeight: 1.4,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem' }}>
                {t.auth.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
                className="saas-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem' }}>
                {t.auth.email}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="saas-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem' }}>
                {t.auth.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="saas-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '0.7rem', marginTop: '0.5rem' }}
            >
              {loading ? <Spinner size="sm" color="#090a0f" /> : t.auth.registerButton}
            </button>
          </form>

          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              textAlign: 'center',
              fontSize: '0.82rem',
              color: '#64748b',
            }}
          >
            {t.auth.alreadyHaveAccount}{' '}
            <Link
              to="/login"
              style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 550 }}
            >
              {t.auth.loginHere}
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <span
            onClick={() => navigate('/')}
            style={{ fontSize: '0.8rem', color: '#64748b', cursor: 'pointer', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            ← Voltar para a página inicial
          </span>
        </div>
      </div>
    </div>
  );
}