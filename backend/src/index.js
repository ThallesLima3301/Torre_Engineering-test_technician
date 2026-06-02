require('dotenv').config();
const i18n = require('./config/i18n');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const torreRoutes = require('./routes/torreRoutes');
const setupSwagger = require('./swagger');
const errorHandler = require('./middlewares/errorHandler');
const healthRoutes = require('./routes/healthRoutes');
const rateLimiter = require('./middlewares/rateLimiter');
const logger = require('./config/logger');

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS || '').split(','),
  'https://torre-engineering-test-technician-4.vercel.app',
  'http://localhost:5173',
].filter(Boolean).map((origin) => origin.trim()).filter(Boolean);

app.use(rateLimiter);
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());
app.use(i18n.init);

setupSwagger(app);
app.use('/api/torre', torreRoutes);
app.use('/api', healthRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

connectDB().finally(() => {
  app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
  });
});
