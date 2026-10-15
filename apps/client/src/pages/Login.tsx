import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';
import { GoogleIcon, XIcon, FacebookIcon, CloseIcon, CheckIcon } from '../components/Icons';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Social notice
  const [socialNotice, setSocialNotice] = useState('');

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/users/login', { email, password });
      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || t.auth.loginError);
    } finally {
      setLoading(false);
    }
  }

  function handleSocialLogin(provider: string) {
    setSocialNotice(`Autenticação com ${provider} em desenvolvimento.`);
    setTimeout(() => {
      setSocialNotice('');
    }, 3500);
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    // Simula envio de email de recuperação com feedback instantâneo ao usuário
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
    }, 900);
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

      <div style={{ width: '100%', maxWidth: '390px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            onClick={() => navigate('/')}
            style={{ display: 'inline-flex', cursor: 'pointer', marginBottom: '1rem' }}
          >
            <Logo size={36} />
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 650, letterSpacing: '-0.025em', color: '#f8fafc', margin: '0 0 0.35rem 0' }}>
            {t.auth.welcomeBack}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Acesse seus ingressos e pedidos no FastFlow
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#0d0f15',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
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

          {socialNotice && (
            <div
              style={{
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                marginBottom: '1.25rem',
                color: '#a5b4fc',
                fontSize: '0.82rem',
                textAlign: 'center',
              }}
            >
              {socialNotice}
            </div>
          )}

          {/* Social Logins: Google, X, Facebook */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="btn-secondary"
              style={{
                padding: '0.6rem 0.5rem',
                fontSize: '0.78rem',
                gap: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Continuar com Google"
            >
              <GoogleIcon size={16} />
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('X')}
              className="btn-secondary"
              style={{
                padding: '0.6rem 0.5rem',
                fontSize: '0.78rem',
                gap: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Continuar com X"
            >
              <XIcon size={14} color="#f8fafc" />
              <span>X</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('Facebook')}
              className="btn-secondary"
              style={{
                padding: '0.6rem 0.5rem',
                fontSize: '0.78rem',
                gap: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Continuar com Facebook"
            >
              <FacebookIcon size={15} />
              <span>Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'lowercase' }}>
              {t.auth.orContinueWith}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8' }}>
                  {t.auth.password}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setForgotSuccess(false);
                    setShowForgotModal(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: '#818cf8',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  {t.auth.forgotPassword}
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="saas-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '0.7rem', marginTop: '0.25rem' }}
            >
              {loading ? <Spinner size="sm" color="#090a0f" /> : t.auth.loginButton}
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
            {t.auth.dontHaveAccount}{' '}
            <Link
              to="/register"
              style={{ color: '#818cf8', textDecoration: 'none', fontWeight: 550 }}
            >
              {t.auth.signUpHere}
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

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem',
            zIndex: 1000,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForgotModal(false);
          }}
        >
          <div
            className="animate-fadeInUp"
            style={{
              width: '100%',
              maxWidth: '380px',
              background: '#0d0f15',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '14px',
              padding: '1.75rem',
              boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 650, color: '#f8fafc', margin: 0 }}>
                {t.auth.forgotPasswordTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.2rem' }}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {forgotSuccess ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    color: '#34d399',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <CheckIcon size={22} />
                </div>
                <p style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: 550, margin: '0 0 0.5rem 0' }}>
                  {t.auth.recoveryEmailSent}
                </p>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 1.5rem 0', lineHeight: 1.4 }}>
                  Verifique a caixa de entrada de <strong>{forgotEmail}</strong> e siga as instruções para redefinir sua senha.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.65rem' }}
                >
                  {t.auth.backToLogin}
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, lineHeight: 1.45 }}>
                  {t.auth.forgotPasswordDesc}
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.4rem' }}>
                    {t.auth.email}
                  </label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="saas-input"
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '0.65rem' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="btn-primary"
                    style={{ flex: 1.5, padding: '0.65rem' }}
                  >
                    {forgotLoading ? <Spinner size="sm" color="#090a0f" /> : t.auth.sendRecoveryEmail}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}