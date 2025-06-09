const {
  searchEntities,
  getGenome,
  searchJobs,
  getCurrencies
} = require('../services/torreService');

const Search = require('../models/Search');
const Favorite = require('../models/Favorite');

// 🔍 Buscar perfis (desativado por enquanto — exige token)
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

// 📄 Buscar genome de um usuário
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

// 💼 Buscar vagas com paginação
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

// ⭐ Salvar favorito
async function saveFavorite(req, res) {
  try {
    const { userId, itemId, type, data } = req.body;
    const favorite = await Favorite.create({ userId, itemId, type, data });
    res.status(201).json(favorite);
  } catch (err) {
    console.error('❌ ERRO [saveFavorite]:', err.message);
    res.status(500).json({ message: 'Erro ao salvar favorito.' });
  }
}

// ⭐ Buscar favoritos (por userId e tipo)
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
    res.status(500).json({ message: 'Erro ao buscar favoritos.' });
  }
}

// 🗑️ Remover favorito
async function removeFavorite(req, res) {
  try {
    const { id } = req.params;
    await Favorite.findByIdAndDelete(id);
    res.json({ message: 'Favorito removido com sucesso.' });
  } catch (err) {
    console.error('❌ ERRO [removeFavorite]:', err.message);
    res.status(500).json({ message: 'Erro ao remover favorito.' });
  }
}

// 📊 Analytics: termos mais buscados
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
