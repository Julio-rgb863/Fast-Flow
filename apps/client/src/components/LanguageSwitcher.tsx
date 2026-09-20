import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'rgba(18, 17, 31, 0.9)',
        border: '1px solid #2d1b69',
        borderRadius: '999px',
        padding: '2px',
        gap: '2px',
      }}
    >
      <button
        onClick={() => setLanguage('pt')}
        style={{
          background: language === 'pt' ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
          color: language === 'pt' ? '#fff' : '#9ca3af',
          border: 'none',
          borderRadius: '999px',
          padding: '4px 8px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'all 0.2s ease',
        }}
        title="Português"
      >
        <span>🇧🇷</span>
        <span>PT</span>
      </button>

      <button
        onClick={() => setLanguage('en')}
        style={{
          background: language === 'en' ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
          color: language === 'en' ? '#fff' : '#9ca3af',
          border: 'none',
          borderRadius: '999px',
          padding: '4px 8px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'all 0.2s ease',
        }}
        title="English"
      >
        <span>🇺🇸</span>
        <span>EN</span>
      </button>
    </div>
  );
}
