// src/validators/torreValidator.js
const { body, param } = require('express-validator');

const validateFavorite = [
  body('userId').notEmpty().withMessage('userId é obrigatório'),
  body('itemId').notEmpty().withMessage('itemId é obrigatório'),
  body('type').isIn(['job', 'profile']).withMessage('type deve ser job ou profile'),
  body('data').notEmpty().withMessage('data é obrigatório'),
];

const validateJobSearch = [
  body('term').notEmpty().withMessage('term é obrigatório'),
  body('offset').optional().isInt({ min: 0 }).withMessage('offset deve ser um inteiro >= 0'),
  body('limit').optional().isInt({ min: 1 }).withMessage('limit deve ser >= 1'),
];

// ✅ Nova validação para busca de perfis
const validateSearch = [
  body('text').optional().isString().withMessage('text deve ser uma string'),
];

// ✅ Nova validação para username no genome
const validateGenome = [
  param('username').notEmpty().withMessage('username é obrigatório'),
];

module.exports = {
  validateFavorite,
  validateJobSearch,
  validateSearch,
  validateGenome,
};
