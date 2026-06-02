jest.mock('../src/models/Search', () => ({
  create: jest.fn().mockResolvedValue({}),
}));

jest.mock('../src/services/torreService', () => ({
  searchEntities: jest.fn(),
  getGenome: jest.fn(),
  searchJobs: jest.fn().mockResolvedValue({
    results: [
      { id: 'job1', objective: 'Developer', members: [] },
      { id: 'job2', objective: 'Designer', members: [] },
    ],
    total: 2,
  }),
  getCurrencies: jest.fn(),
}));

const request = require('supertest');
const express = require('express');
const torreRoutes = require('../src/routes/torreRoutes');
const { searchJobs } = require('../src/services/torreService');

describe('POST /api/torre/jobs', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/torre', torreRoutes);
  });

  it('returns paginated jobs for the requested term', async () => {
    const payload = { term: 'developer', offset: 0, limit: 2 };
    const res = await request(app)
      .post('/api/torre/jobs')
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      total: 2,
      offset: 0,
      limit: 2,
      term: 'developer',
    });
    expect(res.body.results).toHaveLength(2);
    expect(res.body.results[0]).toHaveProperty('id', 'job1');
    expect(searchJobs).toHaveBeenCalledWith({ text: 'developer' }, 0, 2);
  });

  it('rejects empty job searches', async () => {
    const res = await request(app)
      .post('/api/torre/jobs')
      .send({ term: '', offset: 0, limit: 2 });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'term is required' }),
      ]),
    );
  });
});
