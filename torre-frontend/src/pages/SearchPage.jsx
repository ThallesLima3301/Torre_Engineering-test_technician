import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const PeoplePage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [term, setTerm] = useState("developer");
  const [analytics, setAnalytics] = useState([]);

  const fetchPeople = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/api/torre/jobs", {
        term: searchTerm,
        limit: 20,
      });

      const allMembers = res.data.flatMap((job) => job.members || []);
      const unique = Array.from(
        new Map(allMembers.map((m) => [m.username, m])).values()
      );

      setProfiles(unique);
    } catch (err) {
      console.error("Erro ao buscar perfis:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/torre/analytics");
      setAnalytics(res.data);
    } catch (err) {
      console.error("Erro ao buscar analytics:", err);
    }
  };

  useEffect(() => {
    fetchPeople(term);
    fetchAnalytics();
  }, []);

  const handleFavorite = async (person) => {
    try {
      await axios.post("http://localhost:3001/api/torre/favorites", {
        userId: "usuario-teste",
        itemId: person.username,
        type: "profile",
        data: person,
      });
      alert("Perfil favoritado!");
    } catch (err) {
      console.error("❌ Erro ao favoritar perfil:", err);
    }
  };

  const handleSearch = () => {
    if (!term.trim()) return;
    fetchPeople(term.trim());
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Buscar perfis por área
      </h2>

      {/* Campo de busca */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Ex: design, marketing, devops..."
          className="border border-gray-300 p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Buscar
        </button>
      </div>

      {/* Resultados */}
      {loading ? (
        <p className="text-center text-gray-500">🔄 Carregando perfis...</p>
      ) : profiles.length === 0 ? (
        <p className="text-center text-gray-500">
          Nenhum perfil encontrado para "{term}".
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {profiles.map((person) => (
            <motion.div
              key={person.username}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-4 shadow-md rounded-lg"
            >
              <img
                src={person.picture || "https://via.placeholder.com/100"}
                alt={person.name}
                className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
              />
              <h3 className="text-lg font-semibold text-center">
                {person.name}
              </h3>
              <p className="text-sm text-center text-gray-600">
                @{person.username}
              </p>
              <div className="flex justify-center mt-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="text-yellow-400 hover:text-yellow-500 text-xl"
                  onClick={() => handleFavorite(person)}
                >
                  ⭐
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Analytics */}
      {analytics.length > 0 && (
        <div className="mt-12 max-w-xl mx-auto">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 text-center">
            📊 Termos mais buscados
          </h3>
          <ul className="bg-white rounded shadow divide-y text-gray-700">
            {analytics.map((item, index) => (
              <li key={index} className="flex justify-between p-3">
                <span>{item._id}</span>
                <span className="text-sm text-gray-500">
                  {item.count} buscas
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
