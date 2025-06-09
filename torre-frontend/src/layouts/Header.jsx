import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-gray-800 text-white p-4">
    <nav className="flex gap-6 text-lg">
      <Link to="/jobs" className="hover:underline">Job positions</Link>
      <Link to="/search" className="hover:underline">Search People</Link>
      <Link to="/genome/thalleslima3301" className="hover:underline">My Genome</Link>
      <Link to="/people" className="hover:underline">People</Link>
      <Link to="/analytics" className="hover:underline">Analytics</Link>

    </nav>
  </header>
);

export default Header;
