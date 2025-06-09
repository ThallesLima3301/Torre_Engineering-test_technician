// src/models/Search.js
const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  term: { type: String, required: true },
  type: { type: String, enum: ['job', 'profile'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Search', SearchSchema);
