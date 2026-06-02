const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: String, required: true },
  type: { type: String, enum: ['job', 'profile'], required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

FavoriteSchema.index({ userId: 1, itemId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
