require('dotenv').config();
const i18n = require('./config/i18n');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const torreRoutes = require('./routes/torreRoutes');
const setupSwagger = require('./swagger');
const errorHandler = require('./middlewares/errorHandler');
const healthRoutes = require('./routes/healthRoutes');
const rateLimiter = require('./middlewares/rateLimiter');
const logger = require('./config/logger');

const app = express();

// ✅ Rate limit aplicado globalmente
app.use(rateLimiter);

// ✅ CORS com origem controlada
const corsOptions = {
  origin: ['http://localhost:5173', 'https://seuprojeto.vercel.app'],
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Ativa internacionalização
app.use(i18n.init);

setupSwagger(app);
app.use('/api/torre', torreRoutes);
app.use('/api', healthRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`❌ Failed to connect to database: ${err.message}`);
    process.exit(1);
  });
