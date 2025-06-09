import { Link } from 'react-router-dom';
import Footer from '../layouts/Footer';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow text-center py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">Bem-vindo ao Torre Challenge</h1>
        <p className="text-lg text-gray-600 mb-10">
          Explore oportunidades, conheça talentos e salve seus favoritos com facilidade.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/jobs">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow">
              🔍 Buscar Vagas
            </button>
          </Link>

          <Link to="/search">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow">
              👤 Buscar Pessoas
            </button>
          </Link>

          <Link to="/people">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg shadow">
              ⭐ Favoritos
            </button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
