import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SearchPeople = () => {
  const [term, setTerm] = useState('');
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setPeople([]);

    try {
      const response = await axios.post('https://search.torre.co/opportunities/_search', {
        id: { term: term || 'developer' },
        membersCloseConnections: false,
        penalizeOverqualified: false
      });

      const allMembers = response.data.results.flatMap(r => r.members || []);
      const uniqueMembers = Array.from(
        new Map(allMembers.map(member => [member.username, member])).values()
      );

      setPeople(uniqueMembers);
    } catch (err) {
      console.error('Erro ao buscar pessoas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (person) => {
    try {
      await axios.post('http://localhost:3001/api/torre/favorites', {
        userId: 'guest',
        itemId: person.username,
        type: 'profile',
        data: {
          name: person.name,
          username: person.username,
          picture: person.picture,
          headline: person.professionalHeadline
        }
      });
      alert(`⭐ Perfil @${person.username} favorite successfully!`);
    } catch (err) {
      if (err.response?.status === 400) {
        alert(`⚠️ O perfil @${person.username} Are already in our favorites.`);
      } else {
        console.error('Erro ao favoritar pessoa:', err);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Buscar Pessoas via Oportunidades</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Digite ex: developer"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {loading && <p>🔄 Carregando...</p>}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <div key={p.username} className="bg-white shadow p-4 rounded">
            <img
              src={p.picture || 'https://placehold.co/80x80?text=No+Image'}
              alt={p.name}
              className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
            />
            <h2 className="text-center font-semibold">{p.name}</h2>
            <p className="text-center text-sm text-gray-500">{p.professionalHeadline || 'Sem headline'}</p>

            <div className="flex justify-center gap-2 mt-2">
              <button
                onClick={() => navigate(`/genome/${p.username}`)}
                className="bg-green-600 text-white rounded px-3 py-1 hover:bg-green-700 text-sm"
              >
                Ver Genome
              </button>
              <button
                onClick={() => handleFavorite(p)}
                className="text-yellow-500 text-xl hover:scale-110"
                title="Favoritar"
              >
                ⭐
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPeople;
