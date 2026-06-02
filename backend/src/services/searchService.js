const mongoose = require('mongoose');
const Search = require('../models/Search');
const logger = require('../config/logger');

async function logSearch(term, type) {
  const normalizedTerm = term?.trim().toLowerCase();
  if (!normalizedTerm) return null;

  // Analytics logging is best-effort: skip when there is no DB connection
  // (avoids Mongoose buffering hangs) and never fail the user's request if it errors.
  if (mongoose.connection.readyState !== 1) return null;

  try {
    return await Search.create({ term: normalizedTerm, type });
  } catch (err) {
    logger.warn(`Could not log search term "${normalizedTerm}": ${err.message}`);
    return null;
  }
}

async function getTopSearchedTerms(limit = 10) {
  return Search.aggregate([
    { $group: { _id: '$term', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
  ]);
}

module.exports = {
  logSearch,
  getTopSearchedTerms,
};
