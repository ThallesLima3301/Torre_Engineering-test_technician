const { body, param } = require('express-validator');

const validateFavorite = [
  body('userId').trim().notEmpty().withMessage('userId is required'),
  body('itemId').trim().notEmpty().withMessage('itemId is required'),
  body('type').isIn(['job', 'profile']).withMessage('type must be job or profile'),
  body('data').isObject().withMessage('data must be an object'),
];

const validateJobSearch = [
  body().custom((_, { req }) => {
    const term = req.body.term || req.body.criteria?.text;
    if (typeof term === 'string' && term.trim()) return true;
    throw new Error('term is required');
  }),
  body('term').optional().isString().trim(),
  body('criteria.text').optional().isString().trim(),
  body('offset').optional().isInt({ min: 0 }).withMessage('offset must be an integer >= 0').toInt(),
  body('limit').optional().isInt({ min: 1, max: 50 }).withMessage('limit must be between 1 and 50').toInt(),
];

const validateSearch = [
  body('text').optional().isString().trim().withMessage('text must be a string'),
];

const validateGenome = [
  param('username').trim().notEmpty().withMessage('username is required'),
];

module.exports = {
  validateFavorite,
  validateJobSearch,
  validateSearch,
  validateGenome,
};
