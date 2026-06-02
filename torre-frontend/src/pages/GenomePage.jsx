import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { fetchGenome } from '../services/torreService';

const GenomePage = () => {
  const { t } = useTranslation();
  const { username: routeUsername } = useParams();
  const [username, setUsername] = useState(routeUsername || '');
  const [requestedUsername, setRequestedUsername] = useState(routeUsername || '');

  useEffect(() => {
    if (routeUsername) {
      setUsername(routeUsername);
      setRequestedUsername(routeUsername);
    }
  }, [routeUsername]);

  const genomeQuery = useQuery({
    queryKey: ['genome', requestedUsername],
    queryFn: async () => {
      const res = await fetchGenome(requestedUsername);
      return res.data;
    },
    enabled: Boolean(requestedUsername),
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextUsername = username.trim();
    if (nextUsername) {
      setRequestedUsername(nextUsername);
    }
  };

  const genome = genomeQuery.data;
  const person = genome?.person;
  const strengths = genome?.strengths || [];
  const interests = genome?.interests || [];

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
          {t('genome.eyebrow')}
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
          {t('genome.title')}
        </h1>
        <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
          {t('genome.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6 flex max-w-2xl gap-2">
        <label className="sr-only" htmlFor="genome-username">{t('genome.usernameLabel')}</label>
        <input
          id="genome-username"
          type="search"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder={t('genome.placeholder')}
          className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={genomeQuery.isFetching}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {genomeQuery.isFetching ? t('common.searching') : t('common.search')}
        </button>
      </form>

      {genomeQuery.error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          {genomeQuery.error.response?.data?.message || t('genome.error')}
        </p>
      )}

      {genomeQuery.isLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{t('genome.loading')}</p>
      )}

      {!genomeQuery.isLoading && !person && !genomeQuery.error && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{t('genome.noProfileTitle')}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {t('genome.noProfileDesc')}
          </p>
        </div>
      )}

      {person && (
        <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <img
              src={person.picture || 'https://placehold.co/128x128?text=Profile'}
              alt={person.name}
              className="h-24 w-24 rounded-full object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                {person.name || t('genome.unnamed')}
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-300">
                {person.professionalHeadline || t('genome.noHeadline')}
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                @{person.username}
              </p>
            </div>
          </div>

          {strengths.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-950 dark:text-white">
                {t('genome.strengths')}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {strengths.slice(0, 10).map((skill) => (
                  <span
                    key={skill.id || skill.name}
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-100"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {interests.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-950 dark:text-white">
                {t('genome.interests')}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {interests.slice(0, 8).map((interest) => (
                  <span
                    key={interest.id || interest.name}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  >
                    {interest.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      )}
    </section>
  );
};

export default GenomePage;
