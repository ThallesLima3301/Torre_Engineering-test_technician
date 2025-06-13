const logger = require('../config/logger');
const {
  searchEntities,
  getGenome,
  searchJobs,
  getCurrencies,
} = require('../services/torreService');

const {
  logSearch,
  getTopSearchedTerms
} = require('../services/searchService');

const {
  isDuplicateFavorite,
  createFavorite,
  findFavorites,
  deleteFavoriteById,
} = require('../services/favoriteService');

const t = (req, key, fallback) => req.__ ? req.__(key) : fallback;

// 🔍 Search people/entities
async function search(req, res) {
  try {
    const entities = await searchEntities(req.body);
    if (req.body.text) {
      await logSearch(req.body.text, 'profile');
    }
    return res.json(entities);
  } catch (err) {
    logger.error(`❌ ERRO [searchEntities]: ${err.message}`);
    return res.status(err.response?.status || 500).json({ message: t(req, 'errors.internal', 'Internal server error') });
  }
}

// 📄 Search for a user's genome
async function genome(req, res) {
  try {
    const data = await getGenome(req.params.username);
    await logSearch(req.params.username, 'profile');
    return res.json(data);
  } catch (err) {
    logger.error(`❌ ERRO [getGenome]: ${err.message}`);
    return res.status(err.response?.status || 500).json({ message: t(req, 'errors.internal', 'Internal server error') });
  }
}

// 💼 Search for jobs with pagination — ✅ CORRIGIDO AQUI
async function jobs(req, res) {
  try {
    const { criteria = {}, offset = 0, limit = 10 } = req.body;

    const term = criteria.text || 'developer';

    const response = await searchJobs({ text: term }, offset, limit); // ← Aqui é seguro

    await logSearch(term, 'job');

    return res.json({ results: response.results || [] });
  } catch (err) {
    console.error('❌ ERRO COMPLETO:', err);
    return res.status(err.response?.status || 500).json({
      message: 'Erro interno ao buscar vagas',
    });
  }
}



// 💱 Currencies
async function currencies(req, res) {
  try {
    const data = await getCurrencies();
    return res.json(data);
  } catch (err) {
    logger.error(`❌ ERRO [getCurrencies]: ${err.message}`);
    return res.status(500).json({ message: t(req, 'errors.fetchCurrencies', 'Error fetching currencies') });
  }
}

// ⭐ Save favorite
async function saveFavorite(req, res) {
  try {
    const { userId, itemId, type, data } = req.body;

    const exists = await isDuplicateFavorite({ userId, itemId, type });
    if (exists) {
      return res.status(400).json({ message: t(req, 'errors.duplicate', 'Item already favorited') });
    }

    const favorite = await createFavorite({ userId, itemId, type, data });
    res.status(201).json(favorite);
  } catch (err) {
    logger.error(`❌ ERRO [saveFavorite]: ${err.message}`);
    res.status(500).json({ message: t(req, 'errors.saveFavorite', 'Error saving favorite') });
  }
}

// ⭐ Get favorites
async function getFavorites(req, res) {
  try {
    const { userId, type } = req.query;
    const query = {};
    if (userId) query.userId = userId;
    if (type) query.type = type;

    const favorites = await findFavorites(query);
    res.json(favorites);
  } catch (err) {
    logger.error(`❌ ERRO [getFavorites]: ${err.message}`);
    res.status(500).json({ message: t(req, 'errors.fetchFavorites', 'Error fetching favorites') });
  }
}

// 🗑️ Remove favorite
async function removeFavorite(req, res) {
  try {
    const { id } = req.params;
    await deleteFavoriteById(id);
    res.json({ message: t(req, 'success.favoriteRemoved', 'Favorite removed successfully') });
  } catch (err) {
    logger.error(`❌ ERRO [removeFavorite]: ${err.message}`);
    res.status(500).json({ message: t(req, 'errors.removeFavorite', 'Error removing favorite') });
  }
}

// 📊 Analytics
async function getSearchAnalytics(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const analytics = await getTopSearchedTerms(limit);
    res.json(analytics);
  } catch (err) {
    logger.error(`❌ ERRO [analytics]: ${err.message}`);
    res.status(500).json({ message: t(req, 'errors.analytics', 'Error fetching analytics') });
  }
}

module.exports = {
  search,
  genome,
  jobs,
  currencies,
  saveFavorite,
  getFavorites,
  removeFavorite,
  getSearchAnalytics,
};
