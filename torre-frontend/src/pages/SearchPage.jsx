// src/pages/SearchPage.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  searchJobs,
  fetchAnalytics,
  addFavorite,
} from "../services/torreService";

const SearchPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [term, setTerm] = useState("developer");
  const [analytics, setAnalytics] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState(new Set());
  const [messageMap, setMessageMap] = useState({});

  useEffect(() => {
    loadProfiles(term);
    loadAnalytics();
  }, []);

  const loadProfiles = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await searchJobs({ term: searchTerm }, 20);
      const allMembers = res.data.flatMap((job) => job.members || []);
      const unique = Array.from(
        new Map(allMembers.map((m) => [m.username, m])).values()
      );
      setProfiles(unique);
    } catch (err) {
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await fetchAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
    }
  };

  const handleFavorite = async (person) => {
    const username = person.username;
    if (favoritedIds.has(username)) {
      setMessageMap((prev) => ({
        ...prev,
        [username]: `⚠️ Profile @${username} already favorited.`,
      }));
      return;
    }

    try {
      await addFavorite("guest", "profile", person);
      setFavoritedIds((prev) => new Set(prev).add(username));
      setMessageMap((prev) => ({
        ...prev,
        [username]: `✅ Profile @${username} favorited!`,
      }));
    } catch (err) {
      console.error("Error favoriting profile:", err);
      setMessageMap((prev) => ({
        ...prev,
        [username]: "❌ Could not favorite.",
      }));
    }

    setTimeout(() => {
      setMessageMap((prev) => {
        const updated = { ...prev };
        delete updated[username];
        return updated;
      });
    }, 3000);
  };

  const handleSearch = () => {
    if (!term.trim()) return;
    loadProfiles(term.trim());
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen text-gray-900 dark:text-white bg-white dark:bg-gray-900">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Search profiles by area
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Ex: design, marketing, devops..."
          className="border border-gray-300 dark:border-gray-700 p-2 rounded w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">🔄 Loading profiles...</p>
      ) : profiles.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No profiles found for "{term}".
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {profiles.map((person) => {
            const picture = person.picture || "https://via.placeholder.com/100";
            const name = person.name || "Unknown";
            const username = person.username || "no-username";
            const headline = person.professionalHeadline || "No headline";
            const message = messageMap[username];

            return (
              <motion.div
                key={username}
                whileHover={{ scale: 1.03 }}
                className="bg-white dark:bg-gray-800 p-4 shadow-md rounded-lg"
              >
                <img
                  src={picture}
                  alt={name}
                  className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                />
                <h3 className="text-lg font-semibold text-center">{name}</h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300">@{username}</p>

                <div className="flex flex-col items-center mt-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className={`text-xl ${favoritedIds.has(username)
                        ? "text-yellow-300"
                        : "text-yellow-400 hover:text-yellow-500"
                      }`}
                    onClick={() => handleFavorite(person)}
                    title={
                      favoritedIds.has(username)
                        ? `@${username} já está nos favoritos.`
                        : "Adicionar aos favoritos"
                    }
                  >
                    ⭐
                  </motion.button>

                  {message && (
                    <p
                      className={`text-xs text-center mt-1 ${message.includes("✅")
                          ? "text-green-600"
                          : "text-red-500"
                        }`}
                    >
                      {message}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {analytics.length > 0 && (
        <div className="mt-12 max-w-xl mx-auto">
          <h3 className="text-xl font-semibold mb-2 text-center">📊 Most searched terms</h3>
          <ul className="bg-white dark:bg-gray-800 rounded shadow divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
            {analytics.map((item, index) => (
              <li key={index} className="flex justify-between p-3">
                <span>{item._id}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.count} searches
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
