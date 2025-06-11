import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useDarkMode from '../hooks/useDarkMode';

const Header = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useDarkMode();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-gray-800 dark:bg-gray-900 text-white p-4 flex items-center justify-between">
      <nav className="flex gap-6 text-lg">
        <Link to="/jobs" className="hover:underline">{t('job_positions')}</Link>
        <Link to="/search" className="hover:underline">{t('search_people')}</Link>
        <Link to="/genome/thalleslima3301" className="hover:underline">{t('my_genome')}</Link>
        <Link to="/people" className="hover:underline">{t('people')}</Link>
        <Link to="/analytics" className="hover:underline">{t('analytics')}</Link>
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="text-sm border border-white px-2 py-1 rounded hover:bg-white hover:text-gray-800 transition"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        <button
          onClick={toggleLanguage}
          className="text-sm border border-white px-2 py-1 rounded hover:bg-white hover:text-gray-800 transition"
        >
          {i18n.language === 'en' ? 'PT-BR' : 'EN'}
        </button>
      </div>
    </header>
  );
};

export default Header;
