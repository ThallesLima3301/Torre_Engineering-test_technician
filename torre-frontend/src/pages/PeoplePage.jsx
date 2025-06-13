// src/pages/PeoplePage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import api from '../services/api';


const PeoplePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/api/torre/favorites", {
        params: { userId: 'guest', type: 'profile' }
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Erro ao buscar favoritos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/api/torre/favorites/${id}`);
      setFavorites((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-white bg-white dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">⭐ Favorite People</h2>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">🔄 Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">No people favorited yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const picture = fav.data?.picture || "https://via.placeholder.com/100";
            const name = fav.data?.name || "Nome desconhecido";
            const username = fav.data?.username || "sem-username";
            const headline = fav.data?.headline || "Sem headline";

            return (
              <div key={fav._id} className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-lg relative">
                <img
                  src={picture}
                  alt={name}
                  className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                />
                <h3 className="text-lg font-semibold text-center">{name}</h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300">@{username}</p>
                <p className="text-sm text-center text-gray-400">{headline}</p>
                <button
                  onClick={() => handleRemove(fav._id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-600 text-xl"
                  title="Desfavoritar"
                >
                  ❌
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
