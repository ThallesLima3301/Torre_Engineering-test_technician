const express = require('express');
const router = express.Router();
const torreController = require('../controllers/torreController');
const {
  validateFavorite,
  validateGenome,
  validateJobSearch,
  validateSearch,
} = require('../validators/torreValidator');
const validate = require('../middlewares/validate');

router.post('/search', validateSearch, validate, torreController.search);
router.get('/genome/:username', validateGenome, validate, torreController.genome);
router.post('/jobs', validateJobSearch, validate, torreController.jobs);
router.get('/currencies', torreController.currencies);

router.post('/favorites', validateFavorite, validate, torreController.saveFavorite);
router.get('/favorites', torreController.getFavorites);
router.delete('/favorites/:id', torreController.removeFavorite);

router.get('/analytics', torreController.getSearchAnalytics);

module.exports = router;
