// backend/__tests__/torreRoutes.test.js

jest.mock('../src/models/Search', () => ({
  aggregate: jest.fn().mockResolvedValue([
    { _id: 'developer', total: 5 },
    { _id: 'designer', total: 3 }
  ]),
}));

const request = require('supertest');
const express = require('express');
const torreRoutes = require('../src/routes/torreRoutes');

describe('GET /api/torre/analytics', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/torre', torreRoutes);
  });

  it('should return aggregated search terms', async () => {
    const res = await request(app).get('/api/torre/analytics');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ _id: 'developer' }),
      expect.objectContaining({ total: 5 }),
    ]));
  });
});
