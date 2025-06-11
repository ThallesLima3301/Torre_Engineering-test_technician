const request = require('supertest');
const express = require('express');
const healthRoutes = require('../src/routes/healthRoutes');

describe('Health & Version Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use('/api', healthRoutes);
  });

  it('should return health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('should return app version and name', async () => {
    const res = await request(app).get('/api/version');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('name');
  });
});
