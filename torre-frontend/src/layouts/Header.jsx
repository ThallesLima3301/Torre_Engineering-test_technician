import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-gray-800 text-white p-4">
    <nav className="flex gap-6 text-lg">
      <Link to="/jobs" className="hover:underline">Vagas</Link>
      <Link to="/search" className="hover:underline">Buscar Pessoas</Link>
      <Link to="/genome/thalleslima3301" className="hover:underline">Meu Genome</Link>
      <Link to="/people" className="hover:underline">Pessoas</Link>
      <Link to="/analytics" className="hover:underline">Analytics</Link>

    </nav>
  </header>
);

export default Header;
