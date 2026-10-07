import { QRCodeSVG } from 'qrcode.react';
import Logo from './Logo';
import { useLanguage } from '../context/LanguageContext';
import {
  PrinterIcon,
  CloseIcon,
  ShieldCheckIcon,
} from './Icons';


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
  const { language } = useLanguage();

  const qrData = JSON.stringify({
    ticketId: order.id,
    event: order.event.name,
    customer: userName || 'Cliente FastFlow',
    quantity: order.quantity,
    date: order.event.date,
    platform: 'FastFlow',
  });

  const handlePrint = () => {
    window.print();
  };

  const eventDate = new Date(order.event.date);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1.25rem',
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
            border: 1px solid #000 !important;
            margin: auto !important;
            background: #fff !important;
            color: #000 !important;
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
          maxWidth: '420px',
          background: '#0d0f15',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 24px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Pass Top Banner */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0a0b10',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Logo size={24} />
            <span style={{ fontWeight: 650, fontSize: '0.9rem', color: '#f8fafc', letterSpacing: '-0.01em' }}>
              FastFlow Pass
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#34d399',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
              }}
            >
              <ShieldCheckIcon size={12} />
              <span>Verificado</span>
            </span>

            <button
              onClick={onClose}
              className="no-print"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                padding: '0.2rem',
                borderRadius: '4px',
              }}
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>

        {/* Event Details */}
        <div style={{ padding: '1.5rem 1.5rem 1rem 1.5rem' }}>
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#f8fafc',
              margin: '0 0 1.25rem 0',
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
            }}
          >
            {order.event.name}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Data
              </span>
              <p style={{ color: '#f8fafc', fontWeight: 600, margin: 0 }}>
                {eventDate.toLocaleDateString(language === 'en' ? 'en-US' : 'pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Horário
              </span>
              <p style={{ color: '#f8fafc', fontWeight: 600, margin: 0 }}>
                {eventDate.toLocaleTimeString(language === 'en' ? 'en-US' : 'pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Local
              </span>
              <p style={{ color: '#f8fafc', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {order.event.location}
              </p>
            </div>

            <div>
              <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                Titular
              </span>
              <p style={{ color: '#f8fafc', fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userName || 'Cliente'}
              </p>
            </div>
          </div>
        </div>

        {/* Perforated Divider */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', margin: '0.75rem 0' }}>
          <div
            style={{
              position: 'absolute',
              left: '-10px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#07080b',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          />
          <div
            style={{
              width: '100%',
              borderBottom: '1px dashed rgba(255, 255, 255, 0.15)',
              margin: '0 1.25rem',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '-10px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#07080b',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          />
        </div>

        {/* QR Code Section */}
        <div
          style={{
            padding: '1rem 1.5rem 1.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              padding: '12px',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
              display: 'inline-block',
              marginBottom: '1rem',
            }}
          >
            <QRCodeSVG
              value={qrData}
              size={170}
              level="H"
              includeMargin={false}
            />
          </div>

          <p
            className="tabular-nums"
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              fontSize: '0.78rem',
              color: '#94a3b8',
              margin: '0 0 0.5rem 0',
              letterSpacing: '0.04em',
            }}
          >
            ID: #{order.id}
          </p>

          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
            Apresente este código na portaria para validação do ingresso
          </p>
        </div>

        {/* Footer Actions */}
        <div
          className="no-print"
          style={{
            padding: '1rem 1.5rem',
            background: '#0a0b10',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            gap: '0.75rem',
          }}
        >
          <button
            onClick={handlePrint}
            className="btn-primary"
            style={{ flex: 1, padding: '0.65rem' }}
          >
            <PrinterIcon size={16} />
            <span>Imprimir ingresso</span>
          </button>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.65rem 1rem' }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
