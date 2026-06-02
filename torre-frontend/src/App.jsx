import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnalyticsPage from './pages/AnalyticsPage';
import GenomePage from './pages/GenomePage';
import HomePage from './pages/HomePage';
import JobDetailsPage from './pages/JobDetailsPage';
import JobsPage from './pages/JobsPage';
import FavoritePeoplePage from './pages/PeoplePage';
import SearchPeople from './pages/SearchPeople';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import ErrorBoundary from './components/ErrorBoundary';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
        {t('notFound.title')}
      </h1>
      <p className="mt-3 text-gray-600 dark:text-gray-300">
        {t('notFound.description')}
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {t('notFound.home')}
      </Link>
    </section>
  );
}

function RouteErrorFallback({ onRetry }) {
  const { t } = useTranslation();

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-300">
        {t('appError.eyebrow')}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-950 dark:text-white">
        {t('appError.title')}
      </h1>
      <p className="mt-3 max-w-xl text-gray-600 dark:text-gray-300">
        {t('appError.description')}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          {t('appError.retry')}
        </button>
        <Link
          to="/"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-white dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {t('appError.home')}
        </Link>
      </div>
    </section>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <ErrorBoundary
      resetKey={location.pathname}
      renderFallback={({ reset }) => <RouteErrorFallback onRetry={reset} />}
    >
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
    </ErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-white">
        <Header />
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
