const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: String, required: true },
  type: { type: String, required: true },
  data: {
    name: String,
    username: String,
    picture: String,
    headline: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
