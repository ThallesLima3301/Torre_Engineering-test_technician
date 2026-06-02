import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addFavorite, searchJobs } from '../services/torreService';

const LIMIT = 10;

const getUniqueJobs = (items) => (
  Array.from(new Map(items.map((job) => [job.id || job._id || job.objective, job])).values())
);

const JobsPage = () => {
  const [query, setQuery] = useState('developer');
  const [activeTerm, setActiveTerm] = useState('developer');
  const [message, setMessage] = useState('');
  const [favoritedJobIds, setFavoritedJobIds] = useState(new Set());
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const jobsQuery = useInfiniteQuery({
    queryKey: ['jobs', activeTerm],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await searchJobs(activeTerm, LIMIT, pageParam);
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (
      (lastPage.results || []).length === LIMIT ? pages.length * LIMIT : undefined
    ),
  });

  const favoriteMutation = useMutation({
    mutationFn: (job) => addFavorite('guest', 'job', job),
    onSuccess: (_, job) => {
      const jobId = job.id || job._id || job.objective;
      setFavoritedJobIds((prev) => new Set(prev).add(jobId));
      setMessage(t('jobs.savedMsg'));
      queryClient.invalidateQueries({ queryKey: ['favorites', 'guest'] });
      window.setTimeout(() => setMessage(''), 3000);
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || t('jobs.couldNotSave'));
      window.setTimeout(() => setMessage(''), 3000);
    },
  });

  const jobs = useMemo(() => (
    getUniqueJobs(jobsQuery.data?.pages.flatMap((page) => page.results || []) || [])
  ), [jobsQuery.data]);

  const handleSearch = (event) => {
    event.preventDefault();
    const searchTerm = query.trim();
    if (!searchTerm) return;
    setActiveTerm(searchTerm);
  };

  const handleFavorite = (job) => {
    const jobId = job.id || job._id || job.objective;

    if (favoritedJobIds.has(jobId)) {
      setMessage(t('jobs.alreadySaved'));
      window.setTimeout(() => setMessage(''), 3000);
      return;
    }

    favoriteMutation.mutate(job);
  };

  const isInitialLoading = jobsQuery.isLoading;
  const isSearching = jobsQuery.isFetching && !jobsQuery.isFetchingNextPage;
  const errorMessage = jobsQuery.error ? t('jobs.error') : '';

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
            {t('jobs.eyebrow')}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
            {t('jobs.title')}
          </h1>
          <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
            {t('jobs.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full gap-2 sm:w-auto">
          <label className="sr-only" htmlFor="job-search">{t('jobs.searchLabel')}</label>
          <input
            id="job-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('jobs.placeholder')}
            className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearching ? t('common.searching') : t('common.search')}
          </button>
        </form>
      </div>

      {message && (
        <p className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100">
          {message}
        </p>
      )}

      {errorMessage && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          {errorMessage}
        </p>
      )}

      {!isInitialLoading && jobs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{t('jobs.emptyTitle')}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {t('jobs.emptyDesc')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {jobs.map((job, index) => {
            const jobId = job.id || job._id || `${job.objective}-${index}`;
            const organization = job.organizations?.[0]?.name || t('jobs.company');
            const location = job.locations?.join(', ') || t('jobs.location');

            return (
              <article
                key={jobId}
                className="rounded-lg border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
                      {job.objective || t('jobs.untitled')}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {organization}
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {job.type?.replace(/-/g, ' ') || t('jobs.role')}
                  </span>
                </div>

                {job.tagline && (
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    {job.tagline}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span>{location}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/job/${jobId}`, { state: job })}
                      className="rounded-md bg-blue-600 px-3 py-1.5 font-medium text-white transition hover:bg-blue-700"
                    >
                      {t('common.details')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFavorite(job)}
                      disabled={favoritedJobIds.has(jobId) || favoriteMutation.isPending}
                      className="rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      {favoritedJobIds.has(jobId) ? t('common.saved') : t('common.save')}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {(isInitialLoading || jobsQuery.isFetchingNextPage) && (
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('jobs.loading')}
        </p>
      )}

      {jobsQuery.hasNextPage && jobs.length > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => jobsQuery.fetchNextPage()}
            disabled={jobsQuery.isFetchingNextPage}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            {t('common.loadMore')}
          </button>
        </div>
      )}
    </section>
  );
};

export default JobsPage;
