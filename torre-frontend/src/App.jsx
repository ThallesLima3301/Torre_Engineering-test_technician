import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JobsPage from './pages/JobsPage';
import SearchPeople from './pages/SearchPeople';
import GenomePage from './pages/GenomePage';
import PeoplePage from "./pages/PeoplePage";
import Header from './layouts/Header';
import Footer from './layouts/Footer'; 
import HomePage from './pages/HomePage';
import JobDetailsPage from './pages/JobDetailsPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="p-6 flex-grow">
          <Routes>
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/search" element={<SearchPeople />} />
            <Route path="/genome/:username" element={<GenomePage />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/" element={<HomePage />} />     
            <Route path="/job/:id" element={<JobDetailsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />


          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
