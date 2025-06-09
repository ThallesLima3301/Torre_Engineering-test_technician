const errorHandler = (err, req, res, next) => {
  console.error('❌ Erro interno:', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Erro interno' });
};

module.exports = errorHandler;
