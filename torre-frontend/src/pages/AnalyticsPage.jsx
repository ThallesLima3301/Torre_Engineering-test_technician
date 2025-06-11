// src/pages/AnalyticsPage.jsx
import { useEffect, useState } from 'react';
import { fetchAnalytics } from '../services/torreService';

const AnalyticsPage = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await fetchAnalytics();
        setTerms(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-900 dark:text-white bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">📊 Most searched terms</h1>

      {loading ? (
        <p>🔄 Loading...</p>
      ) : terms.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No terms found.</p>
      ) : (
        <ul className="space-y-2">
          {terms.map((item, index) => (
            <li
              key={index}
              className="flex justify-between bg-white dark:bg-gray-800 p-3 rounded shadow text-gray-700 dark:text-gray-200"
            >
              <span className="font-medium">{item._id}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.count} searches
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnalyticsPage;
