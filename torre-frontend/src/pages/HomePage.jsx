import { Link } from 'react-router-dom';
import Footer from '../layouts/Footer';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="flex-grow text-center py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-white">Welcome to Torre Challenge</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
          Explore opportunities, discover talent, and save your favorites with ease.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/jobs">
            <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow">
              🔍 Search Jobs
            </button>
          </Link>

          <Link to="/search">
            <button className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow">
              👤 Search People
            </button>
          </Link>

          <Link to="/people">
            <button className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-white px-6 py-3 rounded-lg shadow">
              ⭐ Favorites
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
