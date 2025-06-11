// backend/__tests__/torreJobs.test.js

// 1️⃣ Mock do modelo Search (arquivo src/models/Search.js)
jest.mock('../src/models/Search', () => ({
  create: jest.fn().mockResolvedValue({}),
}));

// 2️⃣ Mock do serviço torreService (arquivo src/services/torreService.js)
jest.mock('../src/services/torreService', () => ({
  searchEntities: jest.fn(),
  getGenome: jest.fn(),
  searchJobs: jest.fn().mockResolvedValue([
    { id: 'job1', objective: 'Developer', members: [] },
    { id: 'job2', objective: 'Designer', members: [] },
  ]),
  getCurrencies: jest.fn(),
}));

const request = require('supertest');
const express = require('express');
const cors = require('cors');

// 3️⃣ Caminho correto para suas rotas (src/routes/torreRoutes.js)
const torreRoutes = require('../src/routes/torreRoutes');

describe('POST /api/torre/jobs', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/torre', torreRoutes);
  });

  it('should return 200 and an array of jobs', async () => {
    const payload = { term: 'developer', offset: 0, limit: 2 };
    const res = await request(app)
      .post('/api/torre/jobs')
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toHaveProperty('id', 'job1');
    expect(res.body[1]).toHaveProperty('objective', 'Designer');
  });
});
