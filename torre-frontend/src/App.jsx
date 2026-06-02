import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import AnalyticsPage from './pages/AnalyticsPage';
import GenomePage from './pages/GenomePage';
import HomePage from './pages/HomePage';
import JobDetailsPage from './pages/JobDetailsPage';
import JobsPage from './pages/JobsPage';
import FavoritePeoplePage from './pages/PeoplePage';
import SearchPeople from './pages/SearchPeople';
import Header from './layouts/Header';
import Footer from './layouts/Footer';

function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
        Page not found
      </h1>
      <p className="mt-3 text-gray-600 dark:text-gray-300">
        The page you opened does not exist in this challenge app.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Go home
      </Link>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/job/:id" element={<JobDetailsPage />} />
            <Route path="/search" element={<SearchPeople />} />
            <Route path="/genome/:username?" element={<GenomePage />} />
            <Route path="/people" element={<FavoritePeoplePage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
