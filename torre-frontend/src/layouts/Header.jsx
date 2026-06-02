import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useDarkMode from '../hooks/useDarkMode';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/search', label: 'People search' },
  { to: '/people', label: 'Favorites' },
  { to: '/genome', label: 'Genome' },
  { to: '/analytics', label: 'Analytics' },
];

const linkClass = ({ isActive }) => [
  'rounded-md px-3 py-2 text-sm font-medium transition',
  isActive
    ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-800 dark:text-white'
    : 'text-gray-600 hover:bg-white hover:text-gray-950 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
].join(' ');

const Header = () => {
  const { i18n } = useTranslation();
  const { theme, toggleTheme } = useDarkMode();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-gray-50/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <NavLink to="/" className="text-lg font-bold tracking-tight text-gray-950 dark:text-white">
          Torre Explorer
        </NavLink>

        <nav className="flex flex-wrap gap-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-white dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-white dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            aria-label="Toggle language"
          >
            {i18n.language === 'en' ? 'PT' : 'EN'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
