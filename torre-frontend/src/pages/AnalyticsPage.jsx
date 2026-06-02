import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnalytics } from '../services/torreService';

const AnalyticsPage = () => {
  const analyticsQuery = useQuery({
    queryKey: ['analytics', 10],
    queryFn: async () => {
      const res = await fetchAnalytics(10);
      return res.data || [];
    },
  });

  const terms = useMemo(() => analyticsQuery.data || [], [analyticsQuery.data]);
  const maxCount = useMemo(() => (
    terms.reduce((max, item) => Math.max(max, item.count || item.total || 0), 0)
  ), [terms]);

  return (
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
          Analytics
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
          Most searched terms
        </h1>
        <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-300">
          Search terms are normalized by the backend and grouped with MongoDB aggregation.
        </p>
      </div>

      {analyticsQuery.error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
          Could not load analytics. Search activity will appear here once the backend is available.
        </p>
      )}

      {analyticsQuery.isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading analytics...</p>
      ) : terms.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-950 dark:text-white">No search data yet</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Run job or people searches to generate analytics.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <ul className="space-y-4">
            {terms.map((item, index) => {
              const count = item.count || item.total || 0;
              const width = maxCount ? `${Math.max((count / maxCount) * 100, 6)}%` : '6%';

              return (
                <li key={`${item._id}-${index}`}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-gray-950 dark:text-white">{item._id}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {count} {count === 1 ? 'search' : 'searches'}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-3 rounded-full bg-blue-600 dark:bg-blue-400"
                      style={{ width }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
};

export default AnalyticsPage;
