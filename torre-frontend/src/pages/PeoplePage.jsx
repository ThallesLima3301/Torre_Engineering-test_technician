import { useEffect, useState } from "react";
import axios from "axios";

const PeoplePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/torre/favorites?userId=guest&type=profile");
      setFavorites(res.data);
    } catch (err) {
      console.error("Erro ao buscar favoritos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/torre/favorites/${id}`);
      setFavorites((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Erro ao remover favorito:", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">⭐ Favorite People</h2>

      {loading ? (
        <p>Loading favorites...</p>
      ) : favorites.length === 0 ? (
        <p className="text-gray-500">No people favorited yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div key={fav._id} className="bg-white p-4 shadow-md rounded-lg relative">
              <img
                src={fav.data.picture || "https://via.placeholder.com/100"}
                alt={fav.data.name}
                className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
              />
              <h3 className="text-lg font-semibold text-center">{fav.data.name}</h3>
              <p className="text-sm text-center text-gray-600">@{fav.data.username}</p>
              <p className="text-sm text-center text-gray-400">
                {fav.data.headline || "Sem headline"}
              </p>
              <button
                onClick={() => handleRemove(fav._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-600 text-xl"
                title="Desfavoritar"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PeoplePage;
