import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
      <p>&copy; {new Date().getFullYear()} {t('footer.text')}</p>
    </footer>
  );
};

export default Footer;
