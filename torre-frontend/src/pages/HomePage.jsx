import { Link } from 'react-router-dom';

const actions = [
  {
    to: '/jobs',
    title: 'Search jobs',
    description: 'Browse Torre opportunities with pagination and save promising roles.',
  },
  {
    to: '/search',
    title: 'Find people',
    description: 'Search profiles, open genomes, and keep a favorites shortlist.',
  },
  {
    to: '/analytics',
    title: 'View analytics',
    description: 'See the most searched terms collected by the backend.',
  },
];

const HomePage = () => {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px] lg:items-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
          Torre Engineering Test
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          Search opportunities, profiles, and saved Torre insights in one place.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          This full-stack app integrates Torre search data, persistent favorites, genome lookup,
          and lightweight analytics through a React frontend and Express backend.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/jobs"
            className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Start with jobs
          </Link>
          <Link
            to="/search"
            className="rounded-md border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-white dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            Search people
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
