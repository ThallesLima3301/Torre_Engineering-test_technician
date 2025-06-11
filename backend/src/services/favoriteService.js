// src/services/favoriteService.js

const Favorite = require('../models/Favorite');

// 🔍 Check for duplicate favorite
async function isDuplicateFavorite({ userId, itemId, type }) {
  return await Favorite.findOne({ userId, itemId, type });
}

// ✅ Create a new favorite
async function createFavorite(data) {
  return await Favorite.create(data);
}

// 📄 Get all favorites matching query
async function findFavorites(query) {
  return await Favorite.find(query);
}

// 🗑️ Delete favorite by ID
async function deleteFavoriteById(id) {
  return await Favorite.findByIdAndDelete(id);
}

module.exports = {
  isDuplicateFavorite,
  createFavorite,
  findFavorites,
  deleteFavoriteById, // ✅ Nome agora está certo
};
