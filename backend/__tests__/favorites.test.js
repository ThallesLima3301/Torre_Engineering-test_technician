jest.mock('../src/models/Favorite', () => ({
  findOne: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockImplementation((data) => Promise.resolve({
    _id: 'favorite1',
    ...data,
  })),
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockResolvedValue([]),
  }),
  findByIdAndDelete: jest.fn().mockResolvedValue({ _id: 'favorite1' }),
}));

const request = require('supertest');
const express = require('express');
const torreRoutes = require('../src/routes/torreRoutes');
const Favorite = require('../src/models/Favorite');

describe('Favorites routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/torre', torreRoutes);
  });

  it('saves a profile favorite', async () => {
    const payload = {
      userId: 'guest',
      itemId: 'ada',
      type: 'profile',
      data: {
        name: 'Ada Lovelace',
        username: 'ada',
      },
    };

    const res = await request(app).post('/api/torre/favorites').send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject(payload);
    expect(Favorite.create).toHaveBeenCalledWith(payload);
  });

  it('validates required favorite fields', async () => {
    const res = await request(app).post('/api/torre/favorites').send({
      type: 'profile',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ msg: 'userId is required' }),
        expect.objectContaining({ msg: 'itemId is required' }),
        expect.objectContaining({ msg: 'data must be an object' }),
      ]),
    );
  });
});
