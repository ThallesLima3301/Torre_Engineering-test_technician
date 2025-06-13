// src/routes/torreRoutes.js
// ✅ Handles all main API routes related to Torre functionalities

const express = require('express');
const router = express.Router();
const torreController = require('../controllers/torreController');
const { validateFavorite, validateJobSearch } = require('../validators/torreValidator');
const validate = require('../middlewares/validate');

// 🔍 Search routes
router.post('/search', torreController.search);                            // Search for people/entities
router.get('/genome/:username', torreController.genome);                   // Get user genome (profile)
router.post('/jobs', validateJobSearch, validate, torreController.jobs);   // Search for job opportunities
router.get('/currencies', torreController.currencies);                     // Get list of currencies (optional)

// ⭐ Favorites
router.post('/favorites', validateFavorite, validate, torreController.saveFavorite); // Save a favorite
router.get('/favorites', torreController.getFavorites);                    // Get favorites (by userId/type)
router.delete('/favorites/:id', torreController.removeFavorite);           // Remove a favorite by ID

// 📊 Analytics
router.get('/analytics', torreController.getSearchAnalytics);              // Get top searched terms

module.exports = router;
