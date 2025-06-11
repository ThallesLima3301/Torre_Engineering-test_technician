const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 100, // máximo de 100 requisições por minuto por IP
  message: {
    success: false,
    message: '❌ Limite de requisições excedido. Tente novamente em instantes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
