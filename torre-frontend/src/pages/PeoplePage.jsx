import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchFavorites, removeFavorite } from '../services/torreService';

const tabs = [
  { id: 'profile', label: 'People' },
  { id: 'job', label: 'Jobs' },
];

const PeoplePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const profilesQuery = useQuery({
    queryKey: ['favorites', 'guest', 'profile'],
    queryFn: async () => {
      const res = await fetchFavorites('guest', 'profile');
      return res.data || [];
    },
  });

  const jobsQuery = useQuery({
    queryKey: ['favorites', 'guest', 'job'],
    queryFn: async () => {
      const res = await fetchFavorites('guest', 'job');
      return res.data || [];
    },
  });

  const removeMutation = useMutation({
    mutationFn: (favorite) => removeFavorite(favorite._id),
    onSuccess: (_, favorite) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'guest', favorite.type] });
      setMessage('Favorite removed.');
      window.setTimeout(() => setMessage(''), 3000);
    },
    onError: () => {
      setMessage('Could not remove this favorite.');
      window.setTimeout(() => setMessage(''), 3000);
    },
  });

  const favorites = {
    profile: profilesQuery.data || [],
    job: jobsQuery.data || [],
  };
  const visibleFavorites = favorites[activeTab] || [];
  const loading = profilesQuery.isLoading || jobsQuery.isLoading;
  const error = profilesQuery.error || jobsQuery.error;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
          Shortlist
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
          Favorites
        </h1>
        <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
          Review saved Torre profiles and opportunities from the same workspace.
        </p>
      </div>

      <div className="mb-6 inline-flex rounded-md border border-gray-300 bg-white p-1 dark:border-gray-700 dark:bg-gray-900">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            {tab.label} ({favorites[tab.id].length})
          </button>
        ))}
      </div>

      {message && (
        <p className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100">
          {message}
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          Could not load favorites. Check the backend connection and try again.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading favorites...</p>
      ) : visibleFavorites.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">
            No saved {activeTab === 'profile' ? 'people' : 'jobs'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Save items from search results and they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleFavorites.map((favorite) => {
            const data = favorite.data || {};
            const isProfile = favorite.type === 'profile';
            const title = isProfile ? data.name || 'Unnamed profile' : data.objective || 'Untitled role';
            const subtitle = isProfile
              ? `@${data.username || 'unknown'}`
              : data.organization || 'Company not informed';

            return (
              <article
                key={favorite._id}
                className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-gray-950 dark:text-white">
                      {title}
                    </h2>
                    <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                      {subtitle}
                    </p>
                  </div>
                  {isProfile && (
                    <img
                      src={data.picture || 'https://placehold.co/80x80?text=Profile'}
                      alt={title}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {isProfile
                    ? data.headline || 'No headline provided.'
                    : data.tagline || data.locations?.join(', ') || 'No job summary provided.'}
                </p>

                <button
                  type="button"
                  onClick={() => removeMutation.mutate(favorite)}
                  disabled={removeMutation.isPending}
                  className="mt-5 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Remove
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default PeoplePage;
