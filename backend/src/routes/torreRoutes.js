const express = require('express');
const router = express.Router();
const torreController = require('../controllers/torreController');

// 📌 Rotas principais
router.post('/search', torreController.search);                // (⚠️ precisa de token — inativa por enquanto)
router.get('/genome/:username', torreController.genome);       // Genome do usuário
router.post('/jobs', torreController.jobs);                    // Buscar vagas
router.get('/currencies', torreController.currencies);         // Lista de moedas

// ⭐ Favoritos
router.post('/favorites', torreController.saveFavorite);       // Salvar favoritos
router.get('/favorites', torreController.getFavorites);

// 📊 Analytics
router.get('/analytics', torreController.getSearchAnalytics);  // Top termos buscados

router.delete('/favorites/:id', torreController.removeFavorite); 

module.exports = router;
