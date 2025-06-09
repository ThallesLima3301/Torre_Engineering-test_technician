//Contains all the main API routes.

const express = require('express');
const router = express.Router();
const torreController = require('../controllers/torreController');

// 📌 Rotas principais
router.post('/search', torreController.search);                
router.get('/genome/:username', torreController.genome);       // Genome do user
router.post('/jobs', torreController.jobs);                    // Search for vacancies
router.get('/currencies', torreController.currencies);         // Lista de moedas(n mal implementado)

// ⭐ Favoritos
router.post('/favorites', torreController.saveFavorite);       // Save favorites

router.get('/favorites', torreController.getFavorites);

// 📊 Analytics
router.get('/analytics', torreController.getSearchAnalytics);  // Top searched terms

router.delete('/favorites/:id', torreController.removeFavorite); 

module.exports = router;
