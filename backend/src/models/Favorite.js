//Defines the schema for saved favorites, with a unique index to prevent duplicates.

// src/models/Favorite.js
const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  userId: String, 
  itemId: String, 
  type: { type: String, enum: ['job', 'profile'] },
  data: Object,
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', FavoriteSchema);
