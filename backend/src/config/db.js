const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn('MONGO_URI is not set. Favorites and analytics require a database.');
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    return true;
  } catch (err) {
    console.warn(`Could not connect to MongoDB (${err.message}). Favorites and analytics require a database.`);
    return false;
  }
};

module.exports = connectDB;
