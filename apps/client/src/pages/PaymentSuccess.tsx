import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../components/Logo';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    setTimeout(() => {
      navigate('/my-orders');
    }, 5000);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at top, #0a2e1a 0%, #0a0a0f 60%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="animate-blob" style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, #059669 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.3 }} />
      <div className="animate-blob delay-300" style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, #34d399 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', opacity: 0.2 }} />

      <div className="animate-fadeInUp" style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: '2rem' }}>
        <div className="animate-float" style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>✅</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#34d399', marginBottom: '1rem' }}>
          Pagamento Confirmado!
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.1rem', marginBottom: '2rem' }}>
          Seu ingresso foi adquirido com sucesso! 🎉
        </p>

        <div className="glass" style={{ borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(52,211,153,0.3)' }}>
          <p style={{ color: '#34d399', marginBottom: '0.5rem' }}>⚡ Pedido confirmado</p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Redirecionando para seus pedidos em 5 segundos...</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/my-orders')}
            style={{ padding: '0.875rem 2rem', background: 'linear-gradient(135deg, #059669, #34d399)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Ver Meus Pedidos
          </button>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '0.875rem 2rem', background: 'transparent', color: '#a855f7', border: '1px solid #7c3aed', borderRadius: '12px', fontSize: '1rem', cursor: 'pointer' }}
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
}
