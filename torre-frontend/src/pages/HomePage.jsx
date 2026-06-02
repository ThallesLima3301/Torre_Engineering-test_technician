import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();

  const actions = [
    {
      to: '/jobs',
      title: t('home.cards.jobsTitle'),
      description: t('home.cards.jobsDesc'),
    },
    {
      to: '/search',
      title: t('home.cards.peopleTitle'),
      description: t('home.cards.peopleDesc'),
    },
    {
      to: '/analytics',
      title: t('home.cards.analyticsTitle'),
      description: t('home.cards.analyticsDesc'),
    },
  ];

  return (
    <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
          {t('home.eyebrow')}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          {t('home.title')}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          {t('home.subtitle')}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/jobs"
            className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {t('home.startJobs')}
          </Link>
          <Link
            to="/search"
            className="rounded-md border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-white dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            {t('home.searchPeople')}
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {actions.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{action.title}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomePage;
