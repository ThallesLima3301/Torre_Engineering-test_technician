const Favorite = require('../models/Favorite');

async function isDuplicateFavorite({ userId, itemId, type }) {
  return Favorite.findOne({ userId, itemId, type });
}

async function createFavorite(data) {
  return Favorite.create(data);
}

async function findFavorites(query) {
  return Favorite.find(query).sort({ createdAt: -1 });
}

async function deleteFavoriteById(id) {
  return Favorite.findByIdAndDelete(id);
}

module.exports = {
  isDuplicateFavorite,
  createFavorite,
  findFavorites,
  deleteFavoriteById,
};
