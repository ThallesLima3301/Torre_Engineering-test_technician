import { useState } from 'react';

const GenomePage = () => {
  const [username, setUsername] = useState('');
  const [genome, setGenome] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGenome = async () => {
    setLoading(true);
    setError('');
    setGenome(null);

    try {
      const res = await fetch(`http://localhost:3001/api/torre/genome/${username}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erro ao buscar perfil');
      setGenome(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Buscar Genome</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Digite o username"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <button
          onClick={fetchGenome}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Buscar
        </button>
      </div>

      {loading && <p className="text-gray-500">🔄 Buscando genome...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {genome && (
        <div className="mt-6 bg-white shadow-xl rounded-lg p-6 text-left">
          {/* Foto e nome */}
          <div className="flex items-center gap-4 mb-4">
            <img
              src={genome.person.picture}
              alt={genome.person.name}
              className="w-16 h-16 rounded-full object-cover border"
            />
            <div>
              <h2 className="text-xl font-bold">{genome.person.name}</h2>
              <p className="text-gray-600">{genome.person.professionalHeadline}</p>
              <p className="text-sm text-gray-400">Username: {genome.person.username}</p>
            </div>
          </div>

          {/* Skills */}
          {genome.strengths && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Skills principais</h3>
              <ul className="list-disc ml-6 text-gray-700">
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
