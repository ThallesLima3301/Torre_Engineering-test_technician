jest.mock('../src/models/Favorite', () => {
  return {
    __esModule: true,
    default: {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((data) => Promise.resolve(data)),
    },
  };
});

const request = require('supertest');
const express = require('express');
const cors = require('cors');
const torreRoutes = require('../src/routes/torreRoutes');

describe('POST /api/torre/favorites', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/torre', torreRoutes);
  });

  it('should save a favorite', async () => {
    const payload = { title: 'Teste', url: 'http://example.com' };
    const res = await request(app).post('/api/torre/favorites').send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Teste');
  });
});
