const mongoose = require('mongoose');

const searchLogSchema = new mongoose.Schema({
  type: { type: String, enum: ['job', 'person', 'genome'], required: true },
  term: { type: String },
  username: { type: String },
  resultCount: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchLog', searchLogSchema);
