// src/pages/JobsPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchJobs } from '../services/torreService';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const navigate = useNavigate();

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await searchJobs({ term: 'developer' }, limit, offset);
      const data = res.data;

      if (data.length < limit) {
        setHasMore(false);
      }
      setJobs(prev => [...prev, ...data]);
    } catch (err) {
      console.error('❌ Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setOffset(prev => prev + limit);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-gray-900 dark:text-white bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">💼 Job Openings</h2>

      {jobs.length === 0 && !loading && <p>No vacancies found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {jobs.map(job => (
          <div
            key={job.id}
            onClick={() => navigate(`/job/${job.id}`, { state: job })}
            className="bg-white dark:bg-gray-800 shadow p-4 rounded cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{job.objective}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-1">{job.tagline}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Tipo: {job.type?.replace(/-/g, ' ') || 'Não informado'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Local: {job.locations?.join(', ') || 'Remoto'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Empresa: {job.organizations?.[0]?.name || 'Desconhecida'}
            </p>
          </div>
        ))}
      </div>

      {loading && <p className="mt-4">🔄 Loading jobs...</p>}

      {hasMore && !loading && (
        <button
          onClick={handleLoadMore}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Load more
        </button>
      )}
    </div>
  );
};

export default JobsPage;
