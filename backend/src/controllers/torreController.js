const logger = require('../config/logger');
const {
  searchEntities,
  getGenome,
  searchJobs,
  getCurrencies,
} = require('../services/torreService');

const {
  logSearch,
  getTopSearchedTerms,
} = require('../services/searchService');

const {
  isDuplicateFavorite,
  createFavorite,
  findFavorites,
  deleteFavoriteById,
} = require('../services/favoriteService');

const t = (req, key, fallback) => (req.__ ? req.__(key) : fallback);

async function search(req, res) {
  try {
    const entities = await searchEntities(req.body);
    if (req.body.text) {
      await logSearch(req.body.text, 'profile');
    }
    return res.json(entities);
  } catch (err) {
    logger.error(`Error [searchEntities]: ${err.message}`);
    return res
      .status(err.response?.status || 500)
      .json({ message: t(req, 'errors.internal', 'Internal server error') });
  }
}

async function genome(req, res) {
  try {
    const data = await getGenome(req.params.username);
    await logSearch(req.params.username, 'profile');
    return res.json(data);
  } catch (err) {
    logger.error(`Error [getGenome]: ${err.message}`);
    return res
      .status(err.response?.status || 500)
      .json({ message: t(req, 'errors.internal', 'Internal server error') });
  }
}

async function jobs(req, res) {
  try {
    const { criteria = {}, offset = 0, limit = 10, term } = req.body;
    const searchTerm = (term || criteria.text || 'developer').trim();

    const response = await searchJobs({ text: searchTerm }, offset, limit);
    const results = Array.isArray(response) ? response : response.results || [];

    await logSearch(searchTerm, 'job');
    return res.json({
      results,
      total: response.total || results.length,
      upstreamTotal: response.upstreamTotal,
      offset,
      limit,
      term: searchTerm,
    });
  } catch (err) {
    logger.error(`Error [searchJobs]: ${err.message}`);
    return res
      .status(err.response?.status || 500)
      .json({ message: t(req, 'errors.fetchJobs', 'Error fetching jobs') });
  }
}

async function currencies(req, res) {
  try {
    const data = await getCurrencies();
    return res.json(data);
  } catch (err) {
    logger.error(`Error [getCurrencies]: ${err.message}`);
    return res
      .status(500)
      .json({ message: t(req, 'errors.fetchCurrencies', 'Error fetching currencies') });
  }
}

async function saveFavorite(req, res) {
  try {
    const { userId, itemId, type, data } = req.body;

    const exists = await isDuplicateFavorite({ userId, itemId, type });
    if (exists) {
      return res
        .status(400)
        .json({ message: t(req, 'errors.duplicate', 'Item already favorited') });
    }

    const favorite = await createFavorite({ userId, itemId, type, data });
    return res.status(201).json(favorite);
  } catch (err) {
    logger.error(`Error [saveFavorite]: ${err.message}`);
    return res
      .status(500)
      .json({ message: t(req, 'errors.saveFavorite', 'Error saving favorite') });
  }
}

async function getFavorites(req, res) {
  try {
    const { userId, type } = req.query;
    const query = {};
    if (userId) query.userId = userId;
    if (type) query.type = type;

    const favorites = await findFavorites(query);
    return res.json(favorites);
  } catch (err) {
    logger.error(`Error [getFavorites]: ${err.message}`);
    return res
      .status(500)
      .json({ message: t(req, 'errors.fetchFavorites', 'Error fetching favorites') });
  }
}

async function removeFavorite(req, res) {
  try {
    await deleteFavoriteById(req.params.id);
    return res.json({ message: t(req, 'success.favoriteRemoved', 'Favorite removed successfully') });
  } catch (err) {
    logger.error(`Error [removeFavorite]: ${err.message}`);
    return res
      .status(500)
      .json({ message: t(req, 'errors.removeFavorite', 'Error removing favorite') });
  }
}

async function getSearchAnalytics(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const analytics = await getTopSearchedTerms(limit);
    return res.json(analytics);
  } catch (err) {
    logger.error(`Error [analytics]: ${err.message}`);
    return res
      .status(500)
      .json({ message: t(req, 'errors.analytics', 'Error fetching analytics') });
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
