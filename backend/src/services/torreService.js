const axios = require('axios');

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

// ✅ Buscar vagas com suporte a paginação
async function searchJobs(term = 'developer', offset = 0, limit = 10) {
  const response = await axios.post(
    'https://search.torre.co/opportunities/_search',
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

  return response.data.results;
}


// 🪙 Buscar moedas (opcional)
async function getCurrencies() {
  const response = await axios.get(`${BASE_TORRE}/currencies`);
  return response.data;
}

module.exports = {
  searchEntities,
  getGenome,
  searchJobs,
  getCurrencies
};
