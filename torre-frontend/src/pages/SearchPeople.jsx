import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addFavorite, searchPeople } from '../services/torreService';

const normalizePeople = (data) => (
  Array.from(
    new Map(
      (Array.isArray(data) ? data : [])
        .flatMap((chunk) => chunk?.results || chunk || [])
        .filter((person) => person.username && person.name)
        .map((person) => [person.username, person]),
    ).values(),
  )
);

const SearchPeople = () => {
  const [term, setTerm] = useState('developer');
  const [activeTerm, setActiveTerm] = useState('developer');
  const [favoritedIds, setFavoritedIds] = useState(new Set());
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const peopleQuery = useQuery({
    queryKey: ['people-search', activeTerm],
    queryFn: async () => {
      const res = await searchPeople(activeTerm);
      return res.data;
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: (person) => addFavorite('guest', 'profile', person),
    onSuccess: (_, person) => {
      setFavoritedIds((prev) => new Set(prev).add(person.username));
      setMessage(t('people.savedMsg', { username: person.username }));
      queryClient.invalidateQueries({ queryKey: ['favorites', 'guest'] });
      window.setTimeout(() => setMessage(''), 3000);
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || t('people.couldNotSave'));
      window.setTimeout(() => setMessage(''), 3000);
    },
  });

  const people = useMemo(() => normalizePeople(peopleQuery.data), [peopleQuery.data]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchTerm = term.trim();
    if (!searchTerm) return;
    setActiveTerm(searchTerm);
  };

  const handleFavorite = (person) => {
    if (favoritedIds.has(person.username)) {
      setMessage(t('people.alreadySaved', { username: person.username }));
      window.setTimeout(() => setMessage(''), 3000);
      return;
    }

    favoriteMutation.mutate(person);
  };

  const isSearching = peopleQuery.isFetching;
  const errorMessage = peopleQuery.error ? t('people.error') : '';

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
            {t('people.eyebrow')}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
            {t('people.title')}
          </h1>
          <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
            {t('people.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full gap-2 sm:w-auto">
          <label className="sr-only" htmlFor="people-search">{t('people.searchLabel')}</label>
          <input
            id="people-search"
            type="search"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder={t('people.placeholder')}
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

      {peopleQuery.isLoading ? (
        <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('people.loading')}
        </p>
      ) : people.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">{t('people.emptyTitle')}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {t('people.emptyDesc')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <article
              key={person.username}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-start gap-4">
                <img
                  src={person.picture || 'https://placehold.co/96x96?text=Profile'}
                  alt={person.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-gray-950 dark:text-white">
                    {person.name}
                  </h2>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    @{person.username}
                  </p>
                  {person.professionalHeadline && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                      {person.professionalHeadline}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/genome/${person.username}`)}
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {t('common.genome')}
                </button>
                <button
                  type="button"
                  onClick={() => handleFavorite(person)}
                  disabled={favoritedIds.has(person.username) || favoriteMutation.isPending}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  {favoritedIds.has(person.username) ? t('common.saved') : t('common.save')}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchPeople;
