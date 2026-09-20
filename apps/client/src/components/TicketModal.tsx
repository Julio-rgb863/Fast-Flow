import { QRCodeSVG } from 'qrcode.react';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';

export interface TicketOrder {
  id: string;
  quantity: number;
  total: number;
  status: string;
  createdAt: string;
  event: {
    id: string;
    name: string;
    date: string;
    location: string;
    price: number;
  };
}

interface TicketModalProps {
  order: TicketOrder;
  userName?: string;
  onClose: () => void;
}

export default function TicketModal({ order, userName, onClose }: TicketModalProps) {
  const { t, language } = useLanguage();

  const qrData = JSON.stringify({
    ticketId: order.id,
    event: order.event.name,
    customer: userName || (language === 'en' ? 'FastFlow Customer' : 'Cliente FastFlow'),
    quantity: order.quantity,
    date: order.event.date,
    platform: 'FastFlow',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="ticket-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .ticket-card, .ticket-card * {
            visibility: visible !important;
          }
          .ticket-modal-overlay {
            position: absolute !important;
            inset: 0 !important;
            background: #fff !important;
            padding: 0 !important;
          }
          .ticket-card {
            box-shadow: none !important;
            border: 2px solid #2d1b69 !important;
            margin: auto !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        className="ticket-card animate-fadeInUp"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(145deg, #131124, #0b0a14)',
          borderRadius: '24px',
          border: '1px solid #4c1d95',
          boxShadow: '0 25px 50px -12px rgba(124, 58, 237, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Cabeçalho do Ingresso */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Logo size={28} />
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '0.05em', color: '#fff' }}>
              {t.ticket.officialVoucher}
            </span>
          </div>

          <button
            onClick={onClose}
            className="no-print"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
            }}
          >
            ✕
          </button>
        </div>

        {/* Informações Principais do Evento */}
        <div style={{ padding: '1.5rem 1.75rem 1rem' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
              marginBottom: '0.5rem',
            }}
          >
            {t.ticket.officialTicket}
          </span>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#fff',
              margin: '0 0 0.75rem 0',
              lineHeight: 1.2,
            }}
          >
            {order.event.name}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div>
              <p style={{ color: '#9ca3af', margin: '0 0 0.2rem 0' }}>📅 {t.ticket.date}</p>
              <p style={{ color: '#fff', fontWeight: 'bold', margin: 0 }}>
                {new Date(order.event.date).toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p style={{ color: '#9ca3af', margin: '0 0 0.2rem 0' }}>⏰ {t.ticket.time}</p>
              <p style={{ color: '#fff', fontWeight: 'bold', margin: 0 }}>
                {new Date(order.event.date).toLocaleTimeString(language === 'en' ? 'en-US' : 'pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p style={{ color: '#9ca3af', margin: '0 0 0.2rem 0' }}>📍 {t.ticket.location}</p>
              <p style={{ color: '#fff', fontWeight: 'bold', margin: 0 }}>{order.event.location}</p>
            </div>
            <div>
              <p style={{ color: '#9ca3af', margin: '0 0 0.2rem 0' }}>👤 {t.ticket.holder}</p>
              <p style={{ color: '#fff', fontWeight: 'bold', margin: 0 }}>
                {userName || (language === 'en' ? 'Not specified' : 'Não informado')}
              </p>
            </div>
          </div>
        </div>

        {/* Divisória estilizada de ingresso com furinhos */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
          <div
            style={{
              position: 'absolute',
              left: '-14px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#0a0a0f',
            }}
          />
          <div
            style={{
              width: '100%',
              borderBottom: '2px dashed rgba(124, 58, 237, 0.4)',
              margin: '0 1.5rem',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '-14px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#0a0a0f',
            }}
          />
        </div>

        {/* Área do QR Code */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              padding: '14px',
              borderRadius: '16px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
              display: 'inline-block',
            }}
          >
            <QRCodeSVG
              value={qrData}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>

          <div style={{ marginTop: '1rem', width: '100%' }}>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', margin: '0 0 0.25rem 0' }}>
              {t.ticket.orderCode}:
            </p>
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#c084fc',
                background: 'rgba(124, 58, 237, 0.1)',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                margin: 0,
                wordBreak: 'break-all',
              }}
            >
              {order.id}
            </p>
          </div>

          <div
            style={{
              marginTop: '0.85rem',
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '0.85rem',
              color: '#d1d5db',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
              paddingTop: '0.75rem',
            }}
          >
            <span>{t.ticket.ticketsQty}: <strong>{order.quantity}x</strong></span>
            <span style={{ color: '#4ade80', fontWeight: 'bold' }}>
              {t.ticket.totalPaid}: {language === 'en' ? `$ ${order.total.toFixed(2)}` : `R$ ${order.total.toFixed(2)}`}
            </span>
          </div>

          <p style={{ fontSize: '0.7rem', color: '#6b7280', margin: '0.75rem 0 0' }}>
            {t.ticket.scanNotice}
          </p>
        </div>

        {/* Botões de Ação */}
        <div
          className="no-print"
          style={{
            padding: '1rem 1.5rem',
            background: 'rgba(10, 10, 15, 0.6)',
            borderTop: '1px solid #2d1b69',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <button
            onClick={handlePrint}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            🖨️ {t.ticket.printOrSave}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.25rem',
              background: '#1a103c',
              border: '1px solid #4c1d95',
              color: '#c084fc',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
            }}
          >
            {t.ticket.close}
          </button>
        </div>
      </div>
    </div>
  );
}
