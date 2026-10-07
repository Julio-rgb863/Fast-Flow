import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        padding: '2px',
        gap: '2px',
      }}
    >
      <button
        onClick={() => setLanguage('pt')}
        style={{
          background: language === 'pt' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          color: language === 'pt' ? '#f8fafc' : '#64748b',
          border: language === 'pt' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent',
          borderRadius: '4px',
          padding: '3px 7px',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          lineHeight: 1.2,
        }}
        title="Português"
      >
        PT
      </button>

      <button
        onClick={() => setLanguage('en')}
        style={{
          background: language === 'en' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          color: language === 'en' ? '#f8fafc' : '#64748b',
          border: language === 'en' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid transparent',
          borderRadius: '4px',
          padding: '3px 7px',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.04em',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          lineHeight: 1.2,
        }}
        title="English"
      >
        EN
      </button>
    </div>
  );
}
