require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const torreRoutes = require('./routes/torreRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/torre', torreRoutes);
app.use(errorHandler); // <- middleware de erro

const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
