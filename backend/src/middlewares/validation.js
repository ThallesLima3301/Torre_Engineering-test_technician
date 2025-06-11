const { body, validationResult } = require('express-validator');

const validateFavorite = [
  body('userId').notEmpty().withMessage('userId is required'),
  body('itemId').notEmpty().withMessage('itemId is required'),
  body('type').notEmpty().isIn(['job', 'profile']).withMessage('type must be job or profile'),
  body('data').notEmpty().withMessage('data is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateFavorite
};
