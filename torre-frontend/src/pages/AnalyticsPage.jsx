// src/pages/AnalyticsPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

const AnalyticsPage = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/torre/analytics');
        setTerms(res.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📊 Most searched terms</h1>

      {loading ? (
        <p>🔄 Loading...</p>
      ) : terms.length === 0 ? (
        <p className="text-gray-500">No terms found.</p>
      ) : (
        <ul className="space-y-2">
          {terms.map((item, index) => (
            <li
              key={index}
              className="flex justify-between bg-white p-3 rounded shadow text-gray-700"
            >
              <span className="font-medium">{item._id}</span>
              <span className="text-sm text-gray-500">{item.count}searches</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnalyticsPage;
