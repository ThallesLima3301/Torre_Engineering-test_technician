const Search = require('../models/Search');

// Salva termo de busca no banco
async function logSearch(term, type) {
  return await Search.create({ term, type });
}

// Retorna os termos mais buscados, com limite customizável
async function getTopSearchedTerms(limit = 10) {
  return await Search.aggregate([
    { $group: { _id: '$term', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
}

module.exports = {
  logSearch,
  getTopSearchedTerms
};
