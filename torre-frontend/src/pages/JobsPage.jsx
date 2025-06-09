import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ IMPORTAR
import axios from 'axios';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const navigate = useNavigate(); 

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3001/api/torre/jobs', {
        term: 'developer',
        offset,
        limit
      });

      if (res.data.length < limit) setHasMore(false);

      setJobs(prev => [...prev, ...res.data]);
    } catch (err) {
      console.error('❌ Erro ao buscar vagas:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [offset]);

  const handleLoadMore = () => {
    setOffset(prev => prev + limit);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">💼 Job Openings</h2>

      {jobs.length === 0 && !loading && <p>No vacancies found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => navigate(`/job/${job.id}`, { state: job })} // ✅ CLICK LEVA PARA A PÁGINA DE DETALHES
            className="bg-white shadow p-4 rounded cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{job.objective}</h3>
            <p className="text-gray-600 mb-1">{job.tagline}</p>
            <p className="text-sm text-gray-500 mb-1">
              Tipo: {job.type?.replace(/-/g, ' ') || 'Não informado'}
            </p>
            <p className="text-sm text-gray-500 mb-1">
              Local: {job.locations?.join(', ') || 'Remoto'}
            </p>
            <p className="text-sm text-gray-500">
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
