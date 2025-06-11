// src/routes/healthRoutes.js
const express = require('express');
const router = express.Router();
const packageJson = require('../../package.json');

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.get('/version', (req, res) => {
  res.json({
    version: packageJson.version,
    name: packageJson.name,
  });
});

module.exports = router;
