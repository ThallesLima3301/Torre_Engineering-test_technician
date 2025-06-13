const axios = require('axios');
const Favorite = require('../models/Favorite'); // ✅ Modelo de favoritos

const BASE_TORRE = 'https://torre.ai/api';
const BASE_SEARCH = 'https://search.torre.co';

// ⚠️ Desativado (exige autenticação)
async function searchEntities(criteria) {
  console.warn('⚠️ searchEntities desativado. Esta função requer autenticação.');
  return [];
}

// ✅ Buscar genome de usuário (sem token)
async function getGenome(username) {
  const response = await axios.get(`${BASE_TORRE}/genome/bios/${username}`);
  return response.data;
}

async function searchJobs(term = 'developer', offset = 0, limit = 10) {
  const response = await axios.post(
    `${BASE_SEARCH}/opportunities/_search`,
    {
      id: { term },
      offset,
      limit,
      membersCloseConnections: false,
      penalizeOverqualified: false
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    }
  );

  return response.data; 
}


// 🪙 Buscar moedas (opcional)
async function getCurrencies() {
  const response = await axios.get(`${BASE_TORRE}/currencies`);
  return response.data;
}

//
// 🎯 FAVORITOS
//

// ✅ Adicionar favorito
async function addFavorite(userId, type, data) {
  const exists = await Favorite.findOne({ userId, 'data.username': data.username });
  if (exists) throw new Error('Já favoritado.');

  const favorite = new Favorite({ userId, itemId: data.username, type, data });
  return await favorite.save();
}

// ✅ Buscar favoritos
async function fetchFavorites(userId, type) {
  return await Favorite.find({ userId, type });
}

// ✅ Remover favorito
async function removeFavorite(favoriteId) {
  return await Favorite.findByIdAndDelete(favoriteId);
}

module.exports = {
  searchEntities,
  getGenome,
  searchJobs,
  getCurrencies,
  addFavorite,
  fetchFavorites,
  removeFavorite
};
