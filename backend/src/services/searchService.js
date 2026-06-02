const Search = require('../models/Search');

async function logSearch(term, type) {
  const normalizedTerm = term?.trim().toLowerCase();
  if (!normalizedTerm) return null;
  return Search.create({ term: normalizedTerm, type });
}

async function getTopSearchedTerms(limit = 10) {
  return Search.aggregate([
    { $group: { _id: '$term', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
}

module.exports = {
  logSearch,
  getTopSearchedTerms,
};
