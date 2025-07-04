import { useState } from 'react';
import api from '../services/api';

const GenomePage = () => {
  const [username, setUsername] = useState('');
  const [genome, setGenome] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGenome = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError('');
    setGenome(null);

    try {
      const res = await api.get(`/api/torre/genome/${username}`);
      setGenome(res.data);
    } catch (err) {
      const message =
        err.response?.data?.message || 'Erro ao buscar perfil';
      setError(message);
      console.error('❌ Erro ao buscar genome:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-900 dark:text-white bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">🔬 Search Genome</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="border border-gray-300 dark:border-gray-600 p-2 rounded w-full bg-white dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={fetchGenome}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? '🔄 Searching...' : 'Search'}
        </button>
      </div>

      {loading && <p className="text-gray-500 dark:text-gray-400">🔄 Searching genome...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {genome?.person && (
        <div className="mt-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 text-left">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={genome.person.picture}
              alt={genome.person.name}
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
              <h2 className="text-xl font-bold">{genome.person.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {genome.person.professionalHeadline}
              </p>
              <p className="text-sm text-gray-400">Username: {genome.person.username}</p>
            </div>
          </div>

          {genome.strengths?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Main skills</h3>
              <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
                {genome.strengths.slice(0, 5).map((skill, idx) => (
                  <li key={idx}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenomePage;
