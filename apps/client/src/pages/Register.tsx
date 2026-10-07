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

      {/* Language Switcher */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      {/* Ambient background glow blobs */}
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
            <div
              className="animate-float"
              style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: '0.75rem', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <Logo size={52} />
            </div>
            <div>
              <span className="text-shimmer" style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                FastFlow
              </span>
            </div>
            <p style={{ color: '#c084fc', marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: '300' }}>
              {t.auth.createAccount}
            </p>
          </div>

          {error && (
            <div className="animate-bounceIn" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '12px', padding: '0.85rem', marginBottom: '1.5rem', color: '#f87171', textAlign: 'center', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="animate-fadeInUp delay-100" style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c4b5fd', fontSize: '0.875rem' }}>{t.auth.name}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.auth.namePlaceholder}
                required
                className="input-animated"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div className="animate-fadeInUp delay-200" style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c4b5fd', fontSize: '0.875rem' }}>{t.auth.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth.emailPlaceholder}
                required
                className="input-animated"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div className="animate-fadeInUp delay-300" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#c4b5fd', fontSize: '0.875rem' }}>{t.auth.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth.passwordRegisterPlaceholder}
                required
                className="input-animated"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div className="animate-fadeInUp delay-400">
              <button
                type="submit"
                disabled={loading}
                className="btn-purple animate-pulse-glow"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.05em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" color="#ffffff" />
                    <span>{t.auth.registering}</span>
                  </>
                ) : (
                  <span>{t.auth.registerButton}</span>
                )}
              </button>
            </div>
          </form>

          <p className="animate-fadeInUp delay-500" style={{ textAlign: 'center', marginTop: '1.75rem', color: '#9ca3af', fontSize: '0.9rem' }}>
            {t.auth.alreadyHaveAccount}{' '}
            <Link to="/login" className="nav-link" style={{ color: '#c084fc', textDecoration: 'none', fontWeight: 'bold' }}>
              {t.auth.loginHere}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}