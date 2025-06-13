// src/pages/SearchPeople.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFavorite } from '../services/torreService';
import api from '../services/api';
import { motion } from 'framer-motion';

const SearchPeople = () => {
  const [term, setTerm] = useState('developer');
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favoritedIds, setFavoritedIds] = useState(new Set());
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/torre/search', { text: term });

      const data = Array.isArray(res.data) ? res.data : [];
      const flattened = data.flatMap((chunk) => chunk?.results || chunk || []);

      const filtered = flattened.filter((p) => p.username && p.name);
      setPeople(filtered);
    } catch (err) {
      console.error('Error fetching people:', err);
      setError('❌ Erro ao buscar perfis');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (person) => {
    if (favoritedIds.has(person.username)) {
      setMessage(`⚠️ @${person.username} já favoritado.`);
      return;
    }
    try {
      await addFavorite('guest', 'profile', person);
      setFavoritedIds((prev) => new Set(prev).add(person.username));
      setMessage(`✅ @${person.username} favoritado!`);
    } catch (err) {
      console.error('Error favoriting person:', err);
      setMessage('❌ Não foi possível favoritar.');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search People via Jobs</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="e.g. developer"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? '🔄 Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {message && <p className="text-center mb-4">{message}</p>}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p, idx) => (
          <motion.div
            key={`${p.username}-${idx}`}
            whileHover={{ scale: 1.02 }}
            className="bg-white shadow p-4 rounded flex flex-col items-center"
          >
            <img
              src={p.picture || 'https://placehold.co/80x80?text=No+Image'}
              alt={p.name}
              className="w-20 h-20 rounded-full mb-2 object-cover"
            />
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-500 mb-2">@{p.username}</p>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/genome/${p.username}`)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
              >
                View Genome
              </button>
              <button
                onClick={() => handleFavorite(p)}
                className={`text-xl ${
                  favoritedIds.has(p.username)
                    ? 'text-yellow-300'
                    : 'text-yellow-400 hover:text-yellow-500'
                }`}
                disabled={favoritedIds.has(p.username)}
                title="Favorite"
              >
                ⭐
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchPeople;
