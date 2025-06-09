

//Handles logic for favoriting, analytics, and fetching genome data.

const {
  searchEntities,
  getGenome,
  searchJobs,
  getCurrencies
} = require('../services/torreService');

const Search = require('../models/Search');
const Favorite = require('../models/Favorite');

// 🔍 Search people/entities
async function search(req, res) {
  try {
    const entities = await searchEntities(req.body);
    if (req.body.text) {
      await Search.create({ term: req.body.text, type: 'profile' });
    }
    return res.json(entities);
  } catch (err) {
    console.error('❌ ERRO [searchEntities]:', err.message);
    return res.status(err.response?.status || 500).json({ message: err.message });
  }
}

// 📄 Search for a user's genome
async function genome(req, res) {
  try {
    const data = await getGenome(req.params.username);
    await Search.create({ term: req.params.username, type: 'profile' });
    return res.json(data);
  } catch (err) {
    console.error('❌ ERRO [getGenome]:', err.message);
    return res.status(err.response?.status || 500).json({ message: err.message });
  }
}

// 💼 Search for jobs with pagination
async function jobs(req, res) {
  try {
    const { term = 'developer', offset = 0, limit = 10 } = req.body;
    const data = await searchJobs(term, offset, limit);
    await Search.create({ term, type: 'job' });
    return res.json(data);
  } catch (err) {
    console.error('❌ ERRO [searchJobs]:', err.message);
    return res.status(err.response?.status || 500).json({ message: err.message });
  }
}

// 💱 Buscar moedas (opcional)
async function currencies(req, res) {
  try {
    const data = await getCurrencies();
    return res.json(data);
  } catch (err) {
    console.error('❌ ERRO [getCurrencies]:', err.message);
    return res.status(500).json({ message: 'Erro ao buscar moedas.' });
  }
}

// ⭐ Save favorite (com verificação de duplicata)
async function saveFavorite(req, res) {
  try {
    const { userId, itemId, type, data } = req.body;

    const exists = await Favorite.findOne({ userId, itemId, type });
    if (exists) {
      return res.status(400).json({ message: 'This item has already been favorited..' });
    }

    const favorite = await Favorite.create({ userId, itemId, type, data });
    res.status(201).json(favorite);
  } catch (err) {
    console.error('❌ ERRO [saveFavorite]:', err.message);
    res.status(500).json({ message: 'Error saving favorite.' });
  }
}

// ⭐ Get favorites by user and type
async function getFavorites(req, res) {
  try {
    const { userId, type } = req.query;
    const query = {};
    if (userId) query.userId = userId;
    if (type) query.type = type;

    const favorites = await Favorite.find(query);
    res.json(favorites);
  } catch (err) {
    console.error('❌ ERRO [getFavorites]:', err.message);
    res.status(500).json({ message: 'Error fetching favorites.' });
  }
}

// 🗑️ Remove favorite
async function removeFavorite(req, res) {
  try {
    const { id } = req.params;
    await Favorite.findByIdAndDelete(id);
    res.json({ message: 'Favorite removed successfully.' });
  } catch (err) {
    console.error('❌ ERRO [removeFavorite]:', err.message);
    res.status(500).json({ message: 'Error removing favorite.' });
  }
}

// 📊 Analytics: most searched terms
async function getSearchAnalytics(req, res) {
  try {
    const analytics = await Search.aggregate([
      { $group: { _id: '$term', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(analytics);
  } catch (err) {
    console.error('❌ ERRO [analytics]:', err.message);
    res.status(500).json({ message: 'Erro ao gerar analytics.' });
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
  getSearchAnalytics
};
