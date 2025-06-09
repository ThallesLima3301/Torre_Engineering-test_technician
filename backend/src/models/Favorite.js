// src/models/Favorite.js
const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  userId: String, // depois podemos relacionar com autenticação
  itemId: String, // ID da vaga ou username
  type: { type: String, enum: ['job', 'profile'] },
  data: Object,
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
